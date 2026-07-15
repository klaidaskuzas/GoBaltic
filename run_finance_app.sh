#!/bin/bash
# This script starts the GoBaltic Finance App

echo "Starting GoBaltic Finance Application..."
echo "Database files will be stored in finance_app/data/"

# Make sure the script is executable
chmod +x "$0"

# Ensure data directory exists
mkdir -p finance_app/data

# Kill any existing Python processes (optional, uncomment if needed)
# pkill -f "python.*simple_app.py" || true

# Run the finance application
cd finance_app && python simple_app.py

# Note: To stop the application, press Ctrl+C