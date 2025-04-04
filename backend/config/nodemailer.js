const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = transporter;