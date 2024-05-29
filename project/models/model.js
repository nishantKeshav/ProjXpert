const mongoose = require('mongoose');
const schema = mongoose.Schema;

const memeberRolesSchema = new schema({
       userId: {
           type: String,
           required: true,
       },
       role: {
           type: String,
           enum: ['Admin', 'Editor', 'Viewer'],
           default: 'Viewer',
       },
});

const tasksSchema = new schema({
       title: {
              type: String,
       },
       description: {
              type: String,
       },
       status: {
              type: String,
              enum: ['To-do', 'Testing', 'In Review', 'Completed'],
              default: 'To-do'
       },
       AssignedTo: {
              type : String,
       },
       ownerId: {
              type: String,
       }
});

const projectSchema = new schema({
       projectName : {
              type : String,
              unique : true
       } ,
       title : {
              type : String,
       },
       description : {
              type : String
       } ,
       ownerId : {
              type : String
       } ,
       members : {
              type: [memeberRolesSchema],
              default: [],
       } ,
       tasks : {
              type : [tasksSchema],
              default: [],
       }
       
} , {timestamps : true})

const project = mongoose.model('Project' , projectSchema)
module.exports = {project}