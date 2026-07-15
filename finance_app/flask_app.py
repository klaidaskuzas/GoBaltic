from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import pandas as pd
import os
import datetime
import json
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.utils

app = Flask(__name__)
app.secret_key = "gobaltic_finance_app_secret_key"

# Initialize data files
DATA_DIR = "data"
EXPENSES_FILE = os.path.join(DATA_DIR, "expenses.csv")
REVENUE_FILE = os.path.join(DATA_DIR, "revenue.csv")
CATEGORIES_FILE = os.path.join(DATA_DIR, "categories.json")

# Default expense categories
DEFAULT_EXPENSE_CATEGORIES = [
    "fuel", 
    "salary", 
    "car repair", 
    "road tolls", 
    "driver food",
    "maintenance",
    "office",
    "marketing",
    "insurance",
    "other"
]

# Create data directory if it doesn't exist
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Load or create categories
def load_categories():
    if os.path.exists(CATEGORIES_FILE):
        with open(CATEGORIES_FILE, 'r') as f:
            return json.load(f)
    else:
        categories = {
            "expense": DEFAULT_EXPENSE_CATEGORIES,
            "revenue": ["service fee", "transport service", "other"]
        }
        with open(CATEGORIES_FILE, 'w') as f:
            json.dump(categories, f)
        return categories

# Save categories
def save_categories(categories):
    with open(CATEGORIES_FILE, 'w') as f:
        json.dump(categories, f)

# Load or create expenses dataframe
def load_expenses():
    if os.path.exists(EXPENSES_FILE):
        return pd.read_csv(EXPENSES_FILE)
    else:
        return pd.DataFrame(columns=["date", "description", "amount", "category", "type"])

# Load or create revenue dataframe
def load_revenue():
    if os.path.exists(REVENUE_FILE):
        return pd.read_csv(REVENUE_FILE)
    else:
        return pd.DataFrame(columns=["date", "description", "amount", "category", "type"])

# Save expenses dataframe
def save_expenses(df):
    df.to_csv(EXPENSES_FILE, index=False)

# Save revenue dataframe
def save_revenue(df):
    df.to_csv(REVENUE_FILE, index=False)

# Add entry to dataframe
def add_entry(df, date, description, amount, category, entry_type):
    new_entry = pd.DataFrame({
        "date": [date],
        "description": [description],
        "amount": [float(amount)],
        "category": [category],
        "type": [entry_type]
    })
    return pd.concat([df, new_entry], ignore_index=True)

# Format currency
def format_currency(amount):
    return f"€{amount:,.2f}"

# Calculate summary statistics
def calculate_summary(expenses_df, revenue_df):
    if expenses_df.empty and revenue_df.empty:
        return {
            "total_expenses": 0,
            "total_revenue": 0,
            "net_profit": 0,
            "monthly_data": {},
            "expense_by_category": {},
            "revenue_by_category": {}
        }
    
    # Convert dates to datetime
    if not expenses_df.empty:
        expenses_df['date'] = pd.to_datetime(expenses_df['date'])
    if not revenue_df.empty:
        revenue_df['date'] = pd.to_datetime(revenue_df['date'])
    
    # Calculate totals
    total_expenses = expenses_df['amount'].sum() if not expenses_df.empty else 0
    total_revenue = revenue_df['amount'].sum() if not revenue_df.empty else 0
    net_profit = total_revenue - total_expenses
    
    # Calculate monthly data
    monthly_data = {}
    
    # Process expenses by month
    if not expenses_df.empty:
        expenses_df['year_month'] = expenses_df['date'].dt.strftime('%Y-%m')
        monthly_expenses = expenses_df.groupby('year_month')['amount'].sum()
        
        for ym, amount in monthly_expenses.items():
            if ym not in monthly_data:
                monthly_data[ym] = {"expenses": 0, "revenue": 0, "profit": 0}
            monthly_data[ym]["expenses"] = amount
    
    # Process revenue by month
    if not revenue_df.empty:
        revenue_df['year_month'] = revenue_df['date'].dt.strftime('%Y-%m')
        monthly_revenue = revenue_df.groupby('year_month')['amount'].sum()
        
        for ym, amount in monthly_revenue.items():
            if ym not in monthly_data:
                monthly_data[ym] = {"expenses": 0, "revenue": 0, "profit": 0}
            monthly_data[ym]["revenue"] = amount
    
    # Calculate profit for each month
    for ym in monthly_data:
        monthly_data[ym]["profit"] = monthly_data[ym]["revenue"] - monthly_data[ym]["expenses"]
    
    # Calculate expenses by category
    expense_by_category = {}
    if not expenses_df.empty:
        cat_expenses = expenses_df.groupby('category')['amount'].sum().to_dict()
        expense_by_category = cat_expenses
    
    # Calculate revenue by category
    revenue_by_category = {}
    if not revenue_df.empty:
        cat_revenue = revenue_df.groupby('category')['amount'].sum().to_dict()
        revenue_by_category = cat_revenue
    
    return {
        "total_expenses": total_expenses,
        "total_revenue": total_revenue,
        "net_profit": net_profit,
        "monthly_data": monthly_data,
        "expense_by_category": expense_by_category,
        "revenue_by_category": revenue_by_category
    }

# Create plotly charts
def create_monthly_chart(summary):
    if not summary['monthly_data']:
        return None
    
    # Sort months chronologically
    sorted_months = sorted(summary['monthly_data'].keys())
    months = sorted_months
    revenues = [summary['monthly_data'][m]['revenue'] for m in months]
    expenses = [summary['monthly_data'][m]['expenses'] for m in months]
    profits = [summary['monthly_data'][m]['profit'] for m in months]
    
    # Create subplots
    fig = make_subplots(
        rows=2, cols=1,
        subplot_titles=("Revenue vs Expenses by Month", "Net Profit by Month"),
        vertical_spacing=0.25,
        row_heights=[0.6, 0.4]
    )
    
    # Add revenue vs expenses traces
    fig.add_trace(
        go.Bar(x=months, y=revenues, name="Revenue", marker_color='#28a745'),
        row=1, col=1
    )
    
    fig.add_trace(
        go.Bar(x=months, y=expenses, name="Expenses", marker_color='#dc3545'),
        row=1, col=1
    )
    
    # Add profit trace (line chart)
    fig.add_trace(
        go.Scatter(x=months, y=profits, mode='lines+markers', name="Net Profit", 
                  line=dict(color='#0056b3', width=2),
                  marker=dict(size=8)),
        row=2, col=1
    )
    
    # Add a zero line for reference in profit chart
    fig.add_shape(
        type="line", line=dict(dash="dash", color="gray", width=1),
        x0=months[0], x1=months[-1], y0=0, y1=0, row=2, col=1
    )
    
    # Update layout
    fig.update_layout(
        height=600,
        barmode='group',
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="center", x=0.5),
        margin=dict(l=20, r=20, t=60, b=20),
        template="plotly_white"
    )
    
    return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

def create_category_pie_chart(data, title):
    if not data:
        return None
    
    labels = list(data.keys())
    values = list(data.values())
    
    fig = go.Figure(data=[go.Pie(
        labels=labels,
        values=values,
        hole=.4,
        marker_colors=px.colors.qualitative.Pastel
    )])
    
    fig.update_layout(
        title_text=title,
        height=400,
        template="plotly_white"
    )
    
    return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

@app.route('/')
def index():
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    expenses_df = load_expenses()
    revenue_df = load_revenue()
    categories = load_categories()
    summary = calculate_summary(expenses_df, revenue_df)
    
    monthly_chart = create_monthly_chart(summary)
    expense_category_chart = create_category_pie_chart(summary['expense_by_category'], 'Expense Categories')
    revenue_category_chart = create_category_pie_chart(summary['revenue_by_category'], 'Revenue Categories')
    
    return render_template(
        'dashboard.html',
        summary=summary,
        monthly_chart=monthly_chart,
        expense_category_chart=expense_category_chart,
        revenue_category_chart=revenue_category_chart,
        format_currency=format_currency
    )

@app.route('/expenses', methods=['GET', 'POST'])
def expenses():
    categories = load_categories()
    expenses_df = load_expenses()
    
    if request.method == 'POST':
        date = request.form['date']
        description = request.form['description']
        amount = request.form['amount']
        category = request.form['category']
        
        if date and description and amount and category:
            try:
                amount_float = float(amount)
                if amount_float <= 0:
                    flash('Amount must be greater than zero.', 'error')
                else:
                    expenses_df = add_entry(expenses_df, date, description, amount_float, category, 'expense')
                    save_expenses(expenses_df)
                    flash('Expense added successfully!', 'success')
                    return redirect(url_for('expenses'))
            except ValueError:
                flash('Invalid amount format.', 'error')
        else:
            flash('All fields are required.', 'error')
    
    # Sort expenses by date (newest first)
    if not expenses_df.empty:
        expenses_df['date'] = pd.to_datetime(expenses_df['date'])
        expenses_df = expenses_df.sort_values('date', ascending=False)
    
    expense_list = expenses_df.to_dict('records') if not expenses_df.empty else []
    
    return render_template(
        'expenses.html', 
        expense_categories=categories['expense'],
        expenses=expense_list,
        today=datetime.date.today().strftime('%Y-%m-%d')
    )

@app.route('/revenue', methods=['GET', 'POST'])
def revenue():
    categories = load_categories()
    revenue_df = load_revenue()
    
    if request.method == 'POST':
        date = request.form['date']
        description = request.form['description']
        amount = request.form['amount']
        category = request.form['category']
        
        if date and description and amount and category:
            try:
                amount_float = float(amount)
                if amount_float <= 0:
                    flash('Amount must be greater than zero.', 'error')
                else:
                    revenue_df = add_entry(revenue_df, date, description, amount_float, category, 'revenue')
                    save_revenue(revenue_df)
                    flash('Revenue added successfully!', 'success')
                    return redirect(url_for('revenue'))
            except ValueError:
                flash('Invalid amount format.', 'error')
        else:
            flash('All fields are required.', 'error')
    
    # Sort revenue by date (newest first)
    if not revenue_df.empty:
        revenue_df['date'] = pd.to_datetime(revenue_df['date'])
        revenue_df = revenue_df.sort_values('date', ascending=False)
    
    revenue_list = revenue_df.to_dict('records') if not revenue_df.empty else []
    
    return render_template(
        'revenue.html', 
        revenue_categories=categories['revenue'],
        revenues=revenue_list,
        today=datetime.date.today().strftime('%Y-%m-%d')
    )

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    categories = load_categories()
    
    if request.method == 'POST':
        expense_categories = request.form.get('expense_categories', '')
        revenue_categories = request.form.get('revenue_categories', '')
        
        # Process expense categories
        expense_cat_list = [cat.strip() for cat in expense_categories.split('\n') if cat.strip()]
        if not expense_cat_list:
            expense_cat_list = DEFAULT_EXPENSE_CATEGORIES
        
        # Process revenue categories
        revenue_cat_list = [cat.strip() for cat in revenue_categories.split('\n') if cat.strip()]
        if not revenue_cat_list:
            revenue_cat_list = ["transport service", "other"]
        
        # Update categories
        categories['expense'] = expense_cat_list
        categories['revenue'] = revenue_cat_list
        save_categories(categories)
        
        flash('Categories updated successfully!', 'success')
        return redirect(url_for('settings'))
    
    return render_template(
        'settings.html',
        expense_categories='\n'.join(categories['expense']),
        revenue_categories='\n'.join(categories['revenue'])
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8501, debug=True)