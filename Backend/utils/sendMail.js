const nodemailer = require('nodemailer');
const { sendResponse } = require('./response');

var code, data, Message;

const transporter = nodemailer.createTransport({
       host: "smtp.ethereal.email",
       port: 587,
       secure: false,
       auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
       },
});



const sendMail = async (from, to, subject, text , res) => {
       try {
              const info = await transporter.sendMail({
                     from: from,
                     to: to,
                     subject: subject,
                     text: text,
                     html: "<b>Hello world?</b>",
              });

       } catch (error) {
              code = 500;
              Message = error.message;
              data = null;
              sendResponse(res, code, data, Message);
              return;
       }

}
module.exports = {
       sendMail
}