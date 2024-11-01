import React from 'react';
import './Home.css';
import section1Image from './icons/section1.png'; 
import section2Image from './icons/section2.png'; 

const Home = () => (
  <div>
    <section className='main-section'>
      <div className='header'>
        <h1>Welcome to Our Machine Learning Project</h1>
        <h1>Explore our model's capabilities, try out predictions, and learn about the team behind it!</h1>
      </div>
      <div className='sub-header'>
        <h2>Trying our model below!</h2>
      </div>
      <div className='btn'>
        <a href="/model-performance"><button>Model Performance</button></a>
        <a href="/main-function"><button>Main Function</button></a>
      </div>
    </section>
    <div className='line'></div>
    <section className='small-section'>
      <div className='left'>
        <h1>Lorem ipsum</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac vehicula magna. Vestibulum neque nisi, faucibus varius euismod quis, vulputate vel magna. Nulla sagittis, neque sit amet dignissim iaculis, nunc turpis laoreet erat, vel fringilla dolor tortor a quam. Curabitur faucibus commodo nunc sit amet cursus. Donec a molestie eros.</p>
      </div>
      <div className='right'><img src={section1Image}></img></div>
    </section>
    <div className='line'></div>
    <section className='small-section'>
      <div class='left'>
        <h1>Lorem ipsum</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac vehicula magna. Vestibulum neque nisi, faucibus varius euismod quis, vulputate vel magna. Nulla sagittis, neque sit amet dignissim iaculis, nunc turpis laoreet erat, vel fringilla dolor tortor a quam. Curabitur faucibus commodo nunc sit amet cursus. Donec a molestie eros.</p>
      </div>
      <div className='right'><img src={section2Image}></img></div>
    </section>
    <div className='line'></div>
    <br /><br />
  </div>
);

export default Home;