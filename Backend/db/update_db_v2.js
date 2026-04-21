const db = require('./index');

const updateDb = async () => {
  try {
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    `);
    

    await db.query(`
      UPDATE users SET is_verified = true WHERE is_verified = false;
    `);

    console.log('Database updated successfully with is_verified column.');
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    process.exit(0);
  }
};

updateDb();
