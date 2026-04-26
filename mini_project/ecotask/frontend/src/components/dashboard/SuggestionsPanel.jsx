import React from 'react';
import { motion } from 'framer-motion';

export default function SuggestionsPanel({ suggestions = [] }) {
  if (!suggestions.length) return null;

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-forest-900 mb-3">
        Smart Suggestions 💡
      </h3>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3 p-3.5 bg-forest-50 border border-forest-100 rounded-xl"
          >
            <span className="text-xl flex-shrink-0">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-forest-800 font-medium leading-snug">{s.tip}</p>
              <p className="text-xs text-forest-600 mt-1 font-mono">{s.impact}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
