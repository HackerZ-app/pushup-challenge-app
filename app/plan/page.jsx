"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDynamicPlan } from '../../src/hooks/useGemini';

// ── Day accent colours cycling through 7 distinct hues ──────────────────────
const DAY_ACCENTS = [
  { border: 'border-purple-500/50', glow: 'shadow-purple-500/20', badge: 'bg-purple-500/20 text-purple-300', icon: '💜' },
  { border: 'border-blue-500/50',   glow: 'shadow-blue-500/20',   badge: 'bg-blue-500/20 text-blue-300',   icon: '💙' },
  { border: 'border-cyan-500/50',   glow: 'shadow-cyan-500/20',   badge: 'bg-cyan-500/20 text-cyan-300',   icon: '🩵' },
  { border: 'border-emerald-500/50',glow: 'shadow-emerald-500/20',badge: 'bg-emerald-500/20 text-emerald-300', icon: '💚' },
  { border: 'border-yellow-500/50', glow: 'shadow-yellow-500/20', badge: 'bg-yellow-500/20 text-yellow-300', icon: '💛' },
  { border: 'border-orange-500/50', glow: 'shadow-orange-500/20', badge: 'bg-orange-500/20 text-orange-300', icon: '🧡' },
  { border: 'border-pink-500/50',   glow: 'shadow-pink-500/20',   badge: 'bg-pink-500/20 text-pink-300',   icon: '🩷' },
];

// ── Loading phrases that cycle while waiting ─────────────────────────────────
const LOADING_PHRASES = [
  '🧠 Analysing your training history...',
  '⚡ Calibrating optimal rep targets...',
  '🎯 Designing your personalised plan...',
  '💡 Adding expert coaching cues...',
  '🚀 Finalising your 7-day schedule...',
];

// ── Framer Motion variants ────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
};

const cardListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

// ── Loading Indicator ─────────────────────────────────────────────────────────
const PlanLoadingState = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % LOADING_PHRASES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-6"
    >
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute w-20 h-20 rounded-full border-2 border-purple-500/30 animate-ping" />
        <div className="absolute w-14 h-14 rounded-full border-2 border-purple-500/50 animate-ping [animation-delay:0.3s]" />
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
          <span className="text-white text-lg">🧠</span>
        </div>
      </div>

      {/* Cycling phrases */}
      <div className="h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="text-gray-400 font-semibold text-sm text-center"
          >
            {LOADING_PHRASES[phraseIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Skeleton cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-800/60 rounded-2xl p-5 border border-gray-700/50 h-44"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="h-3 w-16 bg-gray-700 rounded-full mb-3" />
            <div className="h-5 w-28 bg-gray-700 rounded-full mb-4" />
            <div className="h-10 w-10 bg-gray-700 rounded-full mb-4" />
            <div className="h-3 w-full bg-gray-700/70 rounded-full mb-2" />
            <div className="h-3 w-3/4 bg-gray-700/50 rounded-full" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Day Card ──────────────────────────────────────────────────────────────────
const DayCard = ({ item, index }) => {
  const accent = DAY_ACCENTS[(index) % DAY_ACCENTS.length];

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative bg-gray-800/70 backdrop-blur-sm rounded-2xl p-5 border ${accent.border} shadow-lg ${accent.glow} flex flex-col gap-4 overflow-hidden group cursor-default`}
    >
      {/* Subtle background gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl pointer-events-none" />

      {/* Day badge */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${accent.badge}`}>
          Day {item.day}
        </span>
        <span className="text-lg">{accent.icon}</span>
      </div>

      {/* Focus */}
      <div>
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">🎯 Focus</p>
        <h3 className="text-white font-black text-base leading-tight">{item.focus}</h3>
      </div>

      {/* Reps pill */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-white tabular-nums">{item.reps}</span>
        <span className="text-gray-500 text-sm font-semibold">reps</span>
      </div>

      {/* Tip */}
      <div className="mt-auto pt-3 border-t border-white/5">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">💡 Coach's Tip</p>
        <p className="text-gray-300 text-xs font-medium leading-relaxed">{item.tip}</p>
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const DynamicPlan = () => {
  const { dynamicPlan, isLoadingPlan, planError, getPlan } = useDynamicPlan();

  const totalReps = dynamicPlan?.reduce((s, d) => s + (d.reps || 0), 0) ?? 0;

  return (
    <motion.div
      className="min-h-screen bg-gray-100 px-4 py-10 md:py-14"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4"
          >
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Powered by Gemini AI</span>
            <span className="text-purple-400 text-xs">✨</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
          >
            7-Day{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Dynamic Plan
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-2 text-gray-500 font-medium text-sm md:text-base max-w-md mx-auto"
          >
            Generate a personalised AI-powered push-up plan tailored for your next week.
          </motion.p>
        </div>

        {/* ── Glass Container ── */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/60 rounded-3xl p-6 md:p-8 shadow-2xl">

          {/* ── Generate Button ── */}
          <motion.button
            onClick={getPlan}
            disabled={isLoadingPlan}
            whileHover={isLoadingPlan ? {} : { scale: 1.02 }}
            whileTap={isLoadingPlan ? {} : { scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base text-white transition-all duration-300 relative overflow-hidden
              ${isLoadingPlan
                ? 'bg-gray-700 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
              }`}
          >
            {/* Shimmer effect when not loading */}
            {!isLoadingPlan && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            )}
            <span className="relative z-10">
              {isLoadingPlan ? '⏳ Generating Your Plan...' : '✨ Generate New 7-Day Plan'}
            </span>
          </motion.button>

          {/* ── Stats bar (shown when plan is ready) ── */}
          {dynamicPlan && !isLoadingPlan && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mt-5 mb-6 px-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Week Total:</span>
                <span className="text-purple-400 font-black text-sm">{totalReps} reps</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Avg / Day:</span>
                <span className="text-purple-400 font-black text-sm">{Math.round(totalReps / 7)} reps</span>
              </div>
            </motion.div>
          )}

          {/* ── Loading / Error / Plan ── */}
          <div className="mt-6">
            <AnimatePresence mode="wait">

              {/* Loading */}
              {isLoadingPlan && <PlanLoadingState key="loading" />}

              {/* Error */}
              {!isLoadingPlan && planError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-14 gap-3 text-center"
                >
                  <span className="text-5xl">⚠️</span>
                  <p className="text-red-400 font-bold text-sm max-w-sm">{planError}</p>
                  <button
                    onClick={getPlan}
                    className="mt-2 px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-xl border border-gray-700 transition-all"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {/* Empty state */}
              {!isLoadingPlan && !planError && !dynamicPlan && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 gap-3 text-center"
                >
                  <span className="text-6xl opacity-20">📅</span>
                  <p className="text-gray-500 font-semibold text-sm">Hit the button above to generate your plan.</p>
                  <p className="text-gray-600 text-xs">Gemini AI will design a progressive 7-day workout tailored for you.</p>
                </motion.div>
              )}

              {/* Card Deck */}
              {!isLoadingPlan && !planError && dynamicPlan && (
                <motion.div
                  key="plan"
                  variants={cardListVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {dynamicPlan.map((item, index) => (
                    <DayCard key={item.day} item={item} index={index} />
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-xs mt-6 font-medium">
          Plans are AI-generated · Results may vary · Always warm up before training
        </p>
      </div>
    </motion.div>
  );
};

export default DynamicPlan;
