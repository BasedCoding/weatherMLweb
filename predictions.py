import pandas as pd
import pickle
from datetime import timedelta

# Load models
models = {}
model_files = [
    'feelslike_model.pkl', 'precip_model.pkl', 'sealevelpressure_model.pkl',
    'temp_model.pkl', 'tempmin_model.pkl', 'tempmax_model.pkl', 'windgust_model.pkl', 'windspeed_model.pkl'
]

for model_file in model_files:
    with open(f'ml_models/{model_file}', 'rb') as f:
        models[model_file.split('_')[0]] = pickle.load(f)

# Load historical data
historical_data_file = 'Data/rawdata/melbourne 2024-01-01 to 2024-10-22.csv'
historical_data = pd.read_csv(historical_data_file)
historical_data['datetime'] = pd.to_datetime(historical_data['datetime'])

# Create new CSV with necessary features
new_csv_file = 'melbourne_weather_data.csv'
necessary_features = ['datetime', 'tempmax', 'tempmin', 'temp', 'feelslike', 'precip', 'windspeed', 'windgust', 'sealevelpressure']
new_data = historical_data[necessary_features]

# Generate predictions
last_date = historical_data['datetime'].max()
future_dates = pd.date_range(start=last_date + timedelta(days=1), end='2024-12-31')
future_data = pd.DataFrame({'datetime': future_dates})
future_data['days_since_start'] = (future_data['datetime'] - historical_data['datetime'].min()).dt.days

for feature, (model, scaler) in models.items():
    X = scaler.transform(future_data[['days_since_start']])
    future_data[feature] = model.predict(X)

# Combine historical and predicted data
combined_data = pd.concat([new_data, future_data[necessary_features]])
combined_data.to_csv(new_csv_file, index=False)