"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { usePushup } from '../../src/context/PushupContext';
import StatsDashboard from '../../src/components/StatsDashboard';

// Page transition animation variants.
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

/**
 * Analytics / Stats page with premium 3D visualizations
 */
const StatsPage = () => {
  const { pushupData, TOTAL_DAYS, isLoaded } = usePushup();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-purple-500/10 animate-ping absolute inset-0" />
          <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-purple-500/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-4 py-12 md:py-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 text-center relative">
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-xl"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Performance Dashboard</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight relative"
          >
            Your{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
                Analytics
              </span>
              {/* Underline accent */}
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 text-gray-400 font-medium text-sm md:text-base max-w-md mx-auto"
          >
            A comprehensive real-time view of your 100-Day Push-up Challenge progress with 3D visualizations.
          </motion.p>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-500 font-medium">Real-time sync</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">Last updated:</span>
              <span className="text-white font-bold">Just now</span>
            </div>
          </motion.div>
        </div>

        {/* Stats Dashboard */}
        <div className="flex justify-center">
          <StatsDashboard pushupData={pushupData} totalDays={TOTAL_DAYS} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsPage;
