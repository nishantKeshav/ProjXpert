const users_model = require('../users/model');
const { sendResponse } = require('../utils/response')
const jwt = require("jsonwebtoken");
const md5 = require('md5');

var code, data, Message;

const registerUser = async (req, res) => {
       try {
              const name = req.body.name;
              const email = req.body.email;
              const password = md5(req.body.password);
              const phone = req.body.phone;
              const age = req.body.age;
              const isUserRegisterd = await users_model.findOne({ email: email })
              if (isUserRegisterd) {
                     code = 409;
                     Message = "User Already Registered";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const user = new users_model({
                     name: name,
                     email: email,
                     password: password,
                     phone: phone,
                     age: age
              });
              await user.save();
              code = 201;
              Message = "User Registration Successfull";
              data = {
                     name: name,
                     email: email,
                     phone: phone,
                     age: age
              };
              sendResponse(res, code, data, Message);
       } catch (error) {
              code = 500;
              Message = "Internal Server Error";
              data = null;
              sendResponse(res, code, data, Message);
       }
}

const loginUser = async (req, res) => {
       try {
              const email = req.body.email;
              const password = md5(req.body.password);
              const user = await users_model.findOne({ email: email })
              if (!user) {
                     code = 404;
                     Message = "User Not Found";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              if (user.password != password) {
                     code = 401;
                     Message = "Invalid Credentials";
                     data = null;
                     sendResponse(res, code, data, Message);
                     return;
              }
              const userID = String(user['_id'])
              const payloadData = {
                     userID: userID,
                     email: user.email
              }
              const token = jwt.sign({ payloadData }, process.env.JWT_SECRET_KEY, {
                     expiresIn: "1d",
              });
              code = 200;
              Message = "Login Successfull";
              data = {
                     Token : token,
              };
              sendResponse(res, code, data, Message);
       } catch (error) {
              code = 500;
              Message = "Internal Server Error";
              data = null;
              sendResponse(res, code, data, Message);
       }
}
module.exports = { registerUser , loginUser }