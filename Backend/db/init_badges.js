const db = require('./index');

const seedBadges = async () => {
  try {

    await db.query(`
      INSERT INTO action_types (name, description, points, icon) VALUES
        ('Helped an Animal', 'Provided food, water, or shelter to a stray', 15, '🐾'),
        ('Shared Eco Awareness', 'Educated peers about sustainability', 10, '📢'),
        ('Organized Local Clean-up', 'Led a community environmental effort', 30, '🏙️')
      ON CONFLICT DO NOTHING;
    `);

    await db.query(`
      ALTER TABLE badges 
      ADD COLUMN IF NOT EXISTS category VARCHAR(50),
      ADD COLUMN IF NOT EXISTS level INT;
    `);

    await db.query('DELETE FROM user_badges');
    await db.query('DELETE FROM badges');

    const newBadges = [
      { name: 'Bronze Action Taker', desc: 'Log your first action', icon: '🌱', criteria: 'total_actions >= 1', category: 'Action Taker', level: 1 },
      { name: 'Silver Action Taker', desc: 'Log 20 actions', icon: '🌿', criteria: 'total_actions >= 20', category: 'Action Taker', level: 2 },
      { name: 'Gold Action Taker', desc: 'Log 100 actions', icon: '🌳', criteria: 'total_actions >= 100', category: 'Action Taker', level: 3 },

      { name: 'Bronze Point Collector', desc: 'Earn 50 points', icon: '⭐', criteria: 'total_points >= 50', category: 'Point Collector', level: 1 },
      { name: 'Silver Point Collector', desc: 'Earn 500 points', icon: '🌟', criteria: 'total_points >= 500', category: 'Point Collector', level: 2 },
      { name: 'Gold Point Collector', desc: 'Earn 2000 points', icon: '✨', criteria: 'total_points >= 2000', category: 'Point Collector', level: 3 },

      { name: 'Bronze Recycler', desc: 'Recycle 5 items', icon: '♻️', criteria: 'recycle_count >= 5', category: 'Recycling Master', level: 1 },
      { name: 'Silver Recycler', desc: 'Recycle 25 items', icon: '♻️', criteria: 'recycle_count >= 25', category: 'Recycling Master', level: 2 },
      { name: 'Gold Recycler', desc: 'Recycle 100 items', icon: '♻️', criteria: 'recycle_count >= 100', category: 'Recycling Master', level: 3 },

      { name: 'Bronze Energy Saver', desc: 'Save electricity 5 times', icon: '💡', criteria: 'energy_count >= 5', category: 'Energy Saver', level: 1 },
      { name: 'Silver Energy Saver', desc: 'Save electricity 25 times', icon: '💡', criteria: 'energy_count >= 25', category: 'Energy Saver', level: 2 },
      { name: 'Gold Energy Saver', desc: 'Save electricity 100 times', icon: '💡', criteria: 'energy_count >= 100', category: 'Energy Saver', level: 3 },

      { name: 'Bronze Water Guardian', desc: 'Save water 5 times', icon: '💧', criteria: 'water_count >= 5', category: 'Water Guardian', level: 1 },
      { name: 'Silver Water Guardian', desc: 'Save water 25 times', icon: '💧', criteria: 'water_count >= 25', category: 'Water Guardian', level: 2 },
      { name: 'Gold Water Guardian', desc: 'Save water 100 times', icon: '💧', criteria: 'water_count >= 100', category: 'Water Guardian', level: 3 },

      { name: 'Bronze Transport Hero', desc: 'Use eco transport 5 times', icon: '🚲', criteria: 'transport_count >= 5', category: 'Transport Hero', level: 1 },
      { name: 'Silver Transport Hero', desc: 'Use eco transport 25 times', icon: '🚲', criteria: 'transport_count >= 25', category: 'Transport Hero', level: 2 },
      { name: 'Gold Transport Hero', desc: 'Use eco transport 100 times', icon: '🚲', criteria: 'transport_count >= 100', category: 'Transport Hero', level: 3 },

      { name: 'Bronze Animal Saver', desc: 'Help an animal 1 time', icon: '🐾', criteria: 'animal_count >= 1', category: 'Animal Saver', level: 1 },
      { name: 'Silver Animal Saver', desc: 'Help animals 10 times', icon: '🐾', criteria: 'animal_count >= 10', category: 'Animal Saver', level: 2 },
      { name: 'Gold Animal Saver', desc: 'Help animals 50 times', icon: '🐾', criteria: 'animal_count >= 50', category: 'Animal Saver', level: 3 },

      { name: 'Bronze Awareness Hero', desc: 'Share awareness 1 time', icon: '📢', criteria: 'awareness_count >= 1', category: 'Awareness Hero', level: 1 },
      { name: 'Silver Awareness Hero', desc: 'Share awareness 10 times', icon: '📢', criteria: 'awareness_count >= 10', category: 'Awareness Hero', level: 2 },
      { name: 'Gold Awareness Hero', desc: 'Share awareness 50 times', icon: '📢', criteria: 'awareness_count >= 50', category: 'Awareness Hero', level: 3 },

      { name: 'Bronze Local Mayor', desc: 'Organize 1 clean-up', icon: '🏙️', criteria: 'mayor_count >= 1', category: 'Local Mayor', level: 1 },
      { name: 'Silver Local Mayor', desc: 'Organize 5 clean-ups', icon: '🏙️', criteria: 'mayor_count >= 5', category: 'Local Mayor', level: 2 },
      { name: 'Gold Local Mayor', desc: 'Organize 20 clean-ups', icon: '🏙️', criteria: 'mayor_count >= 20', category: 'Local Mayor', level: 3 }
    ];

    for (const b of newBadges) {
      await db.query(
        'INSERT INTO badges (name, description, icon, criteria, category, level) VALUES ($1, $2, $3, $4, $5, $6)',
        [b.name, b.desc, b.icon, b.criteria, b.category, b.level]
      );
    }

    console.log('Successfully seeded 27 badges and new action types!');
  } catch (err) {
    console.error('Error seeding badges:', err);
  } finally {
    process.exit(0);
  }
};

seedBadges();
