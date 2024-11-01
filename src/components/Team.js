import React from 'react';
import './Team.css';
import section2Image from './icons/section2.png';

const Team = () => (
  <div>
    <h1 className='header'>Meet Our Team</h1>
    <div className="team-members">
      <div className='team-member'>
        <img src={section2Image}></img>
        <h1>Minh Dang</h1>
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </div>
      <div className='team-member'>
        <img src={section2Image}></img>
        <h1>Duc Anh Nguyen</h1>
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </div>
      <div className='team-member'>
        <img src={section2Image}></img>
        <h1>Samuel Nguyen</h1>
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </div>
    </div>
  </div>
);

export default Team;