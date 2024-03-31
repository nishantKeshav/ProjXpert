const md5 = require('md5');
const { project } = require('../project/models/model');
const users_model = require('../users/model');
const { sendResponse } = require('../utils/response');
const jwt = require("jsonwebtoken");
const generator = require('generate-password');
const { sendMail } = require('../utils/sendMail');
var code, data, Message;

const createProject = async (req, res) => {
       try {
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const userID = decoded.payloadData.userID;
              const projectName = req.body.projectName;
              const title = req.body.title;
              const description = req.body.description;
              const Project = new project({
                     projectName: projectName,
                     title: title,
                     description: description,
                     ownerId: userID,
              });
              Project.members.push({
                     userId: userID,
                     role: 'Admin',
              });
              await Project.save();
              code = 201;
              Message = "Project Created Successfully";
              data = {
                     projectName: projectName,
                     title: title,
                     description: description
              };
              sendResponse(res, code, data, Message);
              return;
       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }
}

const getAllUsersinProject = async (req, res) => {
       try {
              const projectId = req.body.projectId;
              const ifProjectExists = await project.findOne({ _id: projectId });
              if (!ifProjectExists) {
                     code = 404;
                     Message = "Project Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const users = await project.findOne({ _id: projectId });
              code = 200;
              Message = "Users Found";
              data = {
                     data: users.members
              }
              sendResponse(res, code, data, Message);
              return;
       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }
}

const AddUsersandAssignRoles = async (req, res) => {
       try {
              const projectId = req.body.projectId;
              const email = req.body.email;
              const role = req.body.role;
              const ifProjectExists = await project.findOne({ _id: projectId });
              if (!ifProjectExists) {
                     code = 404;
                     Message = "Project Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const loggedInEmailId = decoded.payloadData.email;
              const loggedInUserId = decoded.payloadData.userID;

              if (loggedInUserId !== ifProjectExists.ownerId) {
                     code = 404;
                     Message = "UnAuthorized";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              if (email === loggedInEmailId) {
                     code = 400;
                     Message = "You cannot add yourself as a member";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              let user = await users_model.findOne({ email: email });
              if (!user) {
                     const newUser = new users_model({
                            email: email,
                            name : req.body.name,
                            password: md5(temporaryPassword)
                     });
                     await newUser.save();
              }
              user = await users_model.findOne({ email: email });

              const userID = String(user['_id']);
              await ifProjectExists.members.push({
                     userId: userID,
                     role: role || 'Viewer',
              });
              await ifProjectExists.save();
              // sendMail('nishantkeshav29107@gmail.com' , 'nishant@ncompass.inc' , 'Test Mail' , 'Test Description' , res);

              code = 201;
              Message = "User Added Successfully to the Project";
              data = {
                     projectId: ifProjectExists.projectName,
                     userEmail: email,
                     role: role
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

const changeRoles = async (req, res) => {
       try {
              const projectId = req.body.projectId;
              const email = req.body.email;
              const role = req.body.role;
              const ifProjectExists = await project.findOne({ _id: projectId });
              if (!ifProjectExists) {
                     code = 404;
                     Message = "Project Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const loggedInEmailId = decoded.payloadData.email;
              const loggedInUserId = decoded.payloadData.userID;

              if (loggedInUserId !== ifProjectExists.ownerId) {
                     code = 404;
                     Message = "UnAuthorized";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              if (email === loggedInEmailId) {
                     code = 400;
                     Message = "You cannot change your role";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const user = await users_model.findOne({ email: email });
              if (!user) {
                     code = 401;
                     Message = "User Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const userID = String(user['_id'])
              const isUserInProject = ifProjectExists.members.some(member => member.userId === userID);
              if (!isUserInProject) {
                     code = 401;
                     Message = "This User is Not a Part of this Project";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const projectMember = ifProjectExists.members.find(member => member.userId === userID);
              projectMember.role = role || 'Viewer';
              await ifProjectExists.save();
              code = 200;
              Message = "User role updated successfully";
              data = {
                     projectId: projectId,
                     userEmail: email,
                     newRole: role || 'Viewer'
              };
              sendResponse(res, code, data, Message);

       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }
}

const allProjects = async (req, res) => {
       try {
              let projects = [];
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              const loggedInEmailId = decoded.payloadData.email;
              const user = await users_model.findOne({ email: loggedInEmailId });
              const userID = String(user['_id']);
              let allProjects = await project.find({
                     $or: [
                            { ownerId: userID },
                            { "members.userId": userID }
                     ]
              });
              for (let i = 0; i < allProjects.length; i++) {
                     let projectData = {
                            projectId: allProjects[i]._id,
                            projectName: allProjects[i].projectName,
                            ProjectTitle: allProjects[i].title,
                            projectDescription: allProjects[i].description,
                            projectMembers: allProjects[i].members,
                            projectTasks: allProjects[i].tasks,
                     };
                     projects.push(projectData);
              }
              code = 200;
              Message = "ALL Projects fetched Successfully";
              data = projects;
              sendResponse(res, code, data, Message);

       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }
}

const temporaryPassword = () => {
       const password = generator.generate({
              length: 5,
              numbers: true
       });
       return password;
}



module.exports = {
       createProject, AddUsersandAssignRoles, changeRoles, allProjects, getAllUsersinProject
}