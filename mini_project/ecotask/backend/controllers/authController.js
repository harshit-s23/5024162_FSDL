const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { getEcoLevel } = require('../utils/carbonEngine');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    const { password: _, ...userData } = user.toJSON();
    const level = getEcoLevel(userData.totalEcoScore);

    res.status(201).json({
      success: true,
      token: generateToken(user.id),
      user: { ...userData, levelData: level },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { password: _, ...userData } = user.toJSON();
    const level = getEcoLevel(userData.totalEcoScore);

    res.json({
      success: true,
      token: generateToken(user.id),
      user: { ...userData, levelData: level },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    const level = getEcoLevel(user.totalEcoScore);
    res.json({ success: true, user: { ...user.toJSON(), levelData: level } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe };
