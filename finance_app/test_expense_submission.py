#!/usr/bin/env python3
import requests
import datetime

# URL for the expense form submission
url = "http://localhost:8080/expenses"

# Today's date in YYYY-MM-DD format
today = datetime.date.today().strftime('%Y-%m-%d')

# Form data to submit
data = {
    'date': today,
    'description': 'Test expense submission',
    'amount': '150.75',
    'category': 'fuel'
}

# Send the POST request to submit the form
print(f"Submitting test expense: {data}")
response = requests.post(url, data=data)

# Print the response
print(f"Response status code: {response.status_code}")
print(f"Response content: {response.text[:1000] if len(response.text) > 1000 else response.text}")

print("\nIf you got a 302 status code, the form submission worked and redirected.")
print("Otherwise, there may be an error with the form submission process.")