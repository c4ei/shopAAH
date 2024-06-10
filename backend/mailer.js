const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");

const adminEmail = process.env.EMAIL_HOST_USER;
const adminPassword = process.env.EMAIL_HOST_PASSWORD;
const mailHost = process.env.EMAIL_HOST;
const mailPort = 587;

const sendMail = async (to, subject, htmlContent) => {
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });

  const info = await transporter.sendMail({
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent,
  });

  return info;
};

module.exports = {
  sendMail,
};
