"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * DayFlashcard component: A 3D animated card representing a single challenge day.
 * Manages its own internal state (Idle -> Active -> Done) before syncing with the parent.
 */
const DayFlashcard = ({ dayData, onComplete, onMilestone }) => {
  // Visual states: 'idle', 'active', 'syncing'
  const [cardStatus, setCardStatus] = useState('idle');

  const handleStart = () => {
    setCardStatus('active');
  };

  const handleComplete = async () => {
    // Milestone Check: Every 5 days
    if (dayData.day % 5 === 0 && onMilestone) {
      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#3B82F6']
      });

      // Trigger Parent's Audio
      onMilestone();
    }

    setCardStatus('syncing');
    // Call the parent completion handler (which syncs to DB)
    await onComplete(dayData.day);
  };

  if (!dayData) return null;

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={dayData.day}
          initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.6 
          }}
          className="w-full h-full bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center justify-between relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="z-10 text-center">
            <motion.span 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-purple-400 font-bold uppercase tracking-widest text-sm"
            >
              Push-up Challenge
            </motion.span>
            <h2 className="text-white text-6xl font-black mt-2">Day {dayData.day}</h2>
          </div>

          <div className="z-10 w-full bg-gray-800/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm text-center">
            <p className="text-gray-400 text-sm uppercase font-semibold">Today's Target</p>
            <p className="text-white text-5xl font-extrabold mt-1">{dayData.target || 0} <span className="text-2xl text-gray-500 font-normal">Reps</span></p>
          </div>

          <div className="z-10 w-full">
            {cardStatus === 'idle' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.4)] transition-all"
              >
                Start Workout
              </motion.button>
            )}

            {cardStatus === 'active' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 animate-pulse text-indigo-400 text-sm font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                  <span>Workout in Progress...</span>
                </div>
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleComplete}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
                >
                  Mark Completed ✅
                </motion.button>
              </div>
            )}

            {cardStatus === 'syncing' && (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Syncing Progress...</p>
              </div>
            )}
          </div>

          {/* Decorative Corner Element */}
          <div className="absolute top-4 right-4 opacity-20">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 2H38V40" stroke="white" strokeWidth="4"/>
            </svg>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DayFlashcard;
