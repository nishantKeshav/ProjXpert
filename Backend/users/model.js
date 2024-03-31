const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
       name : {
              type : String
       } ,
       email : {
              type : String,
              unique: true,
              require : true
       },
       password : {
              type : String,
              require : true
       } ,
       phone : {
              type : BigInt
       } ,
       age : {
              type : Number
       } ,
       
} , {timestamps : true})

const users = mongoose.model('Users' , userSchema)
module.exports = users