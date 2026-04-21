const db = require('../db');

exports.getAllBadges = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, description, icon, criteria, category, level FROM badges ORDER BY category ASC, level ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyBadges = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.id, b.name, b.description, b.icon, b.criteria, b.category, b.level, ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY b.category ASC, b.level ASC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
