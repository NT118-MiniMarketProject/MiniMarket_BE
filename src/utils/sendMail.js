import nodemailer from "nodemailer"
import nodemailerConfig from "../config/mailer.config"

export const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"TTech" <testlaravelalala@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};
