const nodemailer = require('nodemailer');

// NOTE: Fill in your SMTP credentials in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

/**
 * Send a beautiful HTML email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} title - Heading in the email
 * @param {string} message - Main body content
 */
exports.sendEmail = async (to, subject, title, message) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: #000; padding: 20px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">BALLARI BUSINESS COLLEGE</h1>
      </div>
      <div style="padding: 30px; line-height: 1.6; color: #333;">
        <h2 style="color: #000; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">${title}</h2>
        <p style="font-size: 16px;">${message}</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
          &copy; 2026 Ballari Business College. Affiliated to VSKU, Ballari. All rights reserved.<br>
          Ward No. 35, Ganesh Nagar, Opp. KSRTC Bus Depot, Siruguppa Road, Ballari, Karnataka - 583103
        </div>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Bellari Business College" <noreply@bellari.edu>',
      to,
      subject,
      html
    });
    console.log('📧 Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('📧 Email failed:', error);
    return false;
  }
};
