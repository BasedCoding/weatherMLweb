import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import pickle

# Load the CSV data
df = pd.read_csv('Data/rawdata/melbourne 2024-01-01 to 2024-10-22.csv')

# Convert datetime to numerical feature
df['datetime'] = pd.to_datetime(df['datetime'])
df['days_since_start'] = (df['datetime'] - df['datetime'].min()).dt.days

# Define features and target variables
features = ['days_since_start']
target_variables = ['temp', 'feelslike', 'tempmax', 'tempmin', 'precip', 'windgust', 'windspeed', 'sealevelpressure']

# Initialize StandardScaler
scaler = StandardScaler()

# Function to create and save a linear regression model
def create_and_save_model(X, y, variable_name):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Save the model and scaler
    with open(f'ml_models/{variable_name}_model.pkl', 'wb') as f:
        pickle.dump((model, scaler), f)
    
    # Print model performance
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    print(f"{variable_name} - Train R² score: {train_score:.4f}, Test R² score: {test_score:.4f}")

# Create and save models for each target variable
for variable in target_variables:
    X = df[features]
    y = df[variable]
    create_and_save_model(X, y, variable)

print("All models have been created and saved as pickle files.")