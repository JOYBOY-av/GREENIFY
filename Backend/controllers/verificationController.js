const db = require('../db');
const fileProcessingService = require('../services/fileProcessingService');
const fraudDetectionService = require('../services/fraudDetectionService');
const aiVerificationService = require('../services/aiVerificationService');

exports.verifyAction = async (req, res) => {
  const { action_type_id, note, device_id } = req.body;
  const userId = req.user.id;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const file = req.file;

  try {

    const userRes = await db.query('SELECT trust_score FROM users WHERE id = $1', [userId]);
    const trustScore = userRes.rows[0]?.trust_score || 100;

    const actionTypeRes = await db.query('SELECT * FROM action_types WHERE id = $1', [action_type_id]);
    if (actionTypeRes.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid action type' });
    }
    const actionType = actionTypeRes.rows[0];

    const hasProof = !!file;
    const rateLimitCheck = await fraudDetectionService.checkRateLimits(userId, ipAddress, device_id, action_type_id, hasProof);
    if (rateLimitCheck.isLimited) {
      return res.status(429).json({ status: 'rejected', explanation: rateLimitCheck.reason });
    }

    const insertRes = await db.query(`
      INSERT INTO user_actions (user_id, action_type_id, note, ip_address, device_id, status)
      VALUES ($1, $2, $3, $4, $5, 'processing') RETURNING id
    `, [userId, action_type_id, note, ipAddress, device_id]);
    const actionId = insertRes.rows[0].id;

    const recordReview = async (rule) => {
      await db.query('INSERT INTO action_reviews (action_id, rule_triggered) VALUES ($1, $2)', [actionId, rule]);
    };

    const updateStatus = async (status, points, confidence, explanation, metadata, proofUrl, proofHash, phash) => {
      await db.query(`
        UPDATE user_actions 
        SET status = $1, earned_points = $2, confidence_score = $3, ai_explanation = $4, metadata = $5, proof_url = $6, proof_hash = $7, phash = $8
        WHERE id = $9
      `, [status, points, confidence, explanation, metadata, proofUrl, proofHash, phash, actionId]);

      if (status === 'verified') {
        await db.query('UPDATE users SET trust_score = trust_score + 1 WHERE id = $1', [userId]);
      } else if (status === 'rejected') {
        await db.query('UPDATE users SET trust_score = GREATEST(0, trust_score - 5) WHERE id = $1', [userId]);
      }
    };

    let extractedData = {};
    let aiResult = { confidence_score: 50, explanation: "No proof provided." }; // Default if no file
    let proofUrl = null;

    if (file) {
      proofUrl = `/uploads/${file.filename}`;

      extractedData = await fileProcessingService.processFile(file.path, file.mimetype);

      if (extractedData.warnings && extractedData.warnings.length > 0) {
        await recordReview('File Warnings: ' + extractedData.warnings.join(', '));
      }

      const dupCheck = await fraudDetectionService.checkDuplicates(extractedData.sha256, extractedData.phash);
      if (dupCheck.isExactDuplicate) {
        await recordReview('Exact Duplicate File (SHA-256)');
        await updateStatus('rejected', 0, 0, 'This image has already been submitted.', extractedData, proofUrl, extractedData.sha256, extractedData.phash);
        return res.json({ status: 'rejected', explanation: 'This image has already been submitted.' });
      }
      if (dupCheck.isNearDuplicate) {
        await recordReview(`Near Duplicate File (Phash distance: ${dupCheck.closestDistance})`);
        await updateStatus('rejected', 0, 0, 'This image is too similar to an existing submission.', extractedData, proofUrl, extractedData.sha256, extractedData.phash);
        return res.json({ status: 'rejected', explanation: 'This image is too similar to an existing submission.' });
      }

      aiResult = await aiVerificationService.verifySubmission(actionType.name, note, file.path, file.mimetype, extractedData);
    } else {

      if (trustScore < 50) {
        aiResult.confidence_score = 0;
        aiResult.explanation = "Your trust score is too low to submit actions without proof. Please upload an image.";
      } else {

        aiResult.confidence_score = 100; // Force verify
        aiResult.explanation = "Action verified based on trust, but earned reduced points since no proof was provided.";
        actionType.points = Math.max(1, Math.floor(actionType.points * 0.2));
      }
    }

    let finalScore = aiResult.confidence_score;
    let penalties = 0;

    if (extractedData.warnings && extractedData.warnings.some(w => w.includes('older than 30 days'))) {
      penalties += 30;
      await recordReview('Penalty applied: Old photo');
    }
    if (aiResult.is_screen_photo) {
      penalties += 40;
      await recordReview('Penalty applied: Screen photo detected');
    }
    if (aiResult.is_stock_photo) {
      penalties += 50;
      await recordReview('Penalty applied: Stock photo detected');
    }

    const trustBonus = Math.floor(trustScore / 10);
    finalScore = finalScore - penalties + trustBonus;

    finalScore = Math.max(0, Math.min(100, finalScore));

    let finalStatus = 'pending';
    let earnedPoints = 0;

    if (finalScore >= 80) {
      finalStatus = 'verified';
      earnedPoints = actionType.points;
    } else if (finalScore >= 60) {
      finalStatus = 'needs_more_evidence';
    } else {
      finalStatus = 'rejected';
    }

    const metadata = {
      ocrText: extractedData.ocrText,
      exif: extractedData.exif,
      ai_raw: aiResult
    };

    const isAccepted = finalStatus === 'verified' || finalStatus === 'needs_more_evidence';
    const storedHash = isAccepted ? extractedData.sha256 : null;
    const storedPhash = isAccepted ? extractedData.phash : null;

    await updateStatus(finalStatus, earnedPoints, finalScore, aiResult.explanation, metadata, proofUrl, storedHash, storedPhash);

    let newlyEarnedBadges = [];
    let totalPoints = 0;
    if (finalStatus === 'verified') {
      const statsRes = await db.query('SELECT COALESCE(SUM(earned_points), 0) as tp FROM user_actions WHERE user_id = $1 AND status = $2', [userId, 'verified']);
      totalPoints = parseInt(statsRes.rows[0].tp);

      const actionsCountRes = await db.query("SELECT COUNT(*) FROM user_actions WHERE user_id=$1 AND status='verified'", [userId]);
      if (parseInt(actionsCountRes.rows[0].count) === 1) {

      }
    }

    res.status(200).json({
      status: finalStatus,
      confidence_score: finalScore,
      points_awarded: earnedPoints,
      explanation: aiResult.explanation,
      total_points: totalPoints,
      new_badges: newlyEarnedBadges
    });

  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ status: 'error', msg: 'Internal server error during verification' });
  }
};
