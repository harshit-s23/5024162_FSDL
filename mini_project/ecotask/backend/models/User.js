const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [2, 50] },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalEcoScore: {
    type: DataTypes.FLOAT,
    defaultValue: 100,
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastActiveDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  badges: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('badges');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('badges', JSON.stringify(val));
    },
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'Seedling',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
