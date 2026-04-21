const fs = require('fs');
const path = require('path');
const db = require('./index');

const initDb = async () => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
    await db.query(schemaSql);
    console.log('Database initialized successfully with schema and seeds.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    process.exit(0);
  }
};

initDb();
