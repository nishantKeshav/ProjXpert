import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../Navbar/navbar.css';

const Navbar = () => {
       const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('Token'));
       const navigate = useNavigate();

       const handleLogout = () => {
              localStorage.removeItem('Token');
              setIsLoggedIn(false);
              navigate('/');
       };

       return (
              <>
                     <nav className="navbar">
                            <div className="navdiv">
                                   <div className="logo"><a href="#">Taskify</a> </div>
                                   <ul>
                                          <li><a onClick={() => navigate('/')}>Home</a></li>
                                          <li><a href="#">About</a></li>
                                          <li><a href="#">Contact</a></li>
                                          {isLoggedIn ? (
                                                 <>
                                                        <button onClick={handleLogout}>Logout</button>
                                                 </>
                                          ) : (
                                                 <>
                                                        <button><a onClick={() => navigate('/login')}>SignIn</a></button>
                                                        <button><a onClick={() => navigate('/signup')}>SignUp</a></button>
                                                 </>
                                          )}
                                   </ul>
                            </div>
                     </nav>
              </>
       );
};

export default Navbar;
