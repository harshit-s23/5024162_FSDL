import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await register(form.name, form.email, form.password);
    if (!result.success) toast.error(result.message);
    else toast.success('Welcome to EcoTask! 🌱');
  };

  return (
    <div className="min-h-screen eco-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-earth-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-forest-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-forest-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg animate-float">
              🌍
            </div>
            <h1 className="font-display text-3xl font-bold text-forest-900 mb-1">Join EcoTask</h1>
            <p className="text-sage-500 text-sm">Start tracking your carbon footprint today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
              { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-forest-800 mb-1.5">{label}</label>
                <input
                  type={type}
                  required
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white/70 text-forest-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-400 transition-all text-sm"
                  placeholder={placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 text-sm mt-2"
            >
              {loading ? '🌱 Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-sage-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="mt-6 glass-card rounded-2xl p-4">
          <p className="text-xs text-sage-600 text-center">
            🌿 By joining, you commit to tracking and reducing your environmental impact.
            Every action counts for our planet.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
