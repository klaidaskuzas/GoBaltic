import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os
import datetime
from datetime import date
import json

# Set page configuration
st.set_page_config(
    page_title="GoBaltic Finance Manager",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

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
        return pd.DataFrame(columns=["date", "description", "amount", "category"])

# Load or create revenue dataframe
def load_revenue():
    if os.path.exists(REVENUE_FILE):
        return pd.read_csv(REVENUE_FILE)
    else:
        return pd.DataFrame(columns=["date", "description", "amount", "category"])

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

# Custom CSS
def local_css():
    st.markdown("""
    <style>
    .main-header {
        font-size: 2.5rem;
        color: #0056b3;
        text-align: center;
        margin-bottom: 2rem;
    }
    .section-header {
        font-size: 1.8rem;
        color: #0056b3;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    .card {
        padding: 1.5rem;
        border-radius: 0.5rem;
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }
    .metric-label {
        font-size: 0.9rem;
        color: #666;
    }
    .metric-value {
        font-size: 1.4rem;
        font-weight: bold;
    }
    .positive {
        color: #28a745;
    }
    .negative {
        color: #dc3545;
    }
    </style>
    """, unsafe_allow_html=True)

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

# Dashboard section
def show_dashboard(expenses_df, revenue_df, categories):
    st.markdown("<h2 class='section-header'>Financial Dashboard</h2>", unsafe_allow_html=True)
    
    # Calculate summary
    summary = calculate_summary(expenses_df, revenue_df)
    
    # Key metrics row
    metrics_col1, metrics_col2, metrics_col3 = st.columns(3)
    
    with metrics_col1:
        st.markdown(f"""
        <div class='card'>
            <p class='metric-label'>Total Revenue</p>
            <p class='metric-value positive'>{format_currency(summary['total_revenue'])}</p>
        </div>
        """, unsafe_allow_html=True)
    
    with metrics_col2:
        st.markdown(f"""
        <div class='card'>
            <p class='metric-label'>Total Expenses</p>
            <p class='metric-value negative'>{format_currency(summary['total_expenses'])}</p>
        </div>
        """, unsafe_allow_html=True)
    
    with metrics_col3:
        profit_color = "positive" if summary['net_profit'] >= 0 else "negative"
        st.markdown(f"""
        <div class='card'>
            <p class='metric-label'>Net Profit</p>
            <p class='metric-value {profit_color}'>{format_currency(summary['net_profit'])}</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Monthly trend charts
    st.markdown("<h3>Monthly Trends</h3>", unsafe_allow_html=True)
    
    if summary['monthly_data']:
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
            vertical_spacing=0.2,
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
        )
        
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No monthly data available yet. Add some revenue and expense entries to see the trends.")
    
    # Category breakdown charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<h3>Expense Categories</h3>", unsafe_allow_html=True)
        if summary['expense_by_category']:
            fig = px.pie(
                values=list(summary['expense_by_category'].values()),
                names=list(summary['expense_by_category'].keys()),
                hole=0.4,
                color_discrete_sequence=px.colors.qualitative.Pastel
            )
            fig.update_layout(margin=dict(t=20, b=20, l=20, r=20))
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No expense data available yet.")
    
    with col2:
        st.markdown("<h3>Revenue Categories</h3>", unsafe_allow_html=True)
        if summary['revenue_by_category']:
            fig = px.pie(
                values=list(summary['revenue_by_category'].values()),
                names=list(summary['revenue_by_category'].keys()),
                hole=0.4,
                color_discrete_sequence=px.colors.qualitative.Pastel1
            )
            fig.update_layout(margin=dict(t=20, b=20, l=20, r=20))
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No revenue data available yet.")

# Expenses section
def show_expenses(expenses_df, categories):
    st.markdown("<h2 class='section-header'>Manage Expenses</h2>", unsafe_allow_html=True)
    
    # Add new expense form
    with st.form("add_expense_form"):
        st.markdown("<h3>Add New Expense</h3>", unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            expense_date = st.date_input("Date", value=date.today())
            expense_amount = st.number_input("Amount (€)", min_value=0.01, format="%.2f", step=10.0)
        
        with col2:
            expense_category = st.selectbox("Category", options=categories["expense"])
            expense_description = st.text_input("Description")
        
        submitted = st.form_submit_button("Add Expense")
        
        if submitted:
            if expense_description and expense_amount > 0:
                expenses_df = add_entry(
                    expenses_df,
                    expense_date.strftime('%Y-%m-%d'),
                    expense_description,
                    expense_amount,
                    expense_category,
                    "expense"
                )
                save_expenses(expenses_df)
                st.success("Expense added successfully!")
            else:
                st.error("Please fill in all fields correctly.")
    
    # Show expenses table
    st.markdown("<h3>Expense Records</h3>", unsafe_allow_html=True)
    
    # Filter options
    col1, col2 = st.columns(2)
    with col1:
        filter_category = st.selectbox("Filter by Category", options=["All Categories"] + categories["expense"], key="expense_filter")
    with col2:
        search_term = st.text_input("Search Description", key="expense_search")
    
    # Apply filters
    filtered_df = expenses_df.copy()
    if filter_category != "All Categories":
        filtered_df = filtered_df[filtered_df["category"] == filter_category]
    if search_term:
        filtered_df = filtered_df[filtered_df["description"].str.contains(search_term, case=False)]
    
    # Display table
    if not filtered_df.empty:
        # Sort by date (newest first)
        filtered_df = filtered_df.sort_values("date", ascending=False)
        
        # Format the dataframe for display
        display_df = filtered_df.copy()
        display_df.columns = ["Date", "Description", "Amount (€)", "Category", "Type"]
        display_df["Amount (€)"] = display_df["Amount (€)"].apply(lambda x: f"€{x:,.2f}")
        
        # Show only relevant columns
        st.dataframe(display_df[["Date", "Description", "Amount (€)", "Category"]], use_container_width=True)
    else:
        st.info("No expense records found with the current filters.")

# Revenue section
def show_revenue(revenue_df, categories):
    st.markdown("<h2 class='section-header'>Manage Revenue</h2>", unsafe_allow_html=True)
    
    # Add new revenue form
    with st.form("add_revenue_form"):
        st.markdown("<h3>Add New Revenue</h3>", unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            revenue_date = st.date_input("Date", value=date.today(), key="revenue_date")
            revenue_amount = st.number_input("Amount (€)", min_value=0.01, format="%.2f", step=100.0, key="revenue_amount")
        
        with col2:
            revenue_category = st.selectbox("Category", options=categories["revenue"], key="revenue_category")
            revenue_description = st.text_input("Description", key="revenue_description")
        
        submitted = st.form_submit_button("Add Revenue")
        
        if submitted:
            if revenue_description and revenue_amount > 0:
                revenue_df = add_entry(
                    revenue_df,
                    revenue_date.strftime('%Y-%m-%d'),
                    revenue_description,
                    revenue_amount,
                    revenue_category,
                    "revenue"
                )
                save_revenue(revenue_df)
                st.success("Revenue added successfully!")
            else:
                st.error("Please fill in all fields correctly.")
    
    # Show revenue table
    st.markdown("<h3>Revenue Records</h3>", unsafe_allow_html=True)
    
    # Filter options
    col1, col2 = st.columns(2)
    with col1:
        filter_category = st.selectbox("Filter by Category", options=["All Categories"] + categories["revenue"], key="revenue_filter")
    with col2:
        search_term = st.text_input("Search Description", key="revenue_search")
    
    # Apply filters
    filtered_df = revenue_df.copy()
    if filter_category != "All Categories":
        filtered_df = filtered_df[filtered_df["category"] == filter_category]
    if search_term:
        filtered_df = filtered_df[filtered_df["description"].str.contains(search_term, case=False)]
    
    # Display table
    if not filtered_df.empty:
        # Sort by date (newest first)
        filtered_df = filtered_df.sort_values("date", ascending=False)
        
        # Format the dataframe for display
        display_df = filtered_df.copy()
        display_df.columns = ["Date", "Description", "Amount (€)", "Category", "Type"]
        display_df["Amount (€)"] = display_df["Amount (€)"].apply(lambda x: f"€{x:,.2f}")
        
        # Show only relevant columns
        st.dataframe(display_df[["Date", "Description", "Amount (€)", "Category"]], use_container_width=True)
    else:
        st.info("No revenue records found with the current filters.")

# Settings section
def show_settings(categories):
    st.markdown("<h2 class='section-header'>Settings</h2>", unsafe_allow_html=True)
    
    st.markdown("<h3>Manage Categories</h3>", unsafe_allow_html=True)
    
    # Expense Categories
    st.subheader("Expense Categories")
    expense_categories = st.text_area("Expense Categories (one per line)", 
                                     value="\n".join(categories["expense"]), 
                                     height=200)
    
    # Revenue Categories
    st.subheader("Revenue Categories")
    revenue_categories = st.text_area("Revenue Categories (one per line)", 
                                     value="\n".join(categories["revenue"]), 
                                     height=150)
    
    if st.button("Save Categories"):
        # Process and save categories
        new_expense_categories = [cat.strip() for cat in expense_categories.split("\n") if cat.strip()]
        new_revenue_categories = [cat.strip() for cat in revenue_categories.split("\n") if cat.strip()]
        
        categories["expense"] = new_expense_categories
        categories["revenue"] = new_revenue_categories
        
        save_categories(categories)
        st.success("Categories updated successfully!")

# Main function
def main():
    # Apply custom CSS
    local_css()
    
    # Load data
    categories = load_categories()
    expenses_df = load_expenses()
    revenue_df = load_revenue()
    
    # Add 'type' column if not present
    if 'type' not in expenses_df.columns:
        expenses_df['type'] = 'expense'
    if 'type' not in revenue_df.columns:
        revenue_df['type'] = 'revenue'
    
    # App header
    st.markdown("<h1 class='main-header'>GoBaltic Finance Manager</h1>", unsafe_allow_html=True)
    
    # Sidebar navigation
    st.sidebar.title("Navigation")
    page = st.sidebar.radio("Go to", ["Dashboard", "Expenses", "Revenue", "Settings"])
    
    # Sidebar info
    st.sidebar.markdown("---")
    st.sidebar.info(
        "This application helps manage and track financial data for GoBaltic transportation services. "
        "Track revenue and expenses, view financial summaries, and analyze your business performance."
    )
    st.sidebar.markdown("---")
    
    # Display the selected page
    if page == "Dashboard":
        show_dashboard(expenses_df, revenue_df, categories)
    elif page == "Expenses":
        show_expenses(expenses_df, categories)
    elif page == "Revenue":
        show_revenue(revenue_df, categories)
    elif page == "Settings":
        show_settings(categories)

if __name__ == "__main__":
    main()