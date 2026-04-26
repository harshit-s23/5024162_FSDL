const User = require('./User');
const Task = require('./Task');
const CarbonLog = require('./CarbonLog');

// Associations
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(CarbonLog, { foreignKey: 'userId', as: 'carbonLogs', onDelete: 'CASCADE' });
CarbonLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Task.hasMany(CarbonLog, { foreignKey: 'taskId', as: 'logs', onDelete: 'SET NULL' });
CarbonLog.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

module.exports = { User, Task, CarbonLog };
