import React, { useState, useEffect } from 'react';
import '../Projects/projects.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
       const [allProjects, setAllProjects] = useState([]);
       const [showModal, setShowModal] = useState(false);
       const [projectName, setProjectName] = useState('');
       const [projectTitle, setProjectTitle] = useState('');
       const [projectDescription, setProjectDescription] = useState('');
       const navigate = useNavigate();

       useEffect(() => {
              fetchProjects();
       }, []);

       const fetchProjects = async () => {
              try {
                     const token = localStorage.getItem('Token');
                     const response = await axios.get('https://projxpert-tasks-management-application.onrender.com/project/Get-Projects', {
                            headers: {
                                   'Content-Type': 'application/json',
                                   Authorization: `Bearer ${token}`,
                            },
                     });
                     if (response.status === 200) {
                            setAllProjects(response.data.data);
                     }
              } catch (error) {
                     window.alert(error.response.data.Message);
              }
       };

       const getAllTasks = async (projectId) => {
              try {
                     navigate(`/my-tasks?id=${projectId}`);
              } catch (error) {

              }
       };

       const handleAddProject = async () => {
              try {
                     const data = {
                            "projectName": projectName,
                            "title": projectTitle,
                            "description": projectDescription
                     }
                     const token = localStorage.getItem('Token');
                     const response = await axios.post('https://projxpert-tasks-management-application.onrender.com/project/Create-Project', data, {
                            headers: {
                                   'Content-Type': 'application/json',
                                   Authorization: `Bearer ${token}`,
                            },
                     });
                     if (response.status === 201) {
                            fetchProjects();
                     }
              } catch (error) {
                     window.alert(error.response.data.Message);
              }
              setShowModal(false);
       };

       return (
              <>
                     <div className={`projects-header ${showModal ? 'blur-background' : ''}`}>
                            <h1>Projects</h1>
                            <div className='btn-container'>
                                   <button className='btn' onClick={() => setShowModal(true)}>Create Project</button>
                            </div>
                     </div>
                     <div className={`projects-container ${showModal ? 'blur-background' : ''}`}>
                            <div className='projects-list'>
                                   {allProjects.map((project) => (
                                          <div
                                                 key={project.projectId}
                                                 className='project-card'
                                                 onClick={() => {
                                                        getAllTasks(project.projectId);
                                                 }}
                                          >
                                                 <h2>{project.projectName}</h2>
                                                 <p>{project.projectDescription}</p>
                                          </div>
                                   ))}
                            </div>
                     </div>
                     {showModal && (
                            <div className='modal'>
                                   <div className='modal-container'>
                                          <h2>Create Project</h2>
                                          <label >Project Name:</label>
                                          <input
                                                 type='text'
                                                 placeholder='Project Name'
                                                 value={projectName}
                                                 onChange={(e) => setProjectName(e.target.value)}
                                          />
                                          <label >Project Title:</label>
                                          <input
                                                 type='text'
                                                 placeholder='Project Title'
                                                 value={projectTitle}
                                                 onChange={(e) => setProjectTitle(e.target.value)}
                                          />
                                          <label >Project Description:</label>
                                          <textarea
                                                 placeholder='Project Description'
                                                 id='projectDescription'
                                                 value={projectDescription}
                                                 onChange={(e) => setProjectDescription(e.target.value)}
                                          ></textarea>
                                          <div className='modal-buttons'>
                                                 <button className='btn' onClick={handleAddProject}>Add</button>
                                                 <button className='btn' onClick={() => setShowModal(false)}>Cancel</button>
                                          </div>
                                   </div>
                            </div>
                     )}
              </>
       );
};

export default Projects;
