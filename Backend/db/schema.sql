-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  college     VARCHAR(150),
  password    VARCHAR(255) NOT NULL,        -- bcrypt hash
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Action categories
CREATE TABLE IF NOT EXISTS action_types (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  points      INT NOT NULL,
  icon        VARCHAR(50)
);

-- User-logged actions
CREATE TABLE IF NOT EXISTS user_actions (
  id             SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(id) ON DELETE CASCADE,
  action_type_id INT REFERENCES action_types(id),
  note           TEXT,
  logged_at      TIMESTAMP DEFAULT NOW()
);

-- Badges definition
CREATE TABLE IF NOT EXISTS badges (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  criteria    VARCHAR(100)
);

-- Badges earned by users
CREATE TABLE IF NOT EXISTS user_badges (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  badge_id   INT REFERENCES badges(id),
  earned_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Seed Data (Optional, ignore if already exists)
INSERT INTO action_types (name, description, points, icon) VALUES
  ('Recycled Waste',        'Properly sorted and recycled trash',       10, '♻️'),
  ('Biked Instead of Car',  'Used bike or walked instead of vehicle',   15, '🚴'),
  ('Saved Electricity',     'Turned off lights/devices when not in use', 8, '💡'),
  ('Saved Water',           'Took shorter shower or fixed a leak',       8, '💧'),
  ('Used Reusable Bag',     'Avoided single-use plastic bags',           5, '🛍️'),
  ('Ate Plant-Based Meal',  'Chose vegetarian/vegan food',              12, '🥗'),
  ('Picked Up Litter',      'Collected litter from public spaces',      20, '🗑️'),
  ('Used Public Transport', 'Took bus/metro instead of car',            12, '🚌')
ON CONFLICT DO NOTHING;

INSERT INTO badges (name, description, icon, criteria) VALUES
  ('Eco Starter',    'Logged your very first action',               '🌱', 'actions_count >= 1'),
  ('Green Streak',   'Logged actions 3 days in a row',              '🔥', 'streak >= 3'),
  ('Point Collector','Earned 50 total points',                      '⭐', 'total_points >= 50'),
  ('Eco Warrior',    'Logged 20 or more actions',                   '🛡️', 'actions_count >= 20'),
  ('Top 10',         'Reached the weekly top 10 leaderboard',       '🏆', 'weekly_rank <= 10')
ON CONFLICT DO NOTHING;
