const md5 = require('md5');
const {project} = require('../project/models/model');
const users_model = require('../users/model');
const { sendResponse } = require('../utils/response');
const jwt = require("jsonwebtoken");
const generator = require('generate-password');
var code, data, Message;

const createTask = async (req , res) => {
       try {
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const userID = decoded.payloadData.userID;
              const taskTitle = req.body.title;
              const taskDescription = req.body.description;
              const AssignedUserID = req.body.AssignedUserId;
              const projectId = req.body.projectId;
              const ifProjectExists = await project.findOne({ _id: projectId });
              if (!ifProjectExists) {
                     code = 404;
                     Message = "Project Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              let projectMember = ifProjectExists.members.find(member => member.userId === userID);
              if (!projectMember) {
                     code = 401;
                     Message = "You are not a part of this Project";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              projectMember = ifProjectExists.members.find(member => member.userId === AssignedUserID);
              if (!projectMember) {
                     code = 401;
                     Message = "This User is Not a Part of this Project";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              ifProjectExists.tasks.push({
                     title : taskTitle,
                     description : taskDescription,
                     status : 'To-do',
                     AssignedTo : AssignedUserID,
                     ownerId : userID
              })
              await ifProjectExists.save();
              code = 201;
              Message = "Task Added Successfully";
              data = {
                     projectName : ifProjectExists.projectName,
                     Title : taskTitle,
                     Description : taskDescription
              }
              sendResponse(res, code, data, Message);
       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }
}

const updateTask = async (req , res) => {
       try {
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const userID = decoded.payloadData.userID;
              const projectId = req.body.projectId;
              const taskID = req.body.taskId;
              const taskStatus = req.body.status;
              const ifProjectExists = await project.findOne({ _id: projectId });
              if (!ifProjectExists) {
                     code = 404;
                     Message = "Project Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const task = ifProjectExists.tasks.find(task => task._id.toString() === taskID);
              if (!task) {
                     code = 404;
                     Message = "Task Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              
              const projectMember = ifProjectExists.members.find(member => member.userId === userID);
              if (!projectMember) {
                     code = 401;
                     Message = "You are not a part of this Project";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              task.status = taskStatus || 'To-do';
              await ifProjectExists.save();
              code = 200;
              Message = "Task Updated Successfully";
              data = {
                     projectName : ifProjectExists.projectName,
                     Title : task.title,
                     Description : task.description,
                     Status : task.status
              }
              sendResponse(res , code , data , Message);
                    
       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }
}

const allTasks = async (req , res) => {
       try {
              
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const userID = decoded.payloadData.userID;
              const projectId = req.body.projectId;
              const ifProjectExists = await project.findOne({ _id: projectId });
              if (!ifProjectExists) {
                     code = 404;
                     Message = "Project Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const projectMember = ifProjectExists.members.find(member => member.userId === userID);
              if (!projectMember) {
                     code = 401;
                     Message = "You are not a part of this Project";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              code = 200;
              Message = "All Tasks Fetched Successfully";
              data = {
                     projectName : ifProjectExists.projectName,
                     Tasks : ifProjectExists.tasks
              }
              sendResponse(res , code, data, Message);
              
       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }
}
module.exports = {
       createTask , updateTask , allTasks
}