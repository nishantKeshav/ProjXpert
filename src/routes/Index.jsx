import React from 'react'
import Auth from '../components/Auth/auth'
import SignUp from '../components/SignUp/signup'
import Home from '../components/Home/home'
import { Routes, Route } from "react-router-dom"
import Projects from '../components/Projects/projects'
import Tasks from '../components/Tasks/tasks'


const Index = () => {
       return (
              <Routes>
                     <Route path='/' element={<Home />} />
                     <Route path='/login' element={<Auth />} />
                     <Route path='/signup' element={<SignUp />} />
                     <Route path='/my-projects' element={<Projects />} />
                     <Route path='/my-tasks' element={<Tasks />} />

              </Routes>
       )
}

export default Index