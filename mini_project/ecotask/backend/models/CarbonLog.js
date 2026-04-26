const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CarbonLog = sequelize.define('CarbonLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carbonAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  tableName: 'carbon_logs',
  timestamps: true,
});

module.exports = CarbonLog;
