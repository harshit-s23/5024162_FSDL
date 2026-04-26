const { Op } = require('sequelize');
const { Task, CarbonLog, User } = require('../models');
const { calculateCarbonValue, calculateEcoScore, getEcoLevel, checkBadges, updateStreak } = require('../utils/carbonEngine');

const refreshUserStats = async (userId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await CarbonLog.findAll({
    where: { userId, date: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] } },
  });

  const totalCarbon = logs.reduce((sum, l) => sum + l.carbonAmount, 0);
  const ecoScore = calculateEcoScore(totalCarbon, 30);
  const level = getEcoLevel(ecoScore);

  const user = await User.findByPk(userId);
  const totalTasks = await Task.count({ where: { userId } });
  const newStreak = updateStreak(user);
  const newBadges = checkBadges(user, { totalTasks, ecoScore });

  await user.update({
    totalEcoScore: ecoScore,
    level: level.name,
    badges: newBadges,
    streak: newStreak,
    lastActiveDate: new Date().toISOString().split('T')[0],
  });

  return { ecoScore, level, streak: newStreak };
};

const getTasks = async (req, res) => {
  try {
    const { date, category, startDate, endDate } = req.query;
    const where = { userId: req.user.id };

    if (date) where.date = date;
    if (category) where.category = category;
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

    const tasks = await Task.findAll({ where, order: [['date', 'DESC'], ['createdAt', 'DESC']] });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, category, subcategory, quantity, unit, date, isRecurring } = req.body;

    if (!title || !category || !date)
      return res.status(400).json({ success: false, message: 'title, category, date are required' });

    const carbonValue = calculateCarbonValue(category, subcategory, quantity || 1);

    const task = await Task.create({
      userId: req.user.id,
      title,
      description: description || '',
      category,
      subcategory: subcategory || '',
      carbonValue,
      quantity: quantity || 1,
      unit: unit || 'unit',
      date,
      isRecurring: isRecurring || false,
    });

    await CarbonLog.create({
      userId: req.user.id,
      taskId: task.id,
      date,
      category,
      carbonAmount: carbonValue,
      description: title,
    });

    const stats = await refreshUserStats(req.user.id);

    res.status(201).json({ success: true, task, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const { title, description, category, subcategory, quantity, unit, date, completed } = req.body;

    const newCarbon = calculateCarbonValue(
      category || task.category,
      subcategory || task.subcategory,
      quantity || task.quantity
    );

    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      category: category || task.category,
      subcategory: subcategory !== undefined ? subcategory : task.subcategory,
      carbonValue: newCarbon,
      quantity: quantity || task.quantity,
      unit: unit || task.unit,
      date: date || task.date,
      completed: completed !== undefined ? completed : task.completed,
    });

    const existingLog = await CarbonLog.findOne({ where: { taskId: task.id } });
    if (existingLog) {
      await existingLog.update({ carbonAmount: newCarbon, category: task.category, date: task.date });
    }

    const stats = await refreshUserStats(req.user.id);

    res.json({ success: true, task, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await CarbonLog.destroy({ where: { taskId: task.id } });
    await task.destroy();

    const stats = await refreshUserStats(req.user.id);

    res.json({ success: true, message: 'Task deleted', stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
