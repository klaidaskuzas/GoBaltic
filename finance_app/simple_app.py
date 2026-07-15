import flask
import pandas as pd
import os
import datetime
import json
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

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
        # Create an empty DataFrame
        df = pd.DataFrame(columns=["date", "description", "amount", "category", "type"])
        # Ensure the directory exists
        os.makedirs(os.path.dirname(EXPENSES_FILE), exist_ok=True)
        # Save the empty DataFrame to create the file
        df.to_csv(EXPENSES_FILE, index=False)
        return df

# Load or create revenue dataframe
def load_revenue():
    if os.path.exists(REVENUE_FILE):
        return pd.read_csv(REVENUE_FILE)
    else:
        # Create an empty DataFrame
        df = pd.DataFrame(columns=["date", "description", "amount", "category", "type"])
        # Ensure the directory exists
        os.makedirs(os.path.dirname(REVENUE_FILE), exist_ok=True)
        # Save the empty DataFrame to create the file
        df.to_csv(REVENUE_FILE, index=False)
        return df

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

@app.route('/')
def index():
    return redirect(url_for('dashboard'))

def calculate_summary(expenses_df, revenue_df):
    # Default summary if both dataframes are empty
    if expenses_df.empty and revenue_df.empty:
        return {
            'total_expenses': 0,
            'total_revenue': 0,
            'net_profit': 0,
            'expense_by_category': {},
            'revenue_by_category': {},
            'monthly_data': []
        }
    
    # Convert dates to datetime if dataframes are not empty
    if not expenses_df.empty:
        expenses_df['date'] = pd.to_datetime(expenses_df['date'])
        expenses_df['month'] = expenses_df['date'].dt.strftime('%Y-%m')
    
    if not revenue_df.empty:
        revenue_df['date'] = pd.to_datetime(revenue_df['date'])
        revenue_df['month'] = revenue_df['date'].dt.strftime('%Y-%m')
    
    # Calculate totals
    total_expenses = expenses_df['amount'].sum() if not expenses_df.empty else 0
    total_revenue = revenue_df['amount'].sum() if not revenue_df.empty else 0
    net_profit = total_revenue - total_expenses
    
    # Calculate expense breakdown by category
    expense_by_category = {}
    if not expenses_df.empty:
        expense_by_category = expenses_df.groupby('category')['amount'].sum().to_dict()
    
    # Calculate revenue breakdown by category
    revenue_by_category = {}
    if not revenue_df.empty:
        revenue_by_category = revenue_df.groupby('category')['amount'].sum().to_dict()
    
    # Prepare monthly data
    all_months = set()
    if not expenses_df.empty:
        all_months.update(expenses_df['month'].unique())
    if not revenue_df.empty:
        all_months.update(revenue_df['month'].unique())
    
    monthly_data = []
    for month in sorted(all_months):
        month_expenses = expenses_df[expenses_df['month'] == month]['amount'].sum() if not expenses_df.empty else 0
        month_revenue = revenue_df[revenue_df['month'] == month]['amount'].sum() if not revenue_df.empty else 0
        month_profit = month_revenue - month_expenses
        
        # Convert month format from YYYY-MM to Month Year (e.g., January 2025)
        month_date = pd.to_datetime(month + '-01')
        month_label = month_date.strftime('%B %Y')
        
        monthly_data.append({
            'month': month_label,
            'expenses': month_expenses,
            'revenue': month_revenue,
            'profit': month_profit
        })
    
    return {
        'total_expenses': total_expenses,
        'total_revenue': total_revenue,
        'net_profit': net_profit,
        'expense_by_category': expense_by_category,
        'revenue_by_category': revenue_by_category,
        'monthly_data': monthly_data
    }

@app.route('/dashboard')
def dashboard():
    expenses_df = load_expenses()
    revenue_df = load_revenue()
    categories = load_categories()
    
    # Calculate financial summary
    summary = calculate_summary(expenses_df, revenue_df)
    
    return render_template(
        'simple_dashboard.html',
        total_expenses=summary['total_expenses'],
        total_revenue=summary['total_revenue'],
        net_profit=summary['net_profit'],
        expense_by_category=summary['expense_by_category'],
        revenue_by_category=summary['revenue_by_category'],
        monthly_data=summary['monthly_data'],
        has_data=not (expenses_df.empty and revenue_df.empty),
        format_currency=format_currency
    )

@app.route('/expenses', methods=['GET', 'POST'])
def expenses():
    categories = load_categories()
    expenses_df = load_expenses()
    
    if request.method == 'POST':
        print(f"Received POST request to /expenses with data: {request.form}")
        
        # Check if form data exists
        if not request.form:
            print("Error: No form data received")
            flash('No form data received.', 'error')
            return render_template(
                'simple_expenses.html', 
                expense_categories=categories['expense'],
                expenses=[],
                today=datetime.date.today().strftime('%Y-%m-%d')
            )
        
        # Get form data with fallbacks
        date = request.form.get('date', '')
        description = request.form.get('description', '')
        amount = request.form.get('amount', '')
        category = request.form.get('category', '')
        
        print(f"Form data extracted: date={date}, description={description}, amount={amount}, category={category}")
        
        if date and description and amount and category:
            try:
                amount_float = float(amount)
                if amount_float <= 0:
                    print(f"Error: Amount must be greater than zero: {amount_float}")
                    flash('Amount must be greater than zero.', 'error')
                else:
                    print(f"Adding expense entry: {date}, {description}, {amount_float}, {category}")
                    expenses_df = add_entry(expenses_df, date, description, amount_float, category, 'expense')
                    print(f"Expense added, now saving to file")
                    save_expenses(expenses_df)
                    print(f"Expense saved successfully")
                    flash('Expense added successfully!', 'success')
                    return redirect(url_for('expenses'))
            except ValueError as e:
                print(f"Error: Invalid amount format: {amount} - {str(e)}")
                flash('Invalid amount format.', 'error')
        else:
            print(f"Error: Missing required fields in form submission")
            flash('All fields are required.', 'error')
    
    # Sort expenses by date (newest first)
    if not expenses_df.empty:
        expenses_df['date'] = pd.to_datetime(expenses_df['date'])
        expenses_df = expenses_df.sort_values('date', ascending=False)
    
    expense_list = expenses_df.to_dict('records') if not expenses_df.empty else []
    
    return render_template(
        'simple_expenses.html', 
        expense_categories=categories['expense'],
        expenses=expense_list,
        today=datetime.date.today().strftime('%Y-%m-%d')
    )

@app.route('/revenue', methods=['GET', 'POST'])
def revenue():
    categories = load_categories()
    revenue_df = load_revenue()
    
    if request.method == 'POST':
        print(f"Received POST request to /revenue with data: {request.form}")
        
        # Check if form data exists
        if not request.form:
            print("Error: No form data received")
            flash('No form data received.', 'error')
            return render_template(
                'simple_revenue.html', 
                revenue_categories=categories['revenue'],
                revenues=[],
                today=datetime.date.today().strftime('%Y-%m-%d')
            )
        
        # Get form data with fallbacks
        date = request.form.get('date', '')
        description = request.form.get('description', '')
        amount = request.form.get('amount', '')
        category = request.form.get('category', '')
        
        print(f"Form data extracted: date={date}, description={description}, amount={amount}, category={category}")
        
        if date and description and amount and category:
            try:
                amount_float = float(amount)
                if amount_float <= 0:
                    print(f"Error: Amount must be greater than zero: {amount_float}")
                    flash('Amount must be greater than zero.', 'error')
                else:
                    print(f"Adding revenue entry: {date}, {description}, {amount_float}, {category}")
                    revenue_df = add_entry(revenue_df, date, description, amount_float, category, 'revenue')
                    print(f"Revenue added, now saving to file")
                    save_revenue(revenue_df)
                    print(f"Revenue saved successfully")
                    flash('Revenue added successfully!', 'success')
                    return redirect(url_for('revenue'))
            except ValueError as e:
                print(f"Error: Invalid amount format: {amount} - {str(e)}")
                flash('Invalid amount format.', 'error')
        else:
            print(f"Error: Missing required fields in form submission")
            flash('All fields are required.', 'error')
    
    # Sort revenue by date (newest first)
    if not revenue_df.empty:
        revenue_df['date'] = pd.to_datetime(revenue_df['date'])
        revenue_df = revenue_df.sort_values('date', ascending=False)
    
    revenue_list = revenue_df.to_dict('records') if not revenue_df.empty else []
    
    return render_template(
        'simple_revenue.html', 
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
        'simple_settings.html',
        expense_categories='\n'.join(categories['expense']),
        revenue_categories='\n'.join(categories['revenue'])
    )

@app.route('/add_expense', methods=['GET'])
def add_expense_form():
    """Serve a dedicated expense form page"""
    categories = load_categories()
    
    return render_template(
        'add_expense.html', 
        expense_categories=categories['expense'],
        today=datetime.date.today().strftime('%Y-%m-%d')
    )

@app.route('/add_expense_direct', methods=['POST'])
def add_expense_direct():
    """Direct expense addition endpoint"""
    print(f"Received direct POST request to /add_expense_direct with data: {request.form}")
    
    categories = load_categories()
    expenses_df = load_expenses()
    
    # Get form data with fallbacks
    date = request.form.get('date', '')
    description = request.form.get('description', '')
    amount = request.form.get('amount', '')
    category = request.form.get('category', '')
    
    print(f"Form data extracted: date={date}, description={description}, amount={amount}, category={category}")
    
    if date and description and amount and category:
        try:
            amount_float = float(amount)
            if amount_float <= 0:
                print(f"Error: Amount must be greater than zero: {amount_float}")
                flash('Amount must be greater than zero.', 'error')
                return redirect(url_for('add_expense_form'))
            else:
                print(f"Adding expense entry: {date}, {description}, {amount_float}, {category}")
                expenses_df = add_entry(expenses_df, date, description, amount_float, category, 'expense')
                print(f"Expense added, now saving to file")
                save_expenses(expenses_df)
                print(f"Expense saved successfully")
                flash('Expense added successfully!', 'success')
                return redirect(url_for('expenses'))
        except ValueError as e:
            print(f"Error: Invalid amount format: {amount} - {str(e)}")
            flash('Invalid amount format.', 'error')
            return redirect(url_for('add_expense_form'))
    else:
        print(f"Error: Missing required fields in form submission")
        flash('All fields are required.', 'error')
        return redirect(url_for('add_expense_form'))

if __name__ == '__main__':
    # Ensure data directories exist
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Check if data files exist, create them if they don't
    if not os.path.exists(EXPENSES_FILE):
        df = pd.DataFrame(columns=["date", "description", "amount", "category", "type"])
        df.to_csv(EXPENSES_FILE, index=False)
        print(f"Created empty expenses file at {EXPENSES_FILE}")
    
    if not os.path.exists(REVENUE_FILE):
        df = pd.DataFrame(columns=["date", "description", "amount", "category", "type"])
        df.to_csv(REVENUE_FILE, index=False)
        print(f"Created empty revenue file at {REVENUE_FILE}")
    
    if not os.path.exists(CATEGORIES_FILE):
        categories = {
            "expense": DEFAULT_EXPENSE_CATEGORIES,
            "revenue": ["service fee", "transport service", "other"]
        }
        with open(CATEGORIES_FILE, 'w') as f:
            json.dump(categories, f)
        print(f"Created default categories file at {CATEGORIES_FILE}")
    
    print("Starting finance app on port 8080...")
    app.run(host='0.0.0.0', port=8080, debug=True)