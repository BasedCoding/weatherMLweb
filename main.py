from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import shutil
import os
import pandas as pd
import pickle
import numpy as np
from kmeansclustering import run_kmeans_clustering
from linear_regression import run_linear_regression
from logistic_regression import run_logistic_regression
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the output_plots directory to serve images
app.mount("/output_plots", StaticFiles(directory="output_plots"), name="output_plots")

# Load the trained logistic regression model for rain prediction
with open('ml_models/logistic_regression_model.pkl', 'rb') as file:
    rain_model = pickle.load(file)

@app.get("/")
async def root():
    return {"message": "Welcome to the Weather ML App API!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save uploaded file to disk
    file_location = f"temp/{file.filename}"
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Load data to extract column names
    data = pd.read_csv(file_location)
    return {"columns": data.columns.tolist(), "file_path": file_location}

@app.post("/run-kmeans")
async def run_kmeans(selected_columns: dict):
    file_path = selected_columns['file_path']
    columns = selected_columns['columns']
    results = run_kmeans_clustering(file_path, columns)
    return results

@app.post("/run-linear-regression")
async def run_linear_regression_endpoint(request: dict):
    file_path = request['file_path']
    features = request['features']
    target = request['target']
    results = run_linear_regression(file_path, features, target)
    return results

@app.post("/run-logistic-regression")
async def run_logistic_regression_endpoint(request: dict):
    file_path = request['file_path']
    features = request['features']
    target = request['target']
    results = run_logistic_regression(file_path, features, target)
    return results

@app.post("/predict-rain")
def predict_rain(temp: float, humidity: float):
    # Prepare the input data for prediction
    input_data = np.array([[temp, humidity]])
    
    # Make prediction using the pre-loaded model
    prediction = rain_model.predict(input_data)
    
    return {"rain": bool(prediction[0])}

@app.get("/data")
async def get_data(start_date: str, end_date: str):
    try:
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        
        data = pd.read_csv('Data/DataSets/melbourne_weather_data.csv') 
        data['datetime'] = pd.to_datetime(data['datetime'])
        filtered_data = data[(data['datetime'] >= start) & (data['datetime'] <= end)]
        
        if filtered_data.empty:
            raise HTTPException(status_code=404, detail="No data found for the specified date range")
        
        return filtered_data.to_dict(orient='records')
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


