// utils/emailUtil.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  secure: false,
  port: 587,
  auth: {
    user: "abbie.cruickshank80@ethereal.email",
    pass: "XkR6DezMtjazgBdKBF",
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: `"Abbie Cruickshank" <abbie.cruickshank80@ethereal.email>`, // Sender address
    to, // Receiver address
    subject, // Subject line
    text, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
