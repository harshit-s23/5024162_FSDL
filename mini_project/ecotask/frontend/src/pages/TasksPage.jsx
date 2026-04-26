import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TaskModal from '../components/tasks/TaskModal';
import TaskCard from '../components/tasks/TaskCard';
import { CATEGORIES, todayStr } from '../utils/constants';

export default function TasksPage() {
  const { setUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [factors, setFactors] = useState({});
  const [filter, setFilter] = useState({ category: '', date: '' });
  const [search, setSearch] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.date) params.date = filter.date;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks || []);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [filter]);

  const fetchFactors = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard/factors');
      setFactors(data.factors || {});
    } catch {}
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchFactors(); }, [fetchFactors]);

  const handleSave = async (formData, taskId) => {
    try {
      let res;
      if (taskId) {
        res = await api.put(`/tasks/${taskId}`, formData);
        toast.success('Activity updated 🌿');
      } else {
        res = await api.post('/tasks', formData);
        toast.success('Activity logged! 🌱');
      }
      if (res.data.stats) {
        setUser(prev => ({
          ...prev,
          totalEcoScore: res.data.stats.ecoScore,
          level: res.data.stats.level?.name,
          levelData: res.data.stats.level,
          streak: res.data.stats.streak,
        }));
      }
      setModalOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Deleted');
      fetchTasks();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      fetchTasks();
    } catch {}
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  // Filter by search
  const filtered = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalEmissions = filtered.reduce((s, t) => s + Math.max(0, t.carbonValue), 0);
  const totalSaved = Math.abs(filtered.reduce((s, t) => s + Math.min(0, t.carbonValue), 0));
  const netCarbon = filtered.reduce((s, t) => s + t.carbonValue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-forest-900">Activities</h2>
          <p className="text-sage-500 text-sm mt-1">Log and manage your carbon activities</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all"
        >
          + Log Activity
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Emitted', val: totalEmissions.toFixed(2), color: 'earth', icon: '📈' },
          { label: 'Saved',   val: totalSaved.toFixed(2),     color: 'forest', icon: '📉' },
          { label: 'Net',     val: netCarbon.toFixed(2),      color: netCarbon < 0 ? 'forest' : 'earth', icon: '⚖️' },
        ].map(({ label, val, color, icon }) => (
          <div key={label} className={`glass-card rounded-2xl p-4 border ${
            color === 'forest' ? 'border-forest-100' : 'border-earth-100'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{icon}</span>
              <span className="text-xs text-sage-500 uppercase tracking-wide font-medium">{label}</span>
            </div>
            <p className={`text-xl font-bold font-display ${
              color === 'forest' ? 'text-forest-700' : 'text-earth-700'
            }`}>
              {parseFloat(val) < 0 ? '−' : ''}{Math.abs(parseFloat(val)).toFixed(2)}
              <span className="text-xs font-body font-normal ml-1 text-sage-500">kg CO₂</span>
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 border border-forest-100">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="🔍 Search activities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-4 py-2 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-300"
          />
          <select
            value={filter.category}
            onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
            className="px-4 py-2 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-300"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filter.date}
            onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
            className="px-4 py-2 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-300"
          />
          {(filter.category || filter.date || search) && (
            <button
              onClick={() => { setFilter({ category: '', date: '' }); setSearch(''); }}
              className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl border border-red-100 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="text-3xl animate-float mb-2">🌿</div>
            <p className="text-sage-400 text-sm">Loading activities...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-12 text-center border border-forest-100"
        >
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="font-display text-xl text-forest-800 mb-2">No activities yet</h3>
          <p className="text-sage-500 text-sm mb-6">Start logging your daily activities to track your carbon footprint</p>
          <button
            onClick={handleAddNew}
            className="bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Log your first activity
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {filtered.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                index={i}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSave={handleSave}
        editTask={editTask}
        factors={factors}
      />
    </div>
  );
}
