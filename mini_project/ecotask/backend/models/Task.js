const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 200] },
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  category: {
    type: DataTypes.ENUM('transport', 'food', 'energy', 'shopping', 'waste', 'water', 'other'),
    allowNull: false,
  },
  subcategory: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  carbonValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'kg CO2 equivalent. Positive = emission, Negative = saving',
  },
  quantity: {
    type: DataTypes.FLOAT,
    defaultValue: 1,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'unit',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
});

module.exports = Task;
