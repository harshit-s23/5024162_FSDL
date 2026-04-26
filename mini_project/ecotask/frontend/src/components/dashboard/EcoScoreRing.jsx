import React from 'react';
import { motion } from 'framer-motion';

export default function EcoScoreRing({ score = 0, level = {}, size = 160 }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#22c55e' : score >= 40 ? '#84cc16' : score >= 20 ? '#eab308' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Background ring */}
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="#dcfce7"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <motion.circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="ring-progress"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
          />
          {/* Inner content */}
          <text x="60" y="52" textAnchor="middle" fontSize="22" fontWeight="700" fill="#14532d" fontFamily="Playfair Display, serif">
            {Math.round(score)}
          </text>
          <text x="60" y="65" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="DM Sans, sans-serif">
            ECO SCORE
          </text>
          <text x="60" y="79" textAnchor="middle" fontSize="14">
            {level.emoji || '🌱'}
          </text>
        </svg>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-semibold text-forest-800">{level.name || 'Seedling'}</p>
      </div>
    </div>
  );
}
