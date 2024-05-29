import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import waveImg from '../Auth/assests/wave.png';
import bgImg from '../Auth/assests/bg.svg';
import avatarImg from '../Auth/assests/avatar.svg';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import '../Auth/auth.css'

const Auth = () => {
       const [userEmail, setUserEmail] = useState('');
       const [password, setPassword] = useState('');
       const navigate = useNavigate();

       const handleUserEmailChange = (e) => {
              setUserEmail(e.target.value);
       };

       const handlePasswordChange = (e) => {
              setPassword(e.target.value);
       };

       const handleSubmit = async (e) => {
              e.preventDefault();
              try {
                     const data = {
                            "email": userEmail,
                            "password": password
                     }
                     const response = await axios.post('https://projxpert-tasks-management-application.onrender.com/user/login', data, {
                            headers: {
                                   'Content-Type': 'application/json',
                            },
                     });
                     if (response.status === 200) {
                            const Token = (response.data.data.Token);
                            localStorage.setItem('Token', Token);

                            navigate('/my-projects');
                            window.location.reload();
                     }
              } catch (error) {
                     window.alert(error.response.data.Message);
              }
              setUserEmail('');
              setPassword('');
       };


       return (
              <>
                     <div className='login'>
                            <img className="wave" src={waveImg} alt="wave" />
                            <div className="container">
                                   <div className="img">
                                          <img src={bgImg} alt="background" />
                                   </div>
                                   <div className="login-content">
                                          <form onSubmit={handleSubmit}>
                                                 <img src={avatarImg} alt="avatar" />
                                                 <h2 className="title">Welcome</h2>
                                                 <div className="input-div one">
                                                        <div className="i">
                                                               <FontAwesomeIcon icon={faUser} />
                                                        </div>
                                                        <div className="div">
                                                               <input
                                                                      type="text"
                                                                      className="input"
                                                                      placeholder="User Email"
                                                                      value={userEmail}
                                                                      onChange={handleUserEmailChange}
                                                                      required
                                                               />
                                                        </div>
                                                 </div>
                                                 <div className="input-div pass">
                                                        <div className="i">
                                                               <FontAwesomeIcon icon={faLock} />
                                                        </div>
                                                        <div className="div">
                                                               <input
                                                                      type="password"
                                                                      className="input"
                                                                      placeholder='Password'
                                                                      value={password}
                                                                      onChange={handlePasswordChange}
                                                                      required
                                                               />
                                                        </div>
                                                 </div>
                                                 <p>New to Project Managemnt? <a onClick={() => navigate('/signup')}>Create an Account</a></p>
                                                 <input type="submit" className="btn" value="Login" />
                                          </form>
                                   </div>
                            </div>
                     </div>
              </>


       );
}
export default Auth