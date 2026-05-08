const db = require('../db');

const calculateHammingDistance = (hash1, hash2) => {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 1000;
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
};

exports.checkRateLimits = async (userId, ipAddress, deviceId, actionTypeId, hasProof) => {
  const result = { isLimited: false, reason: null };

  try {
    const spamRes = await db.query(`
      SELECT COUNT(*) as count FROM user_actions 
      WHERE user_id = $1 AND status = 'rejected' AND logged_at > NOW() - INTERVAL '1 day'
    `, [userId]);
    if (parseInt(spamRes.rows[0].count) >= 15) {
      return { isLimited: true, reason: 'Spam prevention: Too many rejected submissions today. Please try again tomorrow.' };
    }

    if (ipAddress) {
      const ipRes = await db.query(`
        SELECT COUNT(*) as count FROM user_actions 
        WHERE ip_address = $1 AND logged_at > NOW() - INTERVAL '1 day'
      `, [ipAddress]);
      if (parseInt(ipRes.rows[0].count) >= 50) {
        return { isLimited: true, reason: 'IP daily limit reached.' };
      }
    }

    if (deviceId) {
      const deviceRes = await db.query(`
        SELECT COUNT(*) as count FROM user_actions 
        WHERE device_id = $1 AND logged_at > NOW() - INTERVAL '1 day'
      `, [deviceId]);
      if (parseInt(deviceRes.rows[0].count) >= 20) {
        return { isLimited: true, reason: 'Device daily limit reached.' };
      }
    }

    const validStatuses = "'verified', 'needs_more_evidence', 'processing'";

    const userRes = await db.query(`
      SELECT COUNT(*) as count FROM user_actions 
      WHERE user_id = $1 AND status IN (${validStatuses}) AND logged_at > NOW() - INTERVAL '1 day'
    `, [userId]);
    if (parseInt(userRes.rows[0].count) >= 10) {
      return { isLimited: true, reason: 'User daily limit of 10 valid actions reached.' };
    }

    if (actionTypeId) {
      const typeRes = await db.query(`
        SELECT COUNT(*) as count FROM user_actions 
        WHERE user_id = $1 AND action_type_id = $2 AND status IN (${validStatuses}) AND logged_at > NOW() - INTERVAL '1 day'
      `, [userId, actionTypeId]);
      if (parseInt(typeRes.rows[0].count) >= 3) {
        return { isLimited: true, reason: 'Daily limit of 3 valid submissions for this specific action type reached.' };
      }
    }

    if (hasProof === false) {
      const noProofRes = await db.query(`
        SELECT COUNT(*) as count FROM user_actions 
        WHERE user_id = $1 AND proof_url IS NULL AND status IN (${validStatuses}) AND logged_at > NOW() - INTERVAL '1 day'
      `, [userId]);
      if (parseInt(noProofRes.rows[0].count) >= 3) {
        return { isLimited: true, reason: 'Daily limit of 3 valid submissions without proof reached. Please upload an image.' };
      }
    }

  } catch (err) {
    console.error('Rate Limit Check Error:', err);
  }

  return result;
};

exports.checkDuplicates = async (sha256, phash) => {
  const result = { isExactDuplicate: false, isNearDuplicate: false, closestDistance: null };
  const acceptedStatuses = "'verified', 'needs_more_evidence'";

  try {
    if (sha256) {
      const shaRes = await db.query(
        `SELECT id FROM user_actions WHERE proof_hash = $1 AND status IN (${acceptedStatuses})`,
        [sha256]
      );
      if (shaRes.rows.length > 0) {
        result.isExactDuplicate = true;
        return result;
      }
    }

    if (phash) {
      const phashRes = await db.query(
        `SELECT id, phash FROM user_actions WHERE phash IS NOT NULL AND status IN (${acceptedStatuses})`
      );

      let minDistance = 1000;
      for (const row of phashRes.rows) {
        const dist = calculateHammingDistance(phash, row.phash);
        if (dist < minDistance) minDistance = dist;
      }

      result.closestDistance = minDistance;
      if (minDistance < 5) result.isNearDuplicate = true;
    }

  } catch (err) {
    console.error('Duplicate Check Error:', err);
  }

  return result;
};
