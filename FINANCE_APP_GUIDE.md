# GoBaltic Finance App User Guide

## Introduction

The GoBaltic Finance App is a simple yet powerful tool for tracking business expenses and revenue. It provides an easy-to-use interface for financial management and visualization of your company's financial data.

## Accessing the App

The finance app runs on:
```
http://localhost:8080
```

You can start it with:
```
./run_finance_app.sh
```

## Key Features

1. **Dashboard**
   - Overview of your financial status
   - Monthly revenue and expense charts
   - Breakdown of expenses and revenue by category
   - Net profit calculations

2. **Expense Tracking**
   - Add and view expenses
   - Categorize expenses
   - Search and filter expenses

3. **Revenue Tracking**
   - Add and view revenue entries
   - Categorize revenue sources
   - Search and filter revenue entries

4. **Category Management**
   - Customize expense and revenue categories
   - Add new categories or remove unused ones

## How to Use

### Adding an Expense

1. Go to the Expenses page
2. Fill in the "Add New Expense" form:
   - Date: Select the date of the expense
   - Description: Enter what the expense was for
   - Amount: Enter the amount in EUR
   - Category: Select the appropriate category
3. Click "Add Expense"
4. The expense will appear in the list and be reflected in the dashboard statistics

### Adding Revenue

1. Go to the Revenue page
2. Fill in the "Add New Revenue" form:
   - Date: Select the date of the revenue
   - Description: Enter the source or description
   - Amount: Enter the amount in EUR
   - Category: Select the appropriate category
3. Click "Add Revenue"
4. The revenue entry will appear in the list and be reflected in the dashboard statistics

### Managing Categories

1. Go to the Settings page
2. Edit the expense categories in the text area (one per line)
3. Edit the revenue categories in the text area (one per line)
4. Click "Save Changes"

### Viewing Financial Summary

1. Go to the Dashboard page
2. View your financial summary, including:
   - Total expenses
   - Total revenue
   - Net profit
   - Monthly performance chart
   - Expense breakdown by category
   - Revenue breakdown by category

## Troubleshooting

### Form Submission Issues

If you experience problems with form submission:

1. Make sure all required fields are filled in
2. Ensure amount values are valid numbers (e.g., 100.50)
3. Check the console logs for any error messages
4. Verify that the data directory has write permissions

### Data Persistence

All data is stored in the `finance_app/data` directory:
- `expenses.csv`: Contains all expense records
- `revenue.csv`: Contains all revenue records
- `categories.json`: Contains category configurations

If you need to back up your data, copy these files to a secure location.

## Sample Data

The application includes a test data generator that can create sample expense and revenue entries for demonstration purposes. To generate test data:

```
cd finance_app
python test_data.py
```

This will create sample entries that demonstrate the app's functionality.