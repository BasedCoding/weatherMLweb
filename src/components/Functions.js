import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import { Card, Input, Button, DatePicker, Space, Row, Col } from 'antd'; 
import axios from 'axios';
import sunnyIcon from './icons/sunny.jpg';
import rainyIcon from './icons/rainy.jpg';

const WeatherChart = () => {
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(8, 'days'));
  const [weatherData, setWeatherData] = useState([]);
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [rainPrediction, setRainPrediction] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/data?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`);
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

  const createResponsiveLayout = (title, xaxis, yaxis) => ({
    title: title,
    xaxis: { title: xaxis },
    yaxis: { title: yaxis },
    autosize: true,
    responsive: true,
    useResizeHandler: true,
    style: { width: '100%', height: '100%' },
    margin: { t: 30, l: 50, r: 30, b: 50 },
    barmode: 'overlay',
    showlegend: true, 
    hovermode: 'x unified'
  });

  const temperatureChart = {
    data: [
      { x: dates, y: weatherData.map(row => row.temp), type: 'bar', name: 'Normal', marker: { color: 'blue' } },
      { x: dates, y: weatherData.map(row => row.feelslike), type: 'bar', name: 'Feels Like', marker: { color: 'orange' } },
      { x: dates, y: weatherData.map(row => row.tempmax), type: 'bar', name: 'Maximum', marker: { color: 'red' } },
      { x: dates, y: weatherData.map(row => row.tempmin), type: 'bar', name: 'Minimum', marker: { color: 'green' } },
    ],
    layout: createResponsiveLayout('Temperature', 'Date', 'Temperature (°C)'),
  };

  const precipChart = {
    data: [
      { x: dates, y: weatherData.map(row => row.precip), type: 'scatter', mode: 'lines+markers', name: 'Precipitation', line: { color: 'blue' } },
    ],
    layout: createResponsiveLayout('Precipitation', 'Date', 'Precipitation (mm)'),
  };

  const windPressureChart = {
    data: [
      { x: dates, y: weatherData.map(row => row.sealevelpressure), type: 'scatter', mode: 'lines+markers', name: 'Pressure', line: { color: 'green' }, yaxis: 'y2' },
      { x: dates, y: weatherData.map(row => row.windgust), type: 'bar', name: 'Wind Gust', marker: { color: 'red' } },
      { x: dates, y: weatherData.map(row => row.windspeed), type: 'bar', name: 'Wind Speed', marker: { color: 'blue' } },
    ],
    layout: {
      ...createResponsiveLayout('Wind Speed, Wind Gust, and Pressure', 'Date', 'Wind Speed / Gust (km/h)'),
      yaxis2: { title: 'Pressure (hPa)', overlaying: 'y', side: 'right' },
    },
  };

  return (
    <Card bodyStyle={{ padding: '16px' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        {weatherData.length > 0 ? (
          <>
            <Plot data={temperatureChart.data} layout={temperatureChart.layout} style={{ width: '100%', height: '250px' }} />
            <Plot data={precipChart.data} layout={precipChart.layout} style={{ width: '100%', height: '250px' }} />
            <Plot data={windPressureChart.data} layout={windPressureChart.layout} style={{ width: '100%', height: '250px' }} />
          </>
        ) : (
          <p>Loading data...</p>
        )}

        <Card title="Rain Prediction" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <h1 style={{ fontWeight: 'bold' }}>Temperature (°C)</h1>
            <Input
              placeholder="Temperature"
              type="number"
              value={temp}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < -50) {
                  setTemp(-50);
                } else if (value > 50) {
                  setTemp(50);
                } else {
                  setTemp(value);
                }
              }}
              required
            />
            <h1 style={{ fontWeight: 'bold' }}>Humidity (%)</h1>
            <Input
              placeholder="Humidity"
              type="number"
              value={humidity}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) {
                  setHumidity(0);
                } else if (value > 100) {
                  setHumidity(100);
                } else {
                  setHumidity(value);
                }
              }}
              required
            />
            <Button onClick={handlePredictRain} type="primary" block>
              Predict Rain
            </Button>

            {rainPrediction !== null && (
              <div style={{ textAlign: 'center' }}>
                <h3>Prediction Result:</h3>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                <img 
                  src={rainPrediction === "Rain" ? rainyIcon : sunnyIcon} 
                  alt={rainPrediction} 
                  style={{ width: '80px', height: '80px', maxWidth: '100%' }} 
                />
                </div>
                <p>{rainPrediction}</p>
              </div>
            )}
          </Space>
        </Card>
      </Space>
    </Card>
  );
};

export default WeatherChart;
