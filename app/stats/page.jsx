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
 * Analytics / Stats page — dedicated route at /stats.
 * Renders the full StatsDashboard component in an isolated, focused layout.
 */
const StatsPage = () => {
  const { pushupData, TOTAL_DAYS, isLoaded } = usePushup();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-4 py-10 md:py-14"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Analytics
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-gray-400 font-medium text-sm md:text-base"
          >
            A real-time view of your 100-Day Push-up Challenge progress.
          </motion.p>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard pushupData={pushupData} totalDays={TOTAL_DAYS} />
      </div>
    </motion.div>
  );
};

export default StatsPage;
