import nodemailer from 'nodemailer';
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 // Ensure you have your email configurations in this config file
 dotenv.config({ path: path.join(__dirname, "../.env") });
 let sendEmailpassword = process.env.sendEmailpassword;
let Email = process.env.sendEmail;
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: Email,
    pass: sendEmailpassword,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: Email,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
