import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import waveImg from '../Auth/assests/wave.png';
import bgImg from '../Auth/assests/bg.svg';
import avatarImg from '../Auth/assests/avatar.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import '../SignUp/signup.css'
import axios from 'axios';

const SignUp = () => {
       const [phoneNo, setPhoneNo] = useState('');
       const [userName, setUserName] = useState('');
       const [userEmail, setUserEmail] = useState('');
       const [password, setPassword] = useState('');

       const navigate = useNavigate();

       const handleUserEmailChange = (e) => {
              setUserEmail(e.target.value);
       };

       const handlePasswordChange = (e) => {
              setPassword(e.target.value);
       };

       const handleUserNameChange = (e) => {
              setUserName(e.target.value);
       }

       const handlePhoneNoChange = (e) => {
              setPhoneNo(e.target.value);
       }

       const handleSubmit = async (e) => {
              e.preventDefault();
              try {
                     const data = {
                            "name": userName,
                            "email": userEmail,
                            "password": password,
                            "phone": phoneNo,
                            "age": 22
                     }
                     const response = await axios.post('http://localhost:7000/user/register', data, {
                            headers: {
                                   'Content-Type': 'application/json',
                            },
                     });
                     if (response.status === 201) {
                            navigate('/login');
                     }
              } catch (error) {

              }
              setUserName('');
              setPassword('');
              setPhoneNo('');
              setUserEmail('');
       };


       return (
              <>
                     <div className='signup'>
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
                                                                      type="email"
                                                                      className="input"
                                                                      placeholder="User Email"
                                                                      value={userEmail}
                                                                      onChange={handleUserEmailChange}
                                                                      required
                                                               />
                                                        </div>
                                                 </div>
                                                 <div className="input-div one">
                                                        <div className="i">
                                                               <FontAwesomeIcon icon={faUser} />
                                                        </div>
                                                        <div className="div">
                                                               <input
                                                                      type="text"
                                                                      className="input"
                                                                      placeholder="Name"
                                                                      value={userName}
                                                                      onChange={handleUserNameChange}
                                                                      required
                                                               />
                                                        </div>
                                                 </div>
                                                 <div className="input-div one">
                                                        <div className="i">
                                                               <FontAwesomeIcon icon={faUser} />
                                                        </div>
                                                        <div className="div">
                                                               <input
                                                                      type="number"
                                                                      className="input"
                                                                      placeholder="PhoneNo"
                                                                      value={phoneNo}
                                                                      onChange={handlePhoneNoChange}
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
                                                 <p>Already have a Account? <a onClick={() => navigate('/login')}>Login to Account</a></p>
                                                 <input type="submit" className="btn" value="SignUp" />
                                          </form>
                                   </div>
                            </div>
                     </div>
              </>


       );
}
export default SignUp