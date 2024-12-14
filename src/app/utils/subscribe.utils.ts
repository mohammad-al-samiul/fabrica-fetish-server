// utils/emailUtil.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "abbie.cruickshank80@ethereal.email",
    pass: "XkR6DezMtjazgBdKBF",
  },
});
export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: '"Abbie Cruickshank " <abbie.cruickshank80@ethereal.email>', // Sender address
    to, // Receiver address
    subject, // Subject line
    text, // Plain text body
  };

  await transporter.sendMail(mailOptions);
};
