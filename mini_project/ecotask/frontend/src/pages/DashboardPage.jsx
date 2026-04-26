import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EcoScoreRing from '../components/dashboard/EcoScoreRing';
import StatCard from '../components/dashboard/StatCard';
import BadgeGrid from '../components/dashboard/BadgeGrid';
import SuggestionsPanel from '../components/dashboard/SuggestionsPanel';
import { getCategoryMeta } from '../utils/constants';

const PIE_COLORS = ['#16a34a', '#d97706', '#0369a1', '#7c3aed', '#065f46', '#0284c7', '#6b7280'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 text-xs">
        <p className="font-semibold text-forest-800">{label}</p>
        <p className="text-sage-600">{payload[0].value} kg CO₂</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const { data: res } = await api.get('/dashboard');
      setData(res.dashboard);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl animate-float mb-3">🌱</div>
          <p className="text-sage-500 text-sm">Loading your eco data...</p>
        </div>
      </div>
    );
  }

  const dashboard = data || {};
  const weekChange = dashboard.weekly?.change || 0;
  const userData = dashboard.user || user;
  const levelData = userData?.levelData || { emoji: '🌱', name: 'Seedling' };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-forest-900">
            Hello, {userData?.name?.split(' ')[0]} {levelData.emoji}
          </h2>
          <p className="text-sage-500 text-sm mt-1">
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/tasks"
          className="bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          + Log Activity
        </Link>
      </div>

      {/* Insight banner */}
      {weekChange !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl px-5 py-3.5 flex items-center gap-3 text-sm font-medium ${
            weekChange < 0
              ? 'bg-forest-100 border border-forest-200 text-forest-800'
              : 'bg-earth-50 border border-earth-200 text-earth-800'
          }`}
        >
          <span className="text-lg">{weekChange < 0 ? '📉' : '📈'}</span>
          <span>
            You {weekChange < 0 ? 'reduced' : 'increased'} your emissions by{' '}
            <strong>{Math.abs(weekChange)}%</strong> compared to last week.{' '}
            {weekChange < 0 ? 'Great work! Keep it up 🌿' : 'Try logging eco-friendly activities!'}
          </span>
        </motion.div>
      )}

      {/* Top row: Score + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Eco score */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center border border-forest-100">
          <EcoScoreRing score={userData?.totalEcoScore || 0} level={levelData} />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-orange-500 text-sm font-semibold">🔥 {userData?.streak || 0}</span>
            <span className="text-xs text-sage-500">day streak</span>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon="📅"
            label="Today's Emissions"
            value={(dashboard.today?.carbon || 0).toFixed(2)}
            unit="kg CO₂"
            color="forest"
            delay={0.1}
          />
          <StatCard
            icon="📆"
            label="This Week"
            value={(dashboard.weekly?.carbon || 0).toFixed(2)}
            unit="kg CO₂"
            sub={weekChange !== 0 ? `${weekChange > 0 ? '+' : ''}${weekChange}% vs last week` : 'No previous data'}
            color={weekChange < 0 ? 'forest' : 'earth'}
            delay={0.2}
          />
          <StatCard
            icon="🗓️"
            label="This Month"
            value={(dashboard.monthly?.carbon || 0).toFixed(2)}
            unit="kg CO₂"
            sub="Last 30 days"
            color="sage"
            delay={0.3}
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly trend area chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-forest-100">
          <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">
            7-Day Carbon Trend
          </h3>
          {dashboard.weeklyTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dashboard.weeklyTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#718a55' }} />
                <YAxis tick={{ fontSize: 11, fill: '#718a55' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="carbon"
                  stroke="#16a34a" strokeWidth={2.5}
                  fill="url(#carbonGrad)" dot={{ fill: '#16a34a', r: 3 }}
                  activeDot={{ r: 5, fill: '#14532d' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sage-400 text-sm">
              No data yet — log your first activity!
            </div>
          )}
        </div>

        {/* Category pie chart */}
        <div className="glass-card rounded-2xl p-5 border border-forest-100">
          <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">
            By Category
          </h3>
          {dashboard.categoryData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dashboard.categoryData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={75}
                  dataKey="totalCarbon"
                  nameKey="category"
                  paddingAngle={3}
                >
                  {dashboard.categoryData.map((entry, index) => {
                    const meta = getCategoryMeta(entry.category);
                    return <Cell key={entry.category} fill={meta.color || PIE_COLORS[index % PIE_COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val} kg CO₂`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #dcfce7', fontSize: '12px' }}
                />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(val) => getCategoryMeta(val).label}
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sage-400 text-sm text-center px-4">
              Add tasks across categories to see breakdown
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Suggestions */}
        <div className="glass-card rounded-2xl p-5 border border-forest-100">
          <SuggestionsPanel suggestions={dashboard.suggestions || []} />
        </div>

        {/* Badges */}
        <div className="glass-card rounded-2xl p-5 border border-forest-100">
          <BadgeGrid earnedBadges={userData?.badges || []} />
        </div>
      </div>

      {/* Recent tasks */}
      {dashboard.recentTasks?.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-forest-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-forest-900">Recent Activities</h3>
            <Link to="/tasks" className="text-xs text-forest-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="space-y-2">
            {dashboard.recentTasks.map((task) => {
              const meta = getCategoryMeta(task.category);
              return (
                <div key={task.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-forest-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{meta.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-forest-900">{task.title}</p>
                      <p className="text-xs text-sage-500">{task.date} · {meta.label}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-semibold px-2 py-1 rounded-lg ${
                    task.carbonValue < 0 ? 'bg-forest-100 text-forest-700' : 'bg-earth-100 text-earth-700'
                  }`}>
                    {task.carbonValue < 0 ? '−' : '+'}{Math.abs(task.carbonValue).toFixed(2)} kg
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
