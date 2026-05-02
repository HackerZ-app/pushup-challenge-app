"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, unit, accentClass, glowColor, delay }) => (
  <motion.div
    variants={cardVariants}
    custom={delay}
    className="relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-white/20 transition-all duration-300"
  >
    {/* Background glow blob */}
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-2xl ${glowColor}`}
    />

    {/* Decorative corner */}
    <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="64" cy="0" r="48" stroke="white" strokeWidth="2" />
      </svg>
    </div>

    <span className="relative z-10 text-2xl">{icon}</span>

    <div className="relative z-10 text-center">
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-3xl font-black tabular-nums ${accentClass}`}>
          {value}
        </span>
        {unit && (
          <span className="text-gray-500 text-sm font-semibold">{unit}</span>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── Heatmap Cell ─────────────────────────────────────────────────────────────

const HeatmapCell = ({ day, isCompleted, target }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: day * 0.004, duration: 0.25, ease: 'backOut' }}
        whileHover={{ scale: 1.3, zIndex: 10 }}
        className={`w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 ${
          isCompleted
            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
            : 'bg-gray-800 hover:bg-gray-700'
        }`}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap pointer-events-none">
          <div className="bg-gray-900 border border-gray-700 text-white text-[10px] font-semibold px-2 py-1 rounded-lg shadow-xl">
            Day {day} · {target} reps
            <span className={`ml-1 ${isCompleted ? 'text-emerald-400' : 'text-gray-500'}`}>
              {isCompleted ? '✓' : '○'}
            </span>
          </div>
          {/* Tooltip arrow */}
          <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
};

// ─── Main StatsDashboard Component ────────────────────────────────────────────

const StatsDashboard = ({ pushupData = [], totalDays = 100 }) => {
  // ── Data Calculations (memoized so they re-compute on every pushupData change) ──

  const stats = useMemo(() => {
    if (!pushupData || pushupData.length === 0) {
      return { totalReps: 0, currentStreak: 0, daysCompleted: 0, completionRate: 0 };
    }

    // Total Push-ups: Sum targets of all completed days
    const totalReps = pushupData.reduce((acc, day) => {
      return day.isCompleted ? acc + (day.target || 0) : acc;
    }, 0);

    // Days Completed
    const daysCompleted = pushupData.filter((d) => d.isCompleted).length;

    // Completion Rate (%)
    const completionRate = Math.round((daysCompleted / totalDays) * 100);

    // Current Streak: consecutive completed days starting from the most recent back.
    // We look at days in order (day 1→100). The streak is consecutive completed from
    // the start up to the first incomplete day (since this is a sequential challenge).
    let currentStreak = 0;
    const sorted = [...pushupData].sort((a, b) => a.day - b.day);
    for (const day of sorted) {
      if (day.isCompleted) {
        currentStreak++;
      } else {
        break; // First gap breaks the streak
      }
    }

    return { totalReps, currentStreak, daysCompleted, completionRate };
  }, [pushupData, totalDays]);

  // Sort data for heatmap rendering
  const sortedData = useMemo(
    () => [...pushupData].sort((a, b) => a.day - b.day),
    [pushupData]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      className="w-full max-w-4xl mt-8"
      aria-label="Real-Time Tracking Stats"
    >
      {/* Glass container */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/60 rounded-3xl p-6 md:p-8 shadow-2xl">

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
          <h2 className="text-white font-black text-base uppercase tracking-widest">
            Real-Time Tracking
          </h2>
          {/* Live pulse indicator */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Live</span>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <StatCard
            icon="⚡"
            label="Current Streak"
            value={stats.currentStreak}
            unit="Days"
            accentClass="text-amber-400"
            glowColor="bg-amber-500/10"
          />
          <StatCard
            icon="💪"
            label="Total Reps"
            value={stats.totalReps.toLocaleString()}
            unit="Reps"
            accentClass="text-purple-400"
            glowColor="bg-purple-500/10"
          />
          <StatCard
            icon="🎯"
            label="Completion Rate"
            value={stats.completionRate}
            unit="%"
            accentClass="text-cyan-400"
            glowColor="bg-cyan-500/10"
          />
        </motion.div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6" />

        {/* ── Consistency Heatmap ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
              100-Day Consistency Map
            </p>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.5)] inline-block" />
                Done
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gray-800 inline-block" />
                Pending
              </span>
            </div>
          </div>

          {/* Responsive heatmap grid: scrollable on very small screens */}
          <div className="overflow-x-auto pb-1">
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                minWidth: '220px',
              }}
            >
              {sortedData.map((dayItem) => (
                <HeatmapCell
                  key={dayItem.day}
                  day={dayItem.day}
                  isCompleted={dayItem.isCompleted}
                  target={dayItem.target || 0}
                />
              ))}
            </div>
          </div>

          {/* Mini progress summary under heatmap */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-600 text-[10px] font-medium">Day 1</span>
            <span className="text-gray-500 text-[10px] font-bold">
              {stats.daysCompleted} / {totalDays} completed
            </span>
            <span className="text-gray-600 text-[10px] font-medium">Day {totalDays}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StatsDashboard;
