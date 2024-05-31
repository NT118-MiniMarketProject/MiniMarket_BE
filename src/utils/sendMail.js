const nodemailer = require('nodemailer');
const nodemailerConfig = require('../config/mailer.config')

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"BACHHOAXANH" <bhxCLONE@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
