import React from 'react';
import { motion } from 'framer-motion';
import { getCategoryMeta } from '../../utils/constants';

export default function TaskCard({ task, onEdit, onDelete, onToggle, index }) {
  const meta = getCategoryMeta(task.category);
  const isNegative = task.carbonValue < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.04 }}
      className={`glass-card rounded-2xl p-4 border transition-all hover:shadow-md ${
        task.completed ? 'opacity-60' : 'border-forest-100'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            task.completed
              ? 'bg-forest-500 border-forest-500'
              : 'border-forest-300 hover:border-forest-500'
          }`}
        >
          {task.completed && <span className="text-white text-xs">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm font-semibold text-forest-900 ${task.completed ? 'line-through text-sage-400' : ''}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg font-medium"
                  style={{ color: meta.color, background: meta.bg }}
                >
                  {meta.emoji} {meta.label}
                </span>
                <span className="text-xs text-sage-400">{task.date}</span>
                {task.quantity && task.unit && (
                  <span className="text-xs text-sage-400 font-mono">
                    {task.quantity} {task.unit}
                  </span>
                )}
              </div>
              {task.description && (
                <p className="text-xs text-sage-500 mt-1 line-clamp-1">{task.description}</p>
              )}
            </div>

            {/* Carbon value */}
            <div className="flex-shrink-0 text-right">
              <span className={`text-sm font-bold font-mono px-2.5 py-1 rounded-lg ${
                isNegative
                  ? 'bg-forest-100 text-forest-700'
                  : 'bg-earth-100 text-earth-700'
              }`}>
                {isNegative ? '−' : '+'}{Math.abs(task.carbonValue).toFixed(2)}
                <span className="text-[10px] font-normal ml-0.5">kg</span>
              </span>
              {isNegative && (
                <p className="text-[10px] text-forest-500 mt-0.5 text-center">saved</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-forest-50">
        <button
          onClick={() => onEdit(task)}
          className="text-xs text-sage-500 hover:text-forest-600 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-forest-50"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-sage-500 hover:text-red-500 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
        >
          🗑 Delete
        </button>
      </div>
    </motion.div>
  );
}
