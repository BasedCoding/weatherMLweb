import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';

const WeatherChart = ({ csvData, predictedData }) => {
  const [startDate, setStartDate] = useState(moment().subtract(5, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().add(5, 'days').format('YYYY-MM-DD'));
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filtered = [...csvData, ...predictedData].filter(row => 
      moment(row.datetime).isSameOrAfter(startDate) && moment(row.datetime).isSameOrBefore(endDate)
    );
    setFilteredData(filtered);
    console.log("Filtered Data:", filtered); // Check the filtered data
  }, [startDate, endDate, csvData, predictedData]);

  const dates = filteredData.map(row => row.datetime);

  const temperatureChart = {
    data: [
      {
        x: dates,
        y: filteredData.map(row => row.temp),
        type: 'bar',
        name: 'Normal',
        marker: { color: 'blue' },
      },
      {
        x: dates,
        y: filteredData.map(row => row.feelslike),
        type: 'bar',
        name: 'Feels Like',
        marker: { color: 'orange' },
      },
      {
        x: dates,
        y: filteredData.map(row => row.tempmax),
        type: 'bar',
        name: 'Maximum',
        marker: { color: 'red' },
      },
      {
        x: dates,
        y: filteredData.map(row => row.tempmin),
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
    },
  };

  const precipChart = {
    data: [
      {
        x: dates,
        y: filteredData.map(row => row.precip),
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
        y: filteredData.map(row => row.windspeed),
        type: 'bar',
        name: 'Wind Speed',
        marker: { color: 'blue' },
      },
      {
        x: dates,
        y: filteredData.map(row => row.windgust),
        type: 'bar',
        name: 'Wind Gust',
        marker: { color: 'red' },
      },
      {
        x: dates,
        y: filteredData.map(row => row.sealevelpressure),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Pressure',
        line: { color: 'green' },
        yaxis: 'y2',
      },
    ],
    layout: {
      title: 'Wind Speed, Wind Gust, and Pressure',
      barmode: 'overlay',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Wind Speed / Gust (km/h)' },
      yaxis2: {
        title: 'Pressure (hPa)',
        overlaying: 'y',
        side: 'right',
      },
    },
  };

  return (
    <div>
      <div>
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <Plot data={temperatureChart.data} layout={temperatureChart.layout} />
      <Plot data={precipChart.data} layout={precipChart.layout} />
      <Plot data={windPressureChart.data} layout={windPressureChart.layout} />
    </div>
  );
};

export default WeatherChart;
