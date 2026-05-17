"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useDynamicPlan } from '../../src/hooks/useGemini';

// Dynamic import for 3D component
const FloatingOrb = dynamic(() => import('../../src/components/3d/FloatingOrb'), { 
  ssr: false,
  loading: () => null
});

// Day accent configurations
const DAY_ACCENTS = [
  { gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20', border: 'border-violet-500/30', text: 'text-violet-400', bg: 'bg-violet-500/10' },
  { gradient: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  { gradient: 'from-cyan-500 to-teal-600', glow: 'shadow-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { gradient: 'from-yellow-500 to-amber-600', glow: 'shadow-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { gradient: 'from-orange-500 to-red-600', glow: 'shadow-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  { gradient: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/20', border: 'border-pink-500/30', text: 'text-pink-400', bg: 'bg-pink-500/10' },
];

// Loading phrases
const LOADING_PHRASES = [
  'Analyzing your training patterns...',
  'Calibrating optimal rep targets...',
  'Designing your personalized plan...',
  'Adding expert coaching cues...',
  'Finalizing your 7-day schedule...',
];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const cardListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

// Loading State Component
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
      className="flex flex-col items-center justify-center py-20 gap-8"
    >
      {/* Animated loader */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
        <div className="absolute inset-4 rounded-full border-2 border-purple-500/30 animate-ping [animation-delay:0.2s]" />
        <div className="absolute inset-8 rounded-full border-2 border-purple-500/40 animate-ping [animation-delay:0.4s]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cycling phrases */}
      <div className="h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
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
            className="animate-pulse bg-white/[0.02] rounded-2xl p-6 border border-white/5 h-52"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="h-3 w-16 bg-white/10 rounded-full mb-4" />
            <div className="h-5 w-28 bg-white/10 rounded-full mb-6" />
            <div className="h-12 w-12 bg-white/10 rounded-full mb-6" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/5 rounded-full" />
              <div className="h-3 w-3/4 bg-white/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// 3D Hover Day Card
const DayCard = ({ item, index }) => {
  const accent = DAY_ACCENTS[index % DAY_ACCENTS.length];
  
  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      whileHover={{ z: 30 }}
      className="relative cursor-default group"
    >
      {/* Card body */}
      <div className={`relative bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border ${accent.border} shadow-xl ${accent.glow} overflow-hidden transition-all duration-300`}>
        {/* Background gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.03] to-transparent rounded-bl-full" />

        {/* Day badge */}
        <div className="flex items-center justify-between mb-4" style={{ transform: "translateZ(20px)" }}>
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${accent.bg} ${accent.text} border ${accent.border}`}>
            Day {item.day}
          </span>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${accent.gradient}`} />
        </div>

        {/* Focus */}
        <div className="mb-4" style={{ transform: "translateZ(15px)" }}>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Focus Area</p>
          <h3 className="text-white font-black text-lg leading-tight">{item.focus}</h3>
        </div>

        {/* Reps counter */}
        <div className="flex items-baseline gap-2 mb-5" style={{ transform: "translateZ(25px)" }}>
          <span className={`text-4xl font-black ${accent.text} tabular-nums`}>{item.reps}</span>
          <span className="text-gray-500 text-sm font-bold">reps</span>
        </div>

        {/* Tip section */}
        <div className="pt-4 border-t border-white/5" style={{ transform: "translateZ(10px)" }}>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Coach Tip
          </p>
          <p className="text-gray-400 text-xs font-medium leading-relaxed">{item.tip}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Plan Page
const DynamicPlan = () => {
  const { dynamicPlan, isLoadingPlan, planError, getPlan } = useDynamicPlan();
  const totalReps = dynamicPlan?.reduce((s, d) => s + (d.reps || 0), 0) ?? 0;

  return (
    <motion.div
      className="min-h-screen px-4 py-12 md:py-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-12 relative">
          {/* Background orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-30">
            <Suspense fallback={null}>
              <FloatingOrb 
                color="#8b5cf6" 
                secondaryColor="#ec4899"
                distort={0.3}
                speed={1.5}
                scale={1.5}
                className="w-full h-full"
              />
            </Suspense>
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-xl"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Powered by Gemini AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight relative"
          >
            7-Day{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
              Dynamic Plan
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-4 text-gray-400 font-medium text-sm md:text-base max-w-lg mx-auto"
          >
            Generate a personalized AI-powered push-up plan tailored for your training goals
          </motion.p>
        </div>

        {/* Main Content Container */}
        <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
              backgroundSize: '40px 40px' 
            }} 
          />

          {/* Generate Button */}
          <motion.button
            onClick={getPlan}
            disabled={isLoadingPlan}
            whileHover={isLoadingPlan ? {} : { scale: 1.02, y: -2 }}
            whileTap={isLoadingPlan ? {} : { scale: 0.98 }}
            className={`relative w-full py-5 px-8 rounded-2xl font-black text-lg text-white transition-all duration-300 overflow-hidden group
              ${isLoadingPlan
                ? 'bg-gray-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40'
              }`}
          >
            {/* Shimmer effect */}
            {!isLoadingPlan && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoadingPlan ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Generate New 7-Day Plan
                </>
              )}
            </span>
          </motion.button>

          {/* Stats bar */}
          {dynamicPlan && !isLoadingPlan && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-8 mt-8 mb-6 px-6 py-4 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400">💪</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Week Total</p>
                  <p className="text-purple-400 font-black text-lg">{totalReps} reps</p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400">📊</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Daily Avg</p>
                  <p className="text-cyan-400 font-black text-lg">{Math.round(totalReps / 7)} reps</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Content Area */}
          <div className="mt-8">
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
                  className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-400 font-bold text-sm max-w-sm">{planError}</p>
                  <button
                    onClick={getPlan}
                    className="mt-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl border border-white/10 transition-all"
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
                  className="flex flex-col items-center justify-center py-20 gap-4 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5 flex items-center justify-center">
                    <span className="text-5xl opacity-40">📅</span>
                  </div>
                  <p className="text-gray-400 font-bold text-lg">Ready to generate your plan?</p>
                  <p className="text-gray-600 text-sm max-w-sm">Press the button above and Gemini AI will design a progressive 7-day workout tailored for you.</p>
                </motion.div>
              )}

              {/* Plan Cards */}
              {!isLoadingPlan && !planError && dynamicPlan && (
                <motion.div
                  key="plan"
                  variants={cardListVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  style={{ perspective: "1000px" }}
                >
                  {dynamicPlan.map((item, index) => (
                    <DayCard key={item.day} item={item} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8 font-medium">
          Plans are AI-generated | Results may vary | Always warm up before training
        </p>
      </div>
    </motion.div>
  );
};

export default DynamicPlan;
