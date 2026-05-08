const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const db = require('../db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
});

exports.forgotPassword = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: 'Request body is missing' });
  }
  const { email } = req.body;
  try {
    const userResult = await db.query('SELECT id, name FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: 'No Account with this email' });
    }

    const user = userResult.rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60000);

    await db.query(
      'UPDATE users SET reset_otp = $1, reset_otp_expires = $2 WHERE id = $3',
      [otp, expires, user.id]
    );

    console.log(`\n========================================`);
    console.log(`[DEBUG] Password Reset OTP for ${email}: ${otp}`);
    console.log(`========================================\n`);

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Greenify - Password Reset OTP',
      html: `<p>Hi ${user.name},</p><p>Your password reset OTP is <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'If the email exists, an OTP has been sent.' });
  } catch (err) {
    console.error('Error in forgot password:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: 'Request body is missing' });
  }
  const { email, otp } = req.body;
  try {
    const userResult = await db.query(
      'SELECT id FROM users WHERE email = $1 AND reset_otp = $2 AND reset_otp_expires > NOW()',
      [email, otp]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    res.json({ msg: 'OTP verified successfully' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: 'Request body is missing' });
  }
  const { email, otp, newPassword } = req.body;
  try {
    const userResult = await db.query(
      'SELECT id FROM users WHERE email = $1 AND reset_otp = $2 AND reset_otp_expires > NOW()',
      [email, otp]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    const userId = userResult.rows[0].id;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      'UPDATE users SET password = $1, reset_otp = NULL, reset_otp_expires = NULL WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
