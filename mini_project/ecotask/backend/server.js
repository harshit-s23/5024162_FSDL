require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models'); // initialize associations

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'EcoTask API running 🌱' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ SQLite database synced');
  app.listen(PORT, () => console.log(`🌱 EcoTask server running on port ${PORT}`));
}).catch(err => {
  console.error('Database sync failed:', err);
  process.exit(1);
});
