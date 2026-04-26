import React from 'react';
import { motion } from 'framer-motion';

const ALL_BADGES = [
  { id: 'first_task',   emoji: '🎯', name: 'First Step',     desc: 'Logged your first eco task' },
  { id: 'week_streak',  emoji: '🔥', name: 'Week Warrior',   desc: '7-day logging streak' },
  { id: 'carbon_saver', emoji: '💚', name: 'Carbon Saver',   desc: 'Saved 10kg CO₂ in a week' },
  { id: 'green_commuter',emoji: '🚲',name: 'Green Commuter', desc: 'Used eco transport 5 times' },
  { id: 'plant_power',  emoji: '🥗', name: 'Plant Power',    desc: 'Chose plant-based 10 times' },
  { id: 'energy_saver', emoji: '⚡', name: 'Energy Saver',   desc: 'Reduced energy by 20%' },
  { id: 'recycler',     emoji: '♻️', name: 'Recycler Pro',   desc: 'Recycled 50kg of waste' },
  { id: 'earth_guardian',emoji: '🌍',name: 'Earth Guardian', desc: 'Achieved maximum eco score' },
];

export default function BadgeGrid({ earnedBadges = [] }) {
  const earnedIds = earnedBadges.map(b => b.id);

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-forest-900 mb-3">Badges</h3>
      <div className="grid grid-cols-4 gap-2">
        {ALL_BADGES.map((badge, i) => {
          const earned = earnedIds.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`tooltip flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                earned
                  ? 'bg-forest-50 border-forest-200 shadow-sm'
                  : 'bg-gray-50 border-gray-100 opacity-40'
              }`}
              data-tip={badge.desc}
            >
              <span className="text-xl mb-1">{badge.emoji}</span>
              <span className="text-[9px] text-center font-medium text-forest-700 leading-tight">{badge.name}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
