import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function enviarMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"Impuestos Bot 🤖" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}