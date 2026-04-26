import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (!result.success) toast.error(result.message);
  };

  const fillDemo = () => setForm({ email: 'demo@ecotask.com', password: 'demo123' });

  return (
    <div className="min-h-screen eco-bg flex items-center justify-center p-4">
      {/* Decorative bg elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-forest-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sage-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-forest-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg animate-float">
              🌱
            </div>
            <h1 className="font-display text-3xl font-bold text-forest-900 mb-1">Welcome back</h1>
            <p className="text-sage-500 text-sm">Continue your eco journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white/70 text-forest-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-400 transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white/70 text-forest-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-400 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 text-sm"
            >
              {loading ? '🌿 Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 flex gap-3">
            <button
              onClick={fillDemo}
              className="flex-1 py-2.5 border border-forest-200 text-forest-700 text-sm rounded-xl hover:bg-forest-50 transition-all font-medium"
            >
              Use Demo Account
            </button>
          </div>

          <p className="text-center text-sm text-sage-500 mt-6">
            New to EcoTask?{' '}
            <Link to="/register" className="text-forest-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>

        {/* Stats preview */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[['🌍', '2.4M kg', 'CO₂ Saved'], ['👥', '12k+', 'Users'], ['🏆', '98%', 'Eco Score']].map(([icon, val, label]) => (
            <div key={label} className="glass-card rounded-2xl p-3">
              <div className="text-lg">{icon}</div>
              <div className="text-sm font-bold text-forest-800">{val}</div>
              <div className="text-xs text-sage-500">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
