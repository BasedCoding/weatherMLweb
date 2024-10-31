import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import { Card, Input, Button } from 'antd'; 
import axios from 'axios';
import sunnyIcon from './icons/sunny.jpg';
import rainyIcon from './icons/rainy.jpg';

const WeatherChart = () => {
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().subtract(8, 'days').format('YYYY-MM-DD'));
  const [weatherData, setWeatherData] = useState([]);
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [rainPrediction, setRainPrediction] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/data?start_date=${startDate}&end_date=${endDate}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An error occurred while fetching data');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Failed to fetch weather data: ${error.message}`);
    }
  };

  const handlePredictRain = async () => {
    try {
      const response = await axios.post('http://localhost:8000/predict-rain', null, {
        params: { temp: parseFloat(temp), humidity: parseFloat(humidity) }
      });
      setRainPrediction(response.data.rain ? 'Rain' : 'No Rain');
    } catch (error) {
      console.error('Error predicting rain:', error);
    }
  };

  const dates = weatherData.map(row => row.datetime);

  const temperatureChart = {
    data: [
      {
        x: dates,
        y: weatherData.map(row => row.temp),
        type: 'bar',
        name: 'Normal',
        marker: { color: 'blue' },
      },
      {
        x: dates,
        y: weatherData.map(row => row.feelslike),
        type: 'bar',
        name: 'Feels Like',
        marker: { color: 'orange' },
      },
      {
        x: dates,
        y: weatherData.map(row => row.tempmax),
        type: 'bar',
        name: 'Maximum',
        marker: { color: 'red' },
      },
      {
        x: dates,
        y: weatherData.map(row => row.tempmin),
        type: 'bar',
        name: 'Minimum',
        marker: { color: 'green' },
      },
    ],
    layout: {
      title: 'Temperature',
      barmode: 'overlay',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Temperature (°C)' },
      showlegend: true, 
      hovermode: 'x unified'
    },
  };

  const precipChart = {
    data: [
      {
        x: dates,
        y: weatherData.map(row => row.precip),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Precipitation',
        line: { color: 'blue' },
      },
    ],
    layout: {
      title: 'Precipitation',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Precipitation (mm)' },
    },
  };

  const windPressureChart = {
    data: [
      {
        x: dates,
        y: weatherData.map(row => row.sealevelpressure),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Pressure',
        line: { color: 'green' },
        yaxis: 'y2', // This indicates to use the second y-axis
      },
      {
        x: dates,
        y: weatherData.map(row => row.windgust),
        type: 'bar',
        name: 'Wind Gust',
        marker: { color: 'red' },
      },
      {
        x: dates,
        y: weatherData.map(row => row.windspeed),
        type: 'bar',
        name: 'Wind Speed',
        marker: { color: 'blue' },
      },
    ],
    layout: {
      title: 'Wind Speed, Wind Gust, and Pressure',
      barmode: 'overlay',
      xaxis: { title: 'Date' },
      yaxis: {
        title: 'Wind Speed / Gust (km/h)',
        side: 'left',
      },
      yaxis2: {
        title: 'Pressure (hPa)',
        overlaying: 'y',
        side: 'right',
        position: 0.95, 
      },
    },
  };
  

  return (
    <Card>
      <div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
  
        {weatherData.length > 0 ? (
          <>
            <Plot data={temperatureChart.data} layout={temperatureChart.layout} />
            <Plot data={precipChart.data} layout={precipChart.layout} />
            <Plot data={windPressureChart.data} layout={windPressureChart.layout} />
          </>
        ) : (
          <p>Loading data...</p>
        )}
  
        {/* Move Rain Prediction section here */}
        <div style={{ marginTop: '20px' }}>
          <h3>Rain Prediction</h3>
          <Input
            placeholder="Temperature"
            type="number"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            required
          />
          <Input
            placeholder="Humidity"
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            required
          />
          <Button onClick={handlePredictRain} type="primary" style={{ marginTop: '10px' }}>
            Predict Rain
          </Button>
  
          {rainPrediction !== null && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <h3>Prediction Result:</h3>
              {rainPrediction === "Rain" ? (
                <img src={rainyIcon} alt="Rainy" style={{ width: '64px', height: '64px' }} />
              ) : (
                <img src={sunnyIcon} alt="Sunny" style={{ width: '64px', height: '64px' }} />
              )}
              <p>{rainPrediction}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WeatherChart;