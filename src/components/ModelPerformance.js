import React, { useState } from 'react';
import axios from 'axios';
import './ModelPerformance.css';

const ModelPerformance = () => {
  // State all variables
  const [csvFile, setCsvFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [filePath, setFilePath] = useState('');
  const [results, setResults] = useState(null);

  // Manange file inputs
  const handleFileChange = (e) => setCsvFile(e.target.files[0]);

  // Upload file and get column data from server
  const handleFileUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      const response = await axios.post('http://localhost:8000/upload', formData);
      setColumns(response.data.columns);
      setFilePath(response.data.file_path);
      setSelectedColumns([]);
      setSelectedTarget('');
      setResults(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Select model and reset related columns and target
  const handleModelSelection = (model) => {
    setSelectedModel(model);
    setSelectedColumns([]);
    setSelectedTarget('');
    setResults(null);
  };

  // Update columns based on chosen model
  const handleColumnSelection = (column) => {
    setSelectedColumns(prev =>
      selectedModel === 'kmeans'
        ? prev.includes(column)
          ? prev.filter(col => col !== column)
          : [...prev, column]
        : column !== selectedTarget
          ? prev.includes(column)
            ? prev.filter(col => col !== column)
            : [...prev, column]
          : prev
    );
  };

  // Assign the target variable, clear it from the selected columns
  const handleTargetSelection = (column) => {
    setSelectedTarget(column);
    setSelectedColumns(prev => prev.filter(col => col !== column));
  };

  // Run the selected model, handle various cases in each model
  const handleRunModel = async () => {
    if (selectedModel === 'kmeans' && selectedColumns.length < 2) {
      alert("Please select at least two columns for KMeans clustering.");
      return;
    }
    if ((selectedModel === 'linear' || selectedModel === 'logistic') && (!selectedTarget || selectedColumns.length < 1)) {
      alert("Please select at least one feature and one target for regression.");
      return;
    }

    try {
      let response;
      if (selectedModel === 'kmeans') {
        response = await axios.post('http://localhost:8000/run-kmeans', { columns: selectedColumns, file_path: filePath });
      } else if (selectedModel === 'linear') {
        response = await axios.post('http://localhost:8000/run-linear-regression', { features: selectedColumns, target: selectedTarget, file_path: filePath });
      } else if (selectedModel === 'logistic') {
        response = await axios.post('http://localhost:8000/run-logistic-regression', { features: selectedColumns, target: selectedTarget, file_path: filePath });
      }
      setResults(response.data);
    } catch (error) {
      console.error(`Error running ${selectedModel}:`, error);
    }
  };

  return (
    <div className="form-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Model Performance Analysis</h1>

      {/* File upload section */}
      <div className="upload-section mb-4">
        <input type="file" onChange={handleFileChange} className="mb-2 w-full" />
        <button onClick={handleFileUpload} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Upload CSV</button>
      </div>

      {/* Model selection */}
      {columns.length > 0 && (
        <div className="model-selection mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Model</h2>
          <div className="btn-group flex flex-wrap gap-2">
            <button onClick={() => handleModelSelection('kmeans')} className="bg-green-500 text-white px-4 py-2 rounded flex-1">KMeans Clustering</button>
            <button onClick={() => handleModelSelection('linear')} className="bg-green-500 text-white px-4 py-2 rounded flex-1">Linear Regression</button>
            <button onClick={() => handleModelSelection('logistic')} className="bg-green-500 text-white px-4 py-2 rounded flex-1">Logistic Regression</button>
          </div>
        </div>
      )}

      {/* Column selection */}
      {selectedModel && (
        <div className="column-selection mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Columns for {selectedModel === 'kmeans' ? 'Clustering' : 'Regression'}</h2>
          {selectedModel !== 'kmeans' && (
            <div className="target-selection mb-4">
              <h3 className="text-lg font-medium mb-2">Select Target Variable</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {columns.map((col, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name="target"
                      value={col}
                      checked={selectedTarget === col}
                      onChange={() => handleTargetSelection(col)}
                      className="mr-2"
                    />
                    <span className="text-sm">{col}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <h3 className="text-lg font-medium mb-2">Select {selectedModel === 'kmeans' ? 'Columns' : 'Features'}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {columns.map((col, idx) => (
              <label key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnSelection(col)}
                  disabled={selectedModel !== 'kmeans' && selectedTarget === col}
                  className="mr-2"
                />
                <span className="text-sm">{col}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {/* Execute selected model */}
      {selectedModel && (
        <div className="run-section mb-4">
          <h2 className="text-xl font-semibold mb-2">Run {selectedModel === 'kmeans' ? 'KMeans Clustering' : selectedModel}</h2>
          <button onClick={handleRunModel} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Run {selectedModel}</button>
        </div>
      )}

      {/* Show results and plots based on selected model */}
      {results && (
        <div className="results">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <div className="graph-container flex flex-col items-center">
            {selectedModel === 'kmeans' && (
              <>
                <img src={`http://localhost:8000/output_plots/${results.originalPlot}`} alt="Original Data" className="w-full max-w-md mb-4" />
                <img src={`http://localhost:8000/output_plots/${results.clusteredPlot}`} alt="Clustered Data" className="w-full max-w-md mb-4" />
              </>
            )}
            {selectedModel === 'linear' && (
              <>
                <img src={`http://localhost:8000/output_plots/${results.predictedVsActual}`} alt="Predicted vs Actual" className="w-full max-w-md mb-4" />
                <img src={`http://localhost:8000/output_plots/${results.residuals}`} alt="Residuals" className="w-full max-w-md mb-4" />
              </>
            )}
            {selectedModel === 'logistic' && (
              <>
                <img src={`http://localhost:8000/output_plots/${results.confusionMatrix}`} alt="Confusion Matrix" className="w-full max-w-md mb-4" />
                <img src={`http://localhost:8000/output_plots/${results.rocCurve}`} alt="ROC Curve" className="w-full max-w-md mb-4" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelPerformance;