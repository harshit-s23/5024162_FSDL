require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const { User, Task, CarbonLog } = require('./models');
const { calculateCarbonValue, calculateEcoScore, getEcoLevel } = require('./utils/carbonEngine');

const seed = async () => {
  await sequelize.sync({ force: true });
  console.log('🗑️  Database cleared');

  // Demo user
  const hashed = await bcrypt.hash('demo123', 12);
  const user = await User.create({
    name: 'Alex Green',
    email: 'demo@ecotask.com',
    password: hashed,
    totalEcoScore: 68,
    streak: 5,
    level: 'Tree',
    badges: [
      { id: 'first_task', name: 'First Step', emoji: '🎯' },
      { id: 'week_streak', name: 'Week Warrior', emoji: '🔥' },
    ],
    lastActiveDate: new Date().toISOString().split('T')[0],
  });
  console.log('👤 Demo user created: demo@ecotask.com / demo123');

  // Helper to get date string N days ago
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  const taskData = [
    // Today
    { title: 'Drive to office', category: 'transport', subcategory: 'car_petrol',      quantity: 18, unit: 'km',   date: daysAgo(0) },
    { title: 'Chicken lunch',   category: 'food',      subcategory: 'chicken',          quantity: 0.3,unit: 'kg',  date: daysAgo(0) },
    { title: 'Home electricity',category: 'energy',    subcategory: 'electricity',      quantity: 5,  unit: 'kWh', date: daysAgo(0) },

    // Yesterday
    { title: 'Train to city',   category: 'transport', subcategory: 'train',            quantity: 30, unit: 'km',  date: daysAgo(1) },
    { title: 'Vegan dinner',    category: 'food',      subcategory: 'vegan_meal',       quantity: 1,  unit: 'meal',date: daysAgo(1) },
    { title: 'Recycled waste',  category: 'waste',     subcategory: 'recycling',        quantity: 2,  unit: 'kg',  date: daysAgo(1) },

    // 2 days ago
    { title: 'Cycling to gym',  category: 'transport', subcategory: 'cycling',          quantity: 8,  unit: 'km',  date: daysAgo(2) },
    { title: 'Beef steak',      category: 'food',      subcategory: 'beef',             quantity: 0.4,unit: 'kg',  date: daysAgo(2) },
    { title: 'Solar generated', category: 'energy',    subcategory: 'solar_panel',      quantity: 3,  unit: 'kWh', date: daysAgo(2) },

    // 3 days ago
    { title: 'Bus commute',     category: 'transport', subcategory: 'bus',              quantity: 12, unit: 'km',  date: daysAgo(3) },
    { title: 'Plant-based meal',category: 'food',      subcategory: 'plant_based_meal', quantity: 2,  unit: 'meal',date: daysAgo(3) },
    { title: 'Online delivery', category: 'shopping',  subcategory: 'online_shopping',  quantity: 2,  unit: 'parcel',date:daysAgo(3)},

    // 4 days ago
    { title: 'Car trip',        category: 'transport', subcategory: 'car_petrol',       quantity: 40, unit: 'km',  date: daysAgo(4) },
    { title: 'Electricity use', category: 'energy',    subcategory: 'electricity',      quantity: 8,  unit: 'kWh', date: daysAgo(4) },
    { title: 'Tree planted',    category: 'other',     subcategory: 'tree_planted',     quantity: 1,  unit: 'tree',date: daysAgo(4) },

    // 5 days ago
    { title: 'Train trip',      category: 'transport', subcategory: 'train',            quantity: 50, unit: 'km',  date: daysAgo(5) },
    { title: 'Lamb dinner',     category: 'food',      subcategory: 'lamb',             quantity: 0.2,unit: 'kg',  date: daysAgo(5) },
    { title: 'Shower (8 min)',  category: 'water',     subcategory: 'shower',           quantity: 8,  unit: 'min', date: daysAgo(5) },

    // 6 days ago
    { title: 'Walk to market',  category: 'transport', subcategory: 'walking',          quantity: 2,  unit: 'km',  date: daysAgo(6) },
    { title: 'Secondhand buy',  category: 'shopping',  subcategory: 'secondhand',       quantity: 1,  unit: 'item',date: daysAgo(6) },
    { title: 'Composting',      category: 'waste',     subcategory: 'composting',       quantity: 1.5,unit: 'kg',  date: daysAgo(6) },
  ];

  let totalCarbon = 0;
  for (const t of taskData) {
    const carbonValue = calculateCarbonValue(t.category, t.subcategory, t.quantity);
    const task = await Task.create({ ...t, userId: user.id, carbonValue, completed: Math.random() > 0.3 });
    await CarbonLog.create({ userId: user.id, taskId: task.id, date: t.date, category: t.category, carbonAmount: carbonValue, description: t.title });
    totalCarbon += carbonValue;
    console.log(`  ✅ ${t.title}: ${carbonValue > 0 ? '+' : ''}${carbonValue.toFixed(3)} kg CO₂`);
  }

  const score = calculateEcoScore(totalCarbon, 30);
  const level = getEcoLevel(score);
  await user.update({ totalEcoScore: score, level: level.name });

  console.log(`\n🌍 Eco Score: ${score} (${level.name} ${level.emoji})`);
  console.log('✅ Seed complete!\n');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
