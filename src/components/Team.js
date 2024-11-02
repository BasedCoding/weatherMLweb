import React from 'react';
import './Team.css';
import minhImage from './icons/minh.jpg';
import danielImage from './icons/daniel.jpg';
import samuelImage from './icons/samuel.jpg';

const Team = () => (
  <div>
    <h1 className='header'>Meet Our Team</h1>
    {/* Team members information */}
    <div className="team-members">
      <div className='team-member'>
        <img src={minhImage} alt="Minh Dang" />
        <h1>Minh Dang</h1>
        <h2>Frontend Designer</h2>
        <ul>
          <li>Designs intuitive and responsive user interfaces</li>
          <li>Focuses on delivering a seamless user experience</li>
          <li>Ensures applications are visually appealing and user-friendly</li>
        </ul>
      </div>
      <div className='team-member'>
        <img src={danielImage} alt="Duc Anh Nguyen" />
        <h1>Duc Anh Nguyen</h1>
        <h2>Backend Developer</h2>
        <ul>
          <li>Develops and manages server-side logic</li>
          <li>Handles database integration for efficient data flow</li>
          <li>Ensures system robustness, efficiency, and security</li>
        </ul>
      </div>
      <div className='team-member'>
        <img src={samuelImage} alt="Samuel Nguyen" />
        <h1>Samuel Nguyen</h1>
        <h2>Data Analyst</h2>
        <ul>
          <li>Analyzes complex datasets to derive insights</li>
          <li>Develops and optimizes machine learning models</li>
          <li>Supports data-driven decision-making across projects</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Team;
