const nodemailer = require("nodemailer");
require('dotenv').config(); // Ensure this is at the very top

const sendTestEmail = async () => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASS
            }
        });

        console.log('Sending test email with the following configuration:', {
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            user: process.env.EMAIL_USER
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'kirbycolin26@gmail.com',
            subject: 'Test Email',
            text: 'This is a test email.'
        });

        console.log("Test email sent successfully:", info.response);
    } catch (error) {
        console.log("Test email not sent");
        console.error("Error:", error); // Log the error details
    }
};

sendTestEmail();