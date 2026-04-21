const db = require('./index');

const updateDb = async () => {
  try {
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(10),
      ADD COLUMN IF NOT EXISTS reset_otp_expires TIMESTAMP;
    `);
    console.log('Database updated successfully with OTP columns.');
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    process.exit(0);
  }
};

updateDb();
