import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '🌿' },
  { to: '/tasks',     label: 'Tasks',     icon: '✅' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const levelData = user?.levelData || { emoji: '🌱', name: 'Seedling' };

  return (
    <div className="min-h-screen eco-bg flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 glass-card border-r border-forest-100 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-forest-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center text-lg shadow-md">
              🌱
            </div>
            <div>
              <h1 className="font-display font-bold text-forest-900 text-lg leading-tight">EcoTask</h1>
              <p className="text-xs text-sage-500 font-body">Carbon Tracker</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-forest-600 text-white shadow-md shadow-forest-200'
                    : 'text-sage-700 hover:bg-forest-50 hover:text-forest-700'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="px-4 py-4 border-t border-forest-100">
          <div className="bg-forest-50 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-forest-200 rounded-full flex items-center justify-center text-lg">
                {levelData.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-forest-900 truncate">{user?.name}</p>
                <p className="text-xs text-sage-500">{levelData.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-earth-600 font-medium">
                🔥 {user?.streak || 0} day streak
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-sage-500 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass-card border-b border-forest-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="font-display font-bold text-forest-900">EcoTask</span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-forest-50">
          <div className="w-5 h-0.5 bg-forest-800 mb-1 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
          <div className="w-5 h-0.5 bg-forest-800 mb-1" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-forest-800 transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-14 left-0 right-0 z-30 glass-card border-b border-forest-100 p-4 space-y-2"
          >
            {NAV.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-forest-600 text-white' : 'text-sage-700 hover:bg-forest-50'
                  }`
                }
              >
                <span>{icon}</span>{label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl">
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
