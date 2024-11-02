import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import ModelPerformance from './components/ModelPerformance';
import MainFunction from './components/Functions';
import Team from './components/Team';
import Feedback from './components/Feedback';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="hidden md:flex text-lg font-semibold text-gray-700">Weather ML Analysis</Link>
              <div className="space-x-4 text-sm sm:text-base">
                <Link to="/" className="text-gray-500 hover:text-green-500 transition duration-300">Home</Link>
                <Link to="/model-performance" className="text-gray-500 hover:text-green-500 transition duration-300">Model Performance</Link>
                <Link to="/main-function" className="text-gray-500 hover:text-green-500 transition duration-300">Main Function</Link>
                <Link to="/team" className="text-gray-500 hover:text-green-500 transition duration-300">Team</Link>
                <Link to="/feedback" className="text-gray-500 hover:text-green-500 transition duration-300">Feedback</Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/model-performance" element={<ModelPerformance />} />
            <Route path="/main-function" element={<MainFunction />} />
            <Route path="/team" element={<Team />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
