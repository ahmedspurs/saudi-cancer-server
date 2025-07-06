// utils/mailer.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@confe.ae",
    pass: "Confe@123", // يفضل تخزينه في env
  },
});

/**
 * Send raw HTML email using Hostinger
 *
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Full HTML content
 * @param {string} [from] - Optional sender email (default is info@confe.ae)
 */
async function sendEmail(to, subject, html, from = "info@confe.ae") {
  try {
    await transporter.sendMail({
      from: `"Confe Platform" <${from}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
    throw error;
  }
}

module.exports = { sendEmail };
