import { VERIFICATION_EMAIL_TEMPLATE, RESET_PASSWORD_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplate.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Địa chỉ máy chủ SMTP của Gmail
  port: 587, // Cổng SMTP
  secure: false, // true cho cổng 465, false cho cổng 587
  auth: {
    user: process.env.GMAIL_USER, // Địa chỉ email
    pass: process.env.GMAIL_PASS, // App Password
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: '"Book Store" <BookStores@gmail.com>',
    to: email,
    subject: "Verify Your Email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công", response);
  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: '"Book Store" <BookStores@gmail.com>',
    to: email,
    subject: "Welcome to Book Store",
    html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Email chào mừng đã được gửi thành công", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, verificationToken) => {
    const mailOptions = {
      from: '"Book Store" <BookStores@gmail.com>',
      to: email,
      subject: "Reset Your Password",
      html: RESET_PASSWORD_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };
  
    try {
      const response = await transporter.sendMail(mailOptions);
      console.log("Email đã được gửi thành công", response);
    } catch (error) {
      console.error(`Error sending verification`, error);
      throw new Error(`Error sending verification email: ${error}`);
    }
};