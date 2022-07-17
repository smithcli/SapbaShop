const nodemailer = require('nodemailer');

const sendmail = async (mail) => {
  // 1) Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SAPBA_EMAIL_HOST,
    port: process.env.SAPBA_EMAIL_PORT,
    auth: {
      user: process.env.SAPBA_EMAIL_USERNAME,
      pass: process.env.SAPBA_EMAIL_PASSWORD,
    },
  });
  // 2) Email Message fields
  const message = {
    from: 'SapbaShop <shop@sapbashop.com>',
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    //html: mail.html,
  };
  // 3) Send the email
  await transporter.sendMail(message);
};

module.exports = sendmail;
