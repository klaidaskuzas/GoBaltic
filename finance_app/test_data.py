#!/usr/bin/env python3
import pandas as pd
import json
import os
import datetime

# Initialize data directory
data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(data_dir, exist_ok=True)

# Default categories
DEFAULT_CATEGORIES = {
    "expense": ["fuel", "salary", "car repair", "road tolls", "driver food"],
    "revenue": ["transport service", "other"]
}

# Save default categories
def save_categories(categories):
    with open(os.path.join(data_dir, "categories.json"), "w") as f:
        json.dump(categories, f)

# Sample expense data
sample_expenses = [
    {
        "date": "2025-04-01",
        "description": "Diesel fuel for truck LT123",
        "amount": 350.50,
        "category": "fuel",
        "type": "expense"
    },
    {
        "date": "2025-04-05",
        "description": "Driver salary - March",
        "amount": 1250.00,
        "category": "salary",
        "type": "expense"
    },
    {
        "date": "2025-04-07",
        "description": "Tire replacement",
        "amount": 780.25,
        "category": "car repair",
        "type": "expense"
    },
    {
        "date": "2025-04-10",
        "description": "Road tolls - Germany",
        "amount": 120.00,
        "category": "road tolls",
        "type": "expense"
    },
    {
        "date": "2025-03-15",
        "description": "Brake repair",
        "amount": 450.75,
        "category": "car repair",
        "type": "expense"
    },
    {
        "date": "2025-03-10",
        "description": "Diesel fuel for truck LT456",
        "amount": 320.30,
        "category": "fuel",
        "type": "expense"
    }
]

# Sample revenue data
sample_revenue = [
    {
        "date": "2025-04-12",
        "description": "Transport service for XYZ Company",
        "amount": 1800.00,
        "category": "transport service",
        "type": "revenue"
    },
    {
        "date": "2025-04-15",
        "description": "Transport service for ABC Corp",
        "amount": 2200.00,
        "category": "transport service",
        "type": "revenue"
    },
    {
        "date": "2025-04-18",
        "description": "Special cargo transport",
        "amount": 950.00,
        "category": "transport service",
        "type": "revenue"
    },
    {
        "date": "2025-03-25",
        "description": "Transport service for DEF Ltd",
        "amount": 1500.00,
        "category": "transport service",
        "type": "revenue"
    },
    {
        "date": "2025-03-20",
        "description": "Vehicle rental",
        "amount": 300.00,
        "category": "other",
        "type": "revenue"
    }
]

def save_expenses(df):
    df.to_csv(os.path.join(data_dir, "expenses.csv"), index=False)

def save_revenue(df):
    df.to_csv(os.path.join(data_dir, "revenue.csv"), index=False)

def main():
    # Save categories
    save_categories(DEFAULT_CATEGORIES)
    print("Saved default categories.")
    
    # Create and save expenses DataFrame
    expenses_df = pd.DataFrame(sample_expenses)
    save_expenses(expenses_df)
    print(f"Saved {len(sample_expenses)} expense entries.")
    
    # Create and save revenue DataFrame
    revenue_df = pd.DataFrame(sample_revenue)
    save_revenue(revenue_df)
    print(f"Saved {len(sample_revenue)} revenue entries.")
    
    print("\nSample data has been generated!")

if __name__ == "__main__":
    main()