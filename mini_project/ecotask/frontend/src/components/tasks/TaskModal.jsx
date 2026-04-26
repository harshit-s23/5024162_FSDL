import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, SUBCATEGORIES, todayStr } from '../../utils/constants';

const EMPTY = { title: '', description: '', category: 'transport', subcategory: '', quantity: 1, unit: 'km', date: todayStr(), isRecurring: false };

export default function TaskModal({ open, onClose, onSave, editTask, factors }) {
  const [form, setForm] = useState(EMPTY);
  const [previewCarbon, setPreviewCarbon] = useState(null);

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        category: editTask.category || 'transport',
        subcategory: editTask.subcategory || '',
        quantity: editTask.quantity || 1,
        unit: editTask.unit || '',
        date: editTask.date || todayStr(),
        isRecurring: editTask.isRecurring || false,
      });
    } else {
      setForm(EMPTY);
    }
  }, [editTask, open]);

  // Update unit and preview carbon when subcategory changes
  useEffect(() => {
    if (!form.category || !form.subcategory) { setPreviewCarbon(null); return; }
    const subs = SUBCATEGORIES[form.category] || [];
    const sub = subs.find(s => s.value === form.subcategory);
    if (sub) {
      setForm(f => ({ ...f, unit: sub.unit }));
      // Preview calculation
      const factorData = factors?.[form.category]?.[form.subcategory];
      if (factorData) setPreviewCarbon((factorData.factor * (form.quantity || 1)).toFixed(3));
    }
  }, [form.subcategory, form.category, form.quantity, factors]);

  const handleCategoryChange = (cat) => {
    const firstSub = (SUBCATEGORIES[cat] || [])[0];
    setForm(f => ({
      ...f,
      category: cat,
      subcategory: firstSub?.value || '',
      unit: firstSub?.unit || 'unit',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form, editTask?.id);
  };

  const subs = SUBCATEGORIES[form.category] || [];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-card rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-forest-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {editTask ? 'Edit Activity' : 'Log Activity'}
                  </h2>
                  <p className="text-forest-200 text-xs mt-0.5">Track your carbon impact</p>
                </div>
                <button onClick={onClose} className="text-forest-200 hover:text-white text-xl leading-none transition-colors">
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wide mb-1.5">Activity Title *</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder="e.g. Morning commute to work"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wide mb-1.5">Category *</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value} type="button"
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`py-2 px-1 rounded-xl text-center text-xs font-medium transition-all border ${
                        form.category === cat.value
                          ? 'bg-forest-600 text-white border-forest-600 shadow-sm'
                          : 'bg-white/60 text-sage-700 border-forest-100 hover:border-forest-300'
                      }`}
                    >
                      <div className="text-base mb-0.5">{cat.emoji}</div>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              {subs.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wide mb-1.5">Type</label>
                  <select
                    value={form.subcategory}
                    onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400"
                  >
                    <option value="">Select type...</option>
                    {subs.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wide mb-1.5">Quantity</label>
                  <input
                    type="number" min="0.01" step="0.01" required
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wide mb-1.5">Unit</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder="km, kg, kWh..."
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wide mb-1.5">Date *</label>
                <input
                  type="date" required
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wide mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white/70 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Carbon preview */}
              {previewCarbon !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    parseFloat(previewCarbon) < 0
                      ? 'bg-forest-100 text-forest-800 border border-forest-200'
                      : 'bg-earth-50 text-earth-800 border border-earth-200'
                  }`}
                >
                  <span>{parseFloat(previewCarbon) < 0 ? '🟢' : '🟡'}</span>
                  <span>
                    Estimated impact:{' '}
                    <strong className="font-mono">
                      {parseFloat(previewCarbon) < 0 ? '−' : '+'}{Math.abs(parseFloat(previewCarbon))} kg CO₂
                    </strong>
                    {parseFloat(previewCarbon) < 0 ? ' saved' : ' emitted'}
                  </span>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-forest-200 text-forest-700 text-sm font-medium hover:bg-forest-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold shadow-md transition-all"
                >
                  {editTask ? '✏️ Update' : '🌱 Log Activity'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
