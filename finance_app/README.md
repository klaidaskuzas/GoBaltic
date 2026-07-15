# GoBaltic Finance App

A comprehensive financial tracking application for GoBaltic Transportation company. This app allows for tracking expenses and revenue, visualizing financial data, and managing financial categories.

## Features

- Track expenses by date, description, amount, and category
- Track revenue with the same comprehensive fields
- Visualize financial data with interactive charts and graphs
- View summaries of income and expenses by month, year, and category
- Easy data entry forms for adding new transactions
- Customizable expense and revenue categories
- Responsive design that works on desktop and mobile

## Getting Started

### Prerequisites

The following Python packages are required to run the application:
- Flask
- Pandas
- Plotly
- Matplotlib

### Running the Application

#### Option 1: Using the run script (recommended)

1. Open a terminal in the project root directory
2. Run the following command:
   ```
   ./run_finance_app.sh
   ```
3. The application will start on port 8080
4. Open your browser and navigate to http://localhost:8080

#### Option 2: Manual start

1. Open a terminal in the project root directory
2. Run the following commands:
   ```
   cd finance_app
   python simple_app.py
   ```
3. The application will start on port 8080
4. Open your browser and navigate to http://localhost:8080

## Usage Guide

### Adding Expenses

1. Navigate to the "Expenses" tab from the navigation menu
2. Use the dedicated expense form by clicking on "Use New Expense Form" button
3. Fill in the required fields:
   - Date: The date the expense occurred
   - Description: A brief description of the expense
   - Amount: The monetary value (in EUR)
   - Category: Select from predefined categories
4. Click "Add Expense" to save the transaction
5. Your expense will be added to the database and appear in the list

### Adding Revenue

1. Navigate to the "Revenue" tab from the navigation menu
2. Fill in the required fields in the revenue form:
   - Date: The date the revenue was received
   - Description: A brief description of the revenue source
   - Amount: The monetary value (in EUR)
   - Category: Select from predefined categories
3. Click "Add Revenue" to save the transaction
4. Your revenue will be added to the database and appear in the list

### Dashboard

The dashboard provides a visual overview of your financial data:
- Monthly income and expenses chart
- Expense breakdown by category
- Revenue breakdown by category  
- Year-to-date financial summary
- Monthly cash flow analysis

### Settings

In the Settings tab, you can:
- Add new expense categories
- Add new revenue categories 
- Remove existing categories
- View all current categories

## Data Storage

All data is stored locally in CSV files:
- `finance_app/data/expenses.csv` - Expense transactions
- `finance_app/data/revenue.csv` - Revenue transactions
- `finance_app/data/categories.json` - Category definitions

## Troubleshooting

### Form Submission Issues

If you experience problems with the standard expense form:
1. Use the dedicated expense form by clicking "Use New Expense Form" on the Expenses page
2. This form has enhanced error handling and validation

### Data Not Appearing

If newly added data doesn't appear in tables or charts:
1. Make sure the data was successfully saved (you should see a success message)
2. Try refreshing the page
3. Check that the data files exist in the `finance_app/data/` directory

### Application Won't Start

If the application fails to start:
1. Make sure all required Python packages are installed
2. Check that port 8080 is not already in use
3. Check the application logs for any error messages

## Support

For further assistance, contact the GoBaltic IT department or file an issue in the project repository.