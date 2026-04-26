const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Task, CarbonLog, User } = require('../models');
const { generateSuggestions, getEcoLevel } = require('../utils/carbonEngine');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Date ranges
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
    const prevWeekStart = new Date(); prevWeekStart.setDate(prevWeekStart.getDate() - 14);
    const prevWeekEnd = new Date(); prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

    // Today's stats
    const todayLogs = await CarbonLog.findAll({ where: { userId, date: today } });
    const todayCarbon = todayLogs.reduce((s, l) => s + l.carbonAmount, 0);

    // Weekly stats
    const weeklyLogs = await CarbonLog.findAll({
      where: { userId, date: { [Op.gte]: weekAgo.toISOString().split('T')[0] } },
    });
    const weeklyCarbon = weeklyLogs.reduce((s, l) => s + l.carbonAmount, 0);

    // Previous week for comparison
    const prevWeekLogs = await CarbonLog.findAll({
      where: { userId, date: { [Op.between]: [prevWeekStart.toISOString().split('T')[0], prevWeekEnd.toISOString().split('T')[0]] } },
    });
    const prevWeekCarbon = prevWeekLogs.reduce((s, l) => s + l.carbonAmount, 0);

    // Monthly stats
    const monthlyLogs = await CarbonLog.findAll({
      where: { userId, date: { [Op.gte]: monthAgo.toISOString().split('T')[0] } },
    });
    const monthlyCarbon = monthlyLogs.reduce((s, l) => s + l.carbonAmount, 0);

    // Weekly trend (last 7 days)
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = weeklyLogs.filter(l => l.date === dateStr);
      const dayCarbon = dayLogs.reduce((s, l) => s + l.carbonAmount, 0);
      weeklyTrend.push({
        date: dateStr,
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        carbon: parseFloat(dayCarbon.toFixed(2)),
      });
    }

    // Category breakdown
    const categoryBreakdown = {};
    monthlyLogs.forEach(log => {
      if (!categoryBreakdown[log.category]) {
        categoryBreakdown[log.category] = { totalCarbon: 0, count: 0 };
      }
      categoryBreakdown[log.category].totalCarbon += log.carbonAmount;
      categoryBreakdown[log.category].count++;
    });

    // Format for pie chart
    const categoryData = Object.entries(categoryBreakdown).map(([cat, data]) => ({
      category: cat,
      totalCarbon: parseFloat(data.totalCarbon.toFixed(2)),
      count: data.count,
      percentage: parseFloat(((data.totalCarbon / (monthlyCarbon || 1)) * 100).toFixed(1)),
    })).sort((a, b) => b.totalCarbon - a.totalCarbon);

    // Recent tasks
    const recentTasks = await Task.findAll({
      where: { userId },
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 5,
    });

    // Suggestions based on category breakdown
    const suggestions = generateSuggestions(categoryBreakdown);

    // Comparison insight
    const weekChange = prevWeekCarbon > 0
      ? parseFloat((((weeklyCarbon - prevWeekCarbon) / prevWeekCarbon) * 100).toFixed(1))
      : 0;

    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    const levelData = getEcoLevel(user.totalEcoScore);

    res.json({
      success: true,
      dashboard: {
        today: { carbon: parseFloat(todayCarbon.toFixed(2)) },
        weekly: { carbon: parseFloat(weeklyCarbon.toFixed(2)), change: weekChange },
        monthly: { carbon: parseFloat(monthlyCarbon.toFixed(2)) },
        weeklyTrend,
        categoryData,
        recentTasks,
        suggestions,
        user: { ...user.toJSON(), levelData },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCarbonFactors = async (req, res) => {
  const { CARBON_FACTORS } = require('../utils/carbonEngine');
  res.json({ success: true, factors: CARBON_FACTORS });
};

module.exports = { getDashboard, getCarbonFactors };
