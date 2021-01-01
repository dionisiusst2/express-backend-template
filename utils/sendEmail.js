const nodemailer = require('nodemailer');

// to, subject, message attributes must be provided in options
const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  let message = {
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log(`Email sent: %s`, info.messageId);
};

module.exports = sendEmail;