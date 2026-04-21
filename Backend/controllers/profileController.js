const db = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, college, profile_photo, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  const { name, college } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name = $1, college = $2 WHERE id = $3 RETURNING id, name, email, college, profile_photo',
      [name, college, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.uploadPhoto = async (req, res) => {
  const { photo } = req.body;
  if (!photo) return res.status(400).json({ msg: 'No photo provided' });

  if (photo.length > 1.5 * 1024 * 1024) {
    return res.status(400).json({ msg: 'Image too large. Please use an image under 1MB.' });
  }
  try {
    await db.query('UPDATE users SET profile_photo = $1 WHERE id = $2', [photo, req.user.id]);
    res.json({ msg: 'Photo updated successfully', profile_photo: photo });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
