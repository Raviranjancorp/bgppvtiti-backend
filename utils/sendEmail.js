
const nodemailer = require("nodemailer");

const sendEmail = async ({ name, email, phone, message }) => {
  console.log("📧 Preparing email with:", { name, email, phone });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Website Enquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: "New Enquiry Received",
    text: `
NEW ENQUIRY RECEIVED

Name   : ${name}
Email  : ${email}
Phone  : ${phone}
Message:
${message}
    `,
  });

  console.log("✅ Email SENT → Message ID:", info.messageId);
};

module.exports = sendEmail;
