const nodemailer = require("nodemailer");
require('dotenv').config(); // Ensure this is at the very top

module.exports = async (email, subject, text) => {
    try {
        console.log('Loading environment variables:', {
            HOST: process.env.HOST,
            SERVICE: process.env.SERVICE,
            EMAIL_PORT: process.env.EMAIL_PORT,
            SECURE: process.env.SECURE,
            EMAIL_USER: process.env.EMAIL_USER,
            PASS: process.env.PASS
        });

        const transporter = nodemailer.createTransport({
            host: process.env.HOST.trim(), // Trim any extra spaces
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASS
            }
        });

        console.log('Sending email with the following configuration:', {
            host: process.env.HOST.trim(), // Trim any extra spaces
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            user: process.env.EMAIL_USER
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        });

        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.log("Email not sent");
        console.error("Error:", error); // Log the error details
    }
};