import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, unit, sub, color = 'forest', delay = 0 }) {
  const colorMap = {
    forest: 'bg-forest-50 border-forest-100 text-forest-800',
    earth: 'bg-earth-50 border-earth-100 text-earth-800',
    sage: 'bg-sage-50 border-sage-100 text-sage-800',
    red: 'bg-red-50 border-red-100 text-red-800',
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-card rounded-2xl p-5 border ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-70 uppercase tracking-wide mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-display">{value}</span>
            {unit && <span className="text-sm opacity-60">{unit}</span>}
          </div>
          {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </motion.div>
  );
}
