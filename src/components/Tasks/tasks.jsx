import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import '../Tasks/tasks.css';

const Tasks = () => {
       const params = new URLSearchParams(window.location.search);
       const projectId = params.get('id');

       const [columns, setColumns] = useState([
              { columnName: 'To-do', tasks: [] },
              { columnName: 'Testing', tasks: [] },
              { columnName: 'In Review', tasks: [] },
              { columnName: 'Completed', tasks: [] }
       ]);
       const [taskTitle, setTaskTitle] = useState('');
       const [taskDescription, setTaskDescription] = useState('');
       const [assignTo, setAssignTo] = useState('');
       const [userEmail, setUserEmail] = useState('');
       const [userName, setUserName] = useState('');
       const [role, setRole] = useState('');

       const [showAddTaskModal, setShowAddTaskModal] = useState(false);
       const [showAddMemberModal, setShowAddMemberModal] = useState(false);
       const [showAllMembersModal, setShowAllMembersModal] = useState(false);

       const [AllMembers, setAllMembers] = useState([]);

       useEffect(() => {
              fetchTasks();
              fetchAllMembers();
       }, []);


       const fetchTasks = async () => {
              try {
                     const data = {
                            "projectId": projectId,
                     };
                     const token = localStorage.getItem('Token');
                     const response = await axios({
                            method: "post",
                            url: 'https://projxpert-tasks-management-application.onrender.com/task/All-Tasks',
                            data: data,
                            headers: {
                                   "Content-Type": "application/json",
                                   Authorization: `Bearer ${token}`
                            }
                     });
                     if (response.status === 200) {
                            const tasks = response.data.data.Tasks;
                            const updatedColumns = columns.map(column => ({
                                   ...column,
                                   tasks: tasks.filter(task => task.status === column.columnName)
                            }));
                            setColumns(updatedColumns);
                     }
              } catch (error) {
                     console.error("Error fetching tasks:", error);
                     window.alert(error.response.data.Message);
              }
       };

       const handleDragStart = (event, columnName, taskIndex, taskId) => {
              event.dataTransfer.setData("columnName", columnName);
              event.dataTransfer.setData("taskId", taskId);
       };

       const handleDrop = async (event, targetColumnName) => {
              // const sourceColumnName = event.dataTransfer.getData("columnName");
              const taskId = event.dataTransfer.getData("taskId");

              const status = targetColumnName;

              try {
                     const data = {
                            "projectId": projectId,
                            "taskId": taskId,
                            "status": status
                     };
                     const token = localStorage.getItem('Token');
                     const response = await axios({
                            method: "post",
                            url: 'https://projxpert-tasks-management-application.onrender.com/task/Update-Task',
                            data: data,
                            headers: {
                                   "Content-Type": "application/json",
                                   Authorization: `Bearer ${token}`
                            }
                     });
                     if (response.status === 200) {
                            fetchTasks();
                     }
              } catch (error) {
                     window.alert(error.response.data.Message);
              }
       };

       const fetchAllMembers = async () => {
              try {
                     const data = {
                            "projectId": projectId
                     };
                     const token = localStorage.getItem('Token');
                     const response = await axios({
                            method: "post",
                            url: 'https://projxpert-tasks-management-application.onrender.com/project/Get-Members',
                            data: data,
                            headers: {
                                   "Content-Type": "application/json",
                                   Authorization: `Bearer ${token}`
                            }
                     });
                     if (response.status === 200) {
                            setAllMembers(response.data.data.data);

                     }
              } catch (error) {
                     alert("Error Fetching Members");
                     window.alert(error.response.data.Message);
              }
       }

       const Task = ({ task, columnName, taskIndex }) => {
              return (
                     <div
                            className={`task ${columnName.toLowerCase().replace(/\s/g, '-')}`}
                            draggable='true'
                            onDragStart={(event) => handleDragStart(event, columnName, taskIndex, task._id)}
                     >
                            <p className='task-title'>{task.title}</p>
                            <p className='task-description'>{task.description}</p>
                     </div>
              );
       };

       const Column = ({ columnName, tasks }) => {
              return (
                     <div className='column-container' onDrop={(event) => handleDrop(event, columnName)} onDragOver={(event) => event.preventDefault()}>
                            <h2>{columnName}</h2>
                            {tasks.map((task, index) => (
                                   <Task key={index} task={task} columnName={columnName} taskIndex={index} />
                            ))}
                     </div>
              );
       };

       const handleAddTask = async () => {
              try {
                     const data = {
                            "title": taskTitle,
                            "description": taskDescription,
                            "projectId": projectId,
                            "AssignedUserId": assignTo.split(' ')[2]
                     }
                     const token = localStorage.getItem('Token');
                     const response = await axios.post('https://projxpert-tasks-management-application.onrender.com/task/Add-Task', data, {
                            headers: {
                                   'Content-Type': 'application/json',
                                   Authorization: `Bearer ${token}`,
                            },
                     });
                     if (response.status === 201) {
                            fetchTasks();
                            setShowAddTaskModal(false);
                     }
              } catch (error) {
                     window.alert(error.response.data.Message);
              }
       }

       const handleAddMember = async () => {
              try {
                     const data = {
                            "projectId": projectId,
                            "name": userName,
                            "email": userEmail,
                            "role": role.charAt(0).toUpperCase() + role.slice(1)

                     }
                     const token = localStorage.getItem('Token');
                     const response = await axios.post('https://projxpert-tasks-management-application.onrender.com/project/Add-Members', data, {
                            headers: {
                                   'Content-Type': 'application/json',
                                   Authorization: `Bearer ${token}`,
                            },
                     });
                     if (response.status === 201) {
                            fetchAllMembers();
                            setShowAddMemberModal(false);
                     }
              } catch (error) {
                     window.alert(error.response.data.Message);
              }
       }

       return (
              <>
                     <div className='create-task-container'>
                            <h1 className='task-Title'>Tasks</h1>
                            <div className='task-buttons'>
                                   <button className='all-members-button' onClick={() => setShowAllMembersModal(true)}>All Members</button>
                                   <button className='create-task-button' onClick={() => setShowAddTaskModal(true)}>Create Task</button>
                                   <button className='Add-Members-button' onClick={() => setShowAddMemberModal(true)}>Add Members</button>
                            </div>
                     </div>
                     <div className={`parent-container ${showAddTaskModal ? 'blur-background' : ''}`}>
                            <div className="task-container">
                                   {columns.map((column, index) => (
                                          <Column key={index} columnName={column.columnName} tasks={column.tasks} />
                                   ))}
                            </div>
                     </div>
                     {showAddTaskModal && (
                            <div className='modal'>
                                   <div className='modal-container'>
                                          <h2>Create Task</h2>
                                          <label >Task Title:</label>
                                          <input
                                                 type='text'
                                                 placeholder='Task Title'
                                                 value={taskTitle}
                                                 onChange={(e) => setTaskTitle(e.target.value)}
                                          />
                                          <label >Task Description:</label>
                                          <textarea
                                                 type='text'
                                                 value={taskDescription}
                                                 onChange={(e) => setTaskDescription(e.target.value)}
                                                 placeholder='Task Description'
                                          ></textarea>
                                          <label>Assign To:</label>
                                          <select className='roles-dropdown' value={assignTo} onChange={(e) => (setAssignTo(e.target.value))}>
                                                 <option> Select Member</option>
                                                 {AllMembers.map(member => (
                                                        <option>User ID: {member.userId}</option>
                                                 ))}
                                          </select>
                                          <div className='modal-buttons'>
                                                 <button className='btn' onClick={() => handleAddTask()}>Add</button>
                                                 <button className='btn' onClick={() => setShowAddTaskModal(false)}>Cancel</button>
                                          </div>
                                   </div>
                            </div>
                     )}
                     {showAddMemberModal && (
                            <div className='modal'>
                                   <div className='modal-container'>
                                          <h2>Add Member</h2>
                                          <label >User Email ID:</label>
                                          <input
                                                 type='email'
                                                 placeholder='User Email ID '
                                                 value={userEmail}
                                                 onChange={(e) => setUserEmail(e.target.value)}
                                          />
                                          <label >User Name:</label>
                                          <input
                                                 type='name'
                                                 placeholder='User Name'
                                                 value={userName}
                                                 onChange={(e) => setUserName(e.target.value)}
                                          />
                                          <label >Role:</label>
                                          <select className='roles-dropdown' value={role} onChange={(e) => (setRole(e.target.value))}>
                                                 <option>Select Role</option>
                                                 <option value='Editor'>Editor</option>
                                                 <option value='Viewer'>Viewer</option>
                                                 <option value='Admin'>Admin</option>
                                          </select>
                                          <div className='modal-buttons'>
                                                 <button className='btn' onClick={() => handleAddMember()}>Add</button>
                                                 <button className='btn' onClick={() => setShowAddMemberModal(false)}>Cancel</button>
                                          </div>
                                   </div>
                            </div>
                     )}
                     {showAllMembersModal && (
                            <div className='modal'>
                                   <div className='modal-container'>
                                          <h2>All Members</h2>
                                          <div className='Project-members-container'>
                                                 <div className='scrollable-container'>
                                                        {AllMembers.map(member => (
                                                               <div key={member._id}>
                                                                      <p>User ID: {member.userId}</p>
                                                                      <p>Role: {member.role}</p>
                                                               </div>
                                                        ))}
                                                 </div>
                                          </div>
                                          <button className='btn' onClick={() => setShowAllMembersModal(false)}>Cancel</button>
                                   </div>
                            </div>

                     )}
              </>

       );
};

export default Tasks;
