const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
});

exports.register = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: 'Request body is missing' });
  }
  const { name, email, college, password } = req.body;

  try {
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let userId;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60000);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (userCheck.rows.length > 0) {
      const existingUser = userCheck.rows[0];
      if (existingUser.is_verified) {
        return res.status(400).json({ msg: 'User already exists and is verified' });
      } else {

        await db.query(
          'UPDATE users SET name = $1, college = $2, password = $3, reset_otp = $4, reset_otp_expires = $5 WHERE id = $6',
          [name, college, hashedPassword, otp, expires, existingUser.id]
        );
        userId = existingUser.id;
      }
    } else {

      const newUser = await db.query(
        'INSERT INTO users (name, email, college, password, is_verified, reset_otp, reset_otp_expires) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [name, email, college, hashedPassword, false, otp, expires]
      );
      userId = newUser.rows[0].id;
    }

    console.log(`\n========================================`);
    console.log(`[DEBUG] Signup OTP for ${email}: ${otp}`);
    console.log(`========================================\n`);

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Greenify - Verify Your Account',
      html: `<p>Hi ${name},</p><p>Your signup verification OTP is <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: 'Verification OTP sent to your email.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.verifySignup = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: 'Request body is missing' });
  }
  const { email, otp } = req.body;

  try {
    const userResult = await db.query(
      'SELECT * FROM users WHERE email = $1 AND reset_otp = $2 AND reset_otp_expires > NOW()',
      [email, otp]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    const user = userResult.rows[0];

    await db.query(
      'UPDATE users SET is_verified = true, reset_otp = NULL, reset_otp_expires = NULL WHERE id = $1',
      [user.id]
    );

    const payload = {
      user: { id: user.id }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        delete user.password;
        user.is_verified = true;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error('Error verifying signup:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: 'Request body is missing' });
  }
  const { email, password } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const user = userResult.rows[0];

    if (!user.is_verified) {
      return res.status(400).json({ msg: 'Please verify your email before logging in. Try registering again to get a new code.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: { id: user.id }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        delete user.password;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, name, email, college, role, created_at FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
       return res.status(404).json({ msg: 'User not found' });
    }
    res.json(userResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'New password must be at least 6 characters' });
  }
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, req.user.id]);
    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.sendChangeOtp = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    const user = result.rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60000);
    await db.query(
      'UPDATE users SET reset_otp = $1, reset_otp_expires = $2 WHERE id = $3',
      [otp, expires, req.user.id]
    );
    console.log(`\n[DEBUG] Change-password OTP for ${user.email}: ${otp}\n`);
    const maskedEmail = user.email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + b.replace(/./g, '*') + c);
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: 'Greenify — Change Password OTP',
      html: `<p>Hi ${user.name},</p><p>Your OTP to change your password is <strong>${otp}</strong>.</p><p>It expires in 5 minutes. Do not share it with anyone.</p>`
    });
    res.json({ msg: 'OTP sent to your email', maskedEmail });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.verifyOtpAndReset = async (req, res) => {
  const { otp, newPassword } = req.body;
  if (!otp || !newPassword) return res.status(400).json({ msg: 'OTP and new password are required' });
  if (newPassword.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1 AND reset_otp = $2 AND reset_otp_expires > NOW()',
      [req.user.id, otp]
    );
    if (result.rows.length === 0) return res.status(400).json({ msg: 'Invalid or expired OTP' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await db.query(
      'UPDATE users SET password = $1, reset_otp = NULL, reset_otp_expires = NULL WHERE id = $2',
      [hashed, req.user.id]
    );
    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

