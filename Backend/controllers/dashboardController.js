const db = require('../db');

exports.getDashboard = async (req, res) => {
  const userId = req.user.id;

  try {

    const userRes = await db.query('SELECT name, college FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    const pointsRes = await db.query(`
      SELECT SUM(COALESCE(ua.earned_points, at.points)) as total_points
      FROM user_actions ua
      JOIN action_types at ON ua.action_type_id = at.id
      WHERE ua.user_id = $1
    `, [userId]);
    const total_points = parseInt(pointsRes.rows[0].total_points || 0);

    const recentRes = await db.query(`
      SELECT ua.id, ua.note, ua.logged_at, ua.status, ua.ai_explanation, at.name, COALESCE(ua.earned_points, at.points) as points, at.icon
      FROM user_actions ua
      JOIN action_types at ON ua.action_type_id = at.id
      WHERE ua.user_id = $1
      ORDER BY ua.logged_at DESC
      LIMIT 5
    `, [userId]);
    const recent_actions = recentRes.rows;

    const badgesRes = await db.query(`
      SELECT b.id, b.name, b.description, b.icon
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC
    `, [userId]);
    const badges = badgesRes.rows;

    const streakRes = await db.query(`
      SELECT COUNT(DISTINCT DATE(logged_at)) as days_active
      FROM user_actions
      WHERE user_id = $1 AND logged_at >= NOW() - INTERVAL '7 days'
    `, [userId]);

    const streak = parseInt(streakRes.rows[0].days_active || 0);

    res.json({
      user,
      total_points,
      streak,
      recent_actions,
      badges
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
