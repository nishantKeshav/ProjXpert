import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LandingPage from '../Home/assests/LandingPage.jpg';
import '../Home/home.css';

const Home = () => {

       return (
              <>
                     <div className='full-page'>
                            <div className='Landing-Page'>
                                   <div className='details'>
                                          <h1 className='title-one'>Project</h1>
                                          <h4 className='title-two'>Managment</h4>
                                          <p className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                                 sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                 Pharetra massa massa ultricies mi quis. Nascetur ridiculus mus mauris vitae ultricies.
                                          </p>
                                          <button className='details-button'>Learn More</button>
                                   </div>
                                   <div className='landingPage-photo'>
                                          <img src={LandingPage} alt='Landing Page' />
                                   </div>
                            </div>
                     </div>

              </>


       );
}
export default Home