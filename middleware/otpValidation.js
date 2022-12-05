const nodemailer = require('nodemailer');
require('dotenv').config()
module.exports={
    mailTransporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:process.env.EMAIL_ME,
            pass: process.env.PASS
        },
    }),
      
     OTP : `${Math.floor(1000 + Math.random() * 9000)}`,

}