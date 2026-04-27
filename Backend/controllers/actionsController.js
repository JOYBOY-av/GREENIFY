const db = require('../db');

exports.getActionTypes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM action_types ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.logAction = async (req, res) => {
  const { action_type_id, note, earned_points } = req.body;
  const userId = req.user.id;

  try {

    const actionTypeRes = await db.query('SELECT * FROM action_types WHERE id = $1', [action_type_id]);
    if (actionTypeRes.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid action type' });
    }
    const actionType = actionTypeRes.rows[0];

    await db.query(
      'INSERT INTO user_actions (user_id, action_type_id, note, earned_points) VALUES ($1, $2, $3, $4)',
      [userId, action_type_id, note, earned_points || null]
    );

    const pointsRes = await db.query(`
      SELECT 
        COALESCE(SUM(COALESCE(ua.earned_points, at.points)), 0) as total_points, 
        COUNT(ua.id) as actions_count,
        COUNT(ua.id) FILTER (WHERE at.name ILIKE '%Recycl%') as recycle_count,
        COUNT(ua.id) FILTER (WHERE at.name ILIKE '%Electric%') as energy_count,
        COUNT(ua.id) FILTER (WHERE at.name ILIKE '%Water%') as water_count,
        COUNT(ua.id) FILTER (WHERE at.name ILIKE '%Transport%' OR at.name ILIKE '%Bike%') as transport_count,
        COUNT(ua.id) FILTER (WHERE at.name ILIKE '%Animal%') as animal_count,
        COUNT(ua.id) FILTER (WHERE at.name ILIKE '%Awareness%') as awareness_count,
        COUNT(ua.id) FILTER (WHERE at.name ILIKE '%Clean-up%') as mayor_count
      FROM user_actions ua
      JOIN action_types at ON ua.action_type_id = at.id
      WHERE ua.user_id = $1
    `, [userId]);
    
    const stats = pointsRes.rows[0];
    const total_points = parseInt(stats.total_points);
    const actions_count = parseInt(stats.actions_count);
    const recycle_count = parseInt(stats.recycle_count || 0);
    const energy_count = parseInt(stats.energy_count || 0);
    const water_count = parseInt(stats.water_count || 0);
    const transport_count = parseInt(stats.transport_count || 0);
    const animal_count = parseInt(stats.animal_count || 0);
    const awareness_count = parseInt(stats.awareness_count || 0);
    const mayor_count = parseInt(stats.mayor_count || 0);

    const allBadges = await db.query('SELECT * FROM badges');
    const userBadgesRes = await db.query('SELECT badge_id FROM user_badges WHERE user_id = $1', [userId]);
    const earnedBadgeIds = userBadgesRes.rows.map(row => row.badge_id);

    let newlyEarnedBadges = [];

    for (const badge of allBadges.rows) {
      if (!earnedBadgeIds.includes(badge.id)) {
        let earned = false;
        try {
          const criteriaStr = badge.criteria
            .replace('total_actions', actions_count)
            .replace('total_points', total_points)
            .replace('recycle_count', recycle_count)
            .replace('energy_count', energy_count)
            .replace('water_count', water_count)
            .replace('transport_count', transport_count)
            .replace('animal_count', animal_count)
            .replace('awareness_count', awareness_count)
            .replace('mayor_count', mayor_count);
            
          if (eval(criteriaStr)) earned = true;
        } catch (e) {
          console.error('Error evaluating badge criteria', badge.criteria);
        }
        
        if (earned) {
          await db.query(
            'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)',
            [userId, badge.id]
          );
          newlyEarnedBadges.push(badge);
        }
      }
    }

    res.status(201).json({
      message: 'Action logged!',
      points_earned: earned_points || actionType.points,
      total_points,
      new_badges: newlyEarnedBadges
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyActions = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT ua.id, ua.note, ua.logged_at, at.name, COALESCE(ua.earned_points, at.points) as points, at.icon
      FROM user_actions ua
      JOIN action_types at ON ua.action_type_id = at.id
      WHERE ua.user_id = $1
      ORDER BY ua.logged_at DESC
      LIMIT 10
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
