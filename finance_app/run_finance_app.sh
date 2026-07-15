#!/bin/bash

# Kill any existing instances of the finance app
pkill -f "python simple_app.py" 2>/dev/null || true

echo "Starting GoBaltic Finance Application..."
cd "$(dirname "$0")"

# Check if data files exist
if [ ! -f "data/expenses.csv" ] || [ ! -f "data/revenue.csv" ]; then
  echo "No data found. Would you like to load sample data? (y/n)"
  read -r answer
  if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    echo "Loading sample data..."
    python test_data.py
  fi
fi

# Start the finance app
echo "Starting finance app on port 8080..."
python simple_app.py > app.log 2>&1 &
APP_PID=$!

# Wait for the app to start
sleep 3

# Check if the app is running
if ps -p $APP_PID > /dev/null; then
  echo "GoBaltic Finance App is running!"
  echo "Visit http://localhost:8080 to access the application"
  echo "Press Ctrl+C to stop the application"
  # Wait for user to press Ctrl+C
  tail -f app.log
else
  echo "Failed to start the finance app. Check app.log for errors."
  exit 1
fi