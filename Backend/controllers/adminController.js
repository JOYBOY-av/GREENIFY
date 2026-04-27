const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'All fields required' });

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ msg: 'Invalid credentials' });

    const user = result.rows[0];
    if (user.role !== 'admin') return res.status(403).json({ msg: 'Access denied: Admins only' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        admin: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    });
  } catch (err) {
    console.error('adminLogin error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getStats = async (req, res) => {
  try {
    const [users, badges, actionTypes, actionsLogged] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM badges'),
      db.query('SELECT COUNT(*) FROM action_types'),
      db.query('SELECT COUNT(*) FROM user_actions'),
    ]);
    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalBadges: parseInt(badges.rows[0].count),
      totalActionTypes: parseInt(actionTypes.rows[0].count),
      totalActionsLogged: parseInt(actionsLogged.rows[0].count),
    });
  } catch (err) {
    console.error('getStats error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.name, u.email, u.college, u.role, u.created_at,
        COALESCE(SUM(COALESCE(ua.earned_points, at.points)), 0) AS total_points
      FROM users u
      LEFT JOIN user_actions ua ON ua.user_id = u.id
      LEFT JOIN action_types at ON at.id = ua.action_type_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ msg: 'Cannot delete your own admin account' });
  }
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ msg: 'Role must be "user" or "admin"' });
  }
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ msg: 'Cannot change your own role' });
  }
  try {
    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateUserRole error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllBadges = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM badges ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('getAllBadges error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.createBadge = async (req, res) => {
  const { name, description, icon, criteria, category, level } = req.body;
  if (!name || !criteria) return res.status(400).json({ msg: 'Name and criteria are required' });
  try {
    const result = await db.query(
      'INSERT INTO badges (name, description, icon, criteria, category, level) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, description || '', icon || '🌿', criteria, category || 'general', level || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createBadge error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateBadge = async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, criteria, category, level } = req.body;
  try {
    const result = await db.query(
      'UPDATE badges SET name=$1, description=$2, icon=$3, criteria=$4, category=$5, level=$6 WHERE id=$7 RETURNING *',
      [name, description, icon, criteria, category, level, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: 'Badge not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateBadge error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteBadge = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM user_badges WHERE badge_id = $1', [id]);
    await db.query('DELETE FROM badges WHERE id = $1', [id]);
    res.json({ msg: 'Badge deleted' });
  } catch (err) {
    console.error('deleteBadge error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllActions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM action_types ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('getAllActions error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.createAction = async (req, res) => {
  const { name, description, points, icon } = req.body;
  if (!name || points === undefined) return res.status(400).json({ msg: 'Name and points are required' });
  try {
    const result = await db.query(
      'INSERT INTO action_types (name, description, points, icon) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, description || '', parseInt(points), icon || '🌱']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createAction error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateAction = async (req, res) => {
  const { id } = req.params;
  const { name, description, points, icon } = req.body;
  try {
    const result = await db.query(
      'UPDATE action_types SET name=$1, description=$2, points=$3, icon=$4 WHERE id=$5 RETURNING *',
      [name, description, parseInt(points), icon, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: 'Action not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateAction error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteAction = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM action_types WHERE id = $1', [id]);
    res.json({ msg: 'Action deleted' });
  } catch (err) {
    console.error('deleteAction error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLegalPages = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM legal_pages ORDER BY slug ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('getLegalPages error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLegalPage = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await db.query('SELECT * FROM legal_pages WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ msg: 'Page not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getLegalPage error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateLegalPage = async (req, res) => {
  const { slug } = req.params;
  const { content, title } = req.body;
  if (!content) return res.status(400).json({ msg: 'Content is required' });
  try {
    const result = await db.query(
      'UPDATE legal_pages SET content=$1, title=$2, updated_at=NOW() WHERE slug=$3 RETURNING *',
      [content, title, slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: 'Page not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateLegalPage error:', err.message);
    res.status(500).send('Server Error');
  }
};
