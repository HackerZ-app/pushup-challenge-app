"use client";

import React, { useMemo, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import 3D component to avoid SSR issues
const Stats3DRing = dynamic(() => import('./3d/Stats3DRing'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
    </div>
  )
});

// Animation Variants
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

// Premium Stat Card Component
const StatCard = ({ icon, label, value, unit, accentClass, glowColor, delay }) => (
  <motion.div
    variants={cardVariants}
    custom={delay}
    whileHover={{ y: -4, scale: 1.02 }}
    className="relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden group transition-all duration-500"
  >
    {/* Animated gradient border */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    {/* Background glow */}
    <div className={`absolute -inset-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-3xl rounded-full ${glowColor}`} />
    
    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-br-full opacity-50" />
    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full opacity-30" />

    {/* Icon container */}
    <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${glowColor.replace('bg-', 'from-').replace('/10', '/20')} to-transparent flex items-center justify-center border border-white/10`}>
      <span className="text-2xl">{icon}</span>
    </div>

    <div className="relative z-10 text-center">
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-baseline justify-center gap-1.5">
        <motion.span 
          className={`text-4xl font-black tabular-nums ${accentClass}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: delay * 0.1 }}
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-gray-500 text-sm font-bold uppercase">{unit}</span>
        )}
      </div>
    </div>
    
    {/* Bottom accent line */}
    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-transparent ${glowColor.replace('bg-', 'via-').replace('/10', '/50')} to-transparent transition-all duration-500`} />
  </motion.div>
);

// Heatmap Cell Component
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
        transition={{ delay: day * 0.003, duration: 0.25, ease: 'backOut' }}
        whileHover={{ scale: 1.4, zIndex: 20 }}
        className={`w-3.5 h-3.5 rounded-[4px] cursor-pointer transition-all duration-300 ${
          isCompleted
            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
            : 'bg-gray-800/80 hover:bg-gray-700/80 border border-white/5'
        }`}
      />

      {/* Tooltip */}
      {showTooltip && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap pointer-events-none"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white text-[10px] font-semibold px-3 py-2 rounded-xl shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Day {day}</span>
              <span className="text-white font-black">{target} reps</span>
              <span className={`${isCompleted ? 'text-emerald-400' : 'text-gray-600'}`}>
                {isCompleted ? 'Done' : 'Pending'}
              </span>
            </div>
          </div>
          <div className="w-2 h-2 bg-gray-900/95 border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
        </motion.div>
      )}
    </div>
  );
};

// Main StatsDashboard Component
const StatsDashboard = ({ pushupData = [], totalDays = 100 }) => {
  const stats = useMemo(() => {
    if (!pushupData || pushupData.length === 0) {
      return { totalReps: 0, currentStreak: 0, daysCompleted: 0, completionRate: 0 };
    }

    const totalReps = pushupData.reduce((acc, day) => {
      return day.isCompleted ? acc + (day.target || 0) : acc;
    }, 0);

    const daysCompleted = pushupData.filter((d) => d.isCompleted).length;
    const completionRate = Math.round((daysCompleted / totalDays) * 100);

    let currentStreak = 0;
    const sorted = [...pushupData].sort((a, b) => a.day - b.day);
    for (const day of sorted) {
      if (day.isCompleted) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { totalReps, currentStreak, daysCompleted, completionRate };
  }, [pushupData, totalDays]);

  const sortedData = useMemo(
    () => [...pushupData].sort((a, b) => a.day - b.day),
    [pushupData]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      className="w-full max-w-5xl"
      aria-label="Real-Time Tracking Stats"
    >
      {/* Main container with premium glass effect */}
      <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden">
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />

        {/* Section Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-purple-500 via-fuchsia-500 to-pink-500" />
            <div>
              <h2 className="text-white font-black text-xl tracking-tight">Performance Analytics</h2>
              <p className="text-gray-500 text-xs font-medium mt-0.5">Real-time progress tracking</p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.15em]">Live Sync</span>
          </div>
        </div>

        {/* Stats Grid with 3D Ring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Left side - 3D Progress Ring */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="relative w-full max-w-[280px] aspect-square">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                </div>
              }>
                <Stats3DRing 
                  progress={stats.completionRate} 
                  color="#a855f7"
                  className="w-full h-full"
                />
              </Suspense>
              {/* Center text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.span 
                  className="text-5xl font-black text-white"
                  key={stats.completionRate}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {stats.completionRate}%
                </motion.span>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Complete</span>
              </div>
            </div>
          </div>

          {/* Right side - Stat Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <StatCard
              icon="⚡"
              label="Current Streak"
              value={stats.currentStreak}
              unit="Days"
              accentClass="text-amber-400"
              glowColor="bg-amber-500/10"
              delay={1}
            />
            <StatCard
              icon="💪"
              label="Total Reps"
              value={stats.totalReps.toLocaleString()}
              unit=""
              accentClass="text-purple-400"
              glowColor="bg-purple-500/10"
              delay={2}
            />
            <StatCard
              icon="🎯"
              label="Days Done"
              value={stats.daysCompleted}
              unit={`/${totalDays}`}
              accentClass="text-cyan-400"
              glowColor="bg-cyan-500/10"
              delay={3}
            />
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Consistency Heatmap */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-bold">100-Day Consistency Map</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest">Visual progress tracker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-[3px] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                Completed
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-[3px] bg-gray-800 border border-white/5" />
                Pending
              </span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto pb-2">
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                minWidth: '240px',
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

          {/* Progress bar summary */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">Day 1</span>
              <span className="text-gray-400 font-bold">{stats.daysCompleted} / {totalDays} days completed</span>
              <span className="text-gray-600 font-medium">Day {totalDays}</span>
            </div>
            <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StatsDashboard;
