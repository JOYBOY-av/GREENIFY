const db = require('../db');

exports.getWeekly = async (req, res) => {
  const scope = req.query.scope;
  const userId = req.user.id;

  try {
    let userCollege = null;
    if (scope === 'college') {
      const userRes = await db.query('SELECT college FROM users WHERE id = $1', [userId]);
      userCollege = userRes.rows[0]?.college;
    }

    const collegeFilter = scope === 'college' ? 'WHERE LOWER(u.college) = LOWER($1)' : '';

    const buildQuery = (suffix) => `
      WITH ranked_users AS (
        SELECT u.id, u.name, u.college, COALESCE(SUM(COALESCE(ua.earned_points, at.points)), 0) as total_points,
               RANK() OVER (ORDER BY COALESCE(SUM(COALESCE(ua.earned_points, at.points)), 0) DESC) as rank
        FROM users u
        LEFT JOIN user_actions ua ON u.id = ua.user_id AND ua.logged_at >= date_trunc('week', NOW())
        LEFT JOIN action_types at ON ua.action_type_id = at.id
        ${collegeFilter}
        GROUP BY u.id
      )
      ${suffix}
    `;

    const params = scope === 'college' ? [userCollege] : [];
    const myRankParams = scope === 'college' ? [userCollege, userId] : [userId];
    const myRankPlaceholder = scope === 'college' ? '$2' : '$1';

    const topUsersRes = await db.query(buildQuery('SELECT * FROM ranked_users ORDER BY rank ASC LIMIT 20'), params);
    const myRankRes = await db.query(buildQuery(`SELECT * FROM ranked_users WHERE id = ${myRankPlaceholder}`), myRankParams);

    res.json({
      leaderboard: topUsersRes.rows,
      myRank: myRankRes.rows[0] || null
    });

  } catch (err) {
    console.error('Error fetching weekly leaderboard:', err);
    res.status(500).send('Server Error');
  }
};

exports.getAllTime = async (req, res) => {
  const scope = req.query.scope;
  const userId = req.user.id;

  try {
    let userCollege = null;
    if (scope === 'college') {
      const userRes = await db.query('SELECT college FROM users WHERE id = $1', [userId]);
      userCollege = userRes.rows[0]?.college;
    }

    const collegeFilter = scope === 'college' ? 'WHERE LOWER(u.college) = LOWER($1)' : '';

    const buildQuery = (suffix) => `
      WITH ranked_users AS (
        SELECT u.id, u.name, u.college, COALESCE(SUM(COALESCE(ua.earned_points, at.points)), 0) as total_points,
               RANK() OVER (ORDER BY COALESCE(SUM(COALESCE(ua.earned_points, at.points)), 0) DESC) as rank
        FROM users u
        LEFT JOIN user_actions ua ON u.id = ua.user_id
        LEFT JOIN action_types at ON ua.action_type_id = at.id
        ${collegeFilter}
        GROUP BY u.id
      )
      ${suffix}
    `;

    const params = scope === 'college' ? [userCollege] : [];
    const myRankParams = scope === 'college' ? [userCollege, userId] : [userId];
    const myRankPlaceholder = scope === 'college' ? '$2' : '$1';

    const topUsersRes = await db.query(buildQuery('SELECT * FROM ranked_users ORDER BY rank ASC LIMIT 20'), params);
    const myRankRes = await db.query(buildQuery(`SELECT * FROM ranked_users WHERE id = ${myRankPlaceholder}`), myRankParams);

    res.json({
      leaderboard: topUsersRes.rows,
      myRank: myRankRes.rows[0] || null
    });

  } catch (err) {
    console.error('Error fetching all-time leaderboard:', err);
    res.status(500).send('Server Error');
  }
};
