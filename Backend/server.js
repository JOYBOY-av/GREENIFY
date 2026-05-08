const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const path = require('path');

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Greenify API is running!');
});

const authRoutes = require('./routes/auth');
const actionRoutes = require('./routes/actions');
const verifyRoutes = require('./routes/verify');
const dashboardRoutes = require('./routes/dashboard');
const leaderboardRoutes = require('./routes/leaderboard');
const passwordResetRoutes = require('./routes/passwordReset');
const badgesRoutes = require('./routes/badges');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/auth/reset', passwordResetRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
