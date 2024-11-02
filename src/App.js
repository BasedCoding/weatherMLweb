import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import ModelPerformance from './components/ModelPerformance';
import MainFunction from './components/Functions';
import Team from './components/Team';
import Feedback from './components/Feedback';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-lg font-semibold text-gray-700">Weather ML Analysis</Link>
              
              {/* Hamburger menu button for mobile */}
              <button onClick={toggleMenu} className="md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop menu */}
              <div className="hidden md:flex space-x-4">
                <Link to="/" className="text-gray-500 hover:text-green-500 transition duration-300">Home</Link>
                <Link to="/model-performance" className="text-gray-500 hover:text-green-500 transition duration-300">Model Performance</Link>
                <Link to="/main-function" className="text-gray-500 hover:text-green-500 transition duration-300">Main Function</Link>
                <Link to="/team" className="text-gray-500 hover:text-green-500 transition duration-300">Team</Link>
                <Link to="/feedback" className="text-gray-500 hover:text-green-500 transition duration-300">Feedback</Link>
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
              <div className="flex flex-col space-y-2 pb-4">
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