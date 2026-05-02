"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePushup } from '../../src/context/PushupContext';
import { 
  useMotivationalBoost, 
  useWorkoutTip, 
  useAudioMotivation 
} from '../../src/hooks/useGemini';

// ── Typewriter Component ──────────────────────────────────────────────────────
const Typewriter = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, speed);
    
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

// ── Framer Motion Variants ────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
};

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
};

// ── Action Card Component ─────────────────────────────────────────────────────
const ActionCard = ({ title, icon, subtitle, colorClass, onClick, isLoading, isActive, pulseColor }) => (
  <motion.button
    variants={cardVariants}
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={isLoading}
    className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-800/80 backdrop-blur-md border border-gray-700 transition-all duration-300 group overflow-hidden ${
      isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/20'
    } ${isActive ? `ring-2 ${pulseColor} animate-pulse` : ''}`}
  >
    {/* Background Accent Glow */}
    <div className={`absolute -inset-2 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${colorClass}`} />
    
    <span className="text-4xl mb-3 relative z-10">{icon}</span>
    <h3 className="text-lg font-black text-white relative z-10">{title}</h3>
    <p className="text-xs text-gray-400 font-medium relative z-10">{subtitle}</p>
    
    {/* Loading Overlay */}
    {isLoading && (
      <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center backdrop-blur-[1px]">
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )}
  </motion.button>
);

/**
 * AICoach page: Dedicated page for workout tips and motivational audio/text.
 */
const AICoach = () => {
  const { pushupData, TOTAL_DAYS, isLoaded } = usePushup();

  const { motivation, isLoadingMotivation, getBoost } = useMotivationalBoost();
  const { workoutTip, isLoadingTip, getTip } = useWorkoutTip();
  const { isAudioPlaying, isLoadingAudio, playAudio } = useAudioMotivation();

  // Determine current active display state
  const isAnyLoading = isLoadingMotivation || isLoadingTip;
  const currentMessage = motivation || workoutTip;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  const completedDays = pushupData.filter(day => day.isCompleted).length;

  return (
    <motion.div
      className="min-h-screen bg-gray-950 px-4 py-10 md:py-14 text-gray-100"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* ── Header block ── */}
        <div className="w-full bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-3xl p-8 mb-10 shadow-2xl text-center relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />
          
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Coach</span> Console
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-lg mx-auto">
            Your personalised AI training assistant. Access high-performance motivation and form corrections in real-time.
          </p>
        </div>

        {/* ── The Coach Display Panel ── */}
        <div className="w-full bg-gray-900/40 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 md:p-12 mb-10 shadow-inner relative min-h-[220px] flex items-center justify-center overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <AnimatePresence mode="wait">
            {isAnyLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin" />
                <p className="text-purple-400 font-black text-sm uppercase tracking-widest animate-pulse">🧠 Synthesising response...</p>
              </motion.div>
            ) : currentMessage ? (
              <motion.div
                key="message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full text-center"
              >
                <p className="text-xl md:text-2xl font-bold leading-relaxed text-white">
                  <Typewriter text={currentMessage} />
                </p>
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: 40 }} 
                  className="h-1 bg-purple-500 mx-auto mt-6 rounded-full" 
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 opacity-30"
              >
                <span className="text-6xl grayscale">🤖</span>
                <p className="text-xs font-black uppercase tracking-[0.3em]">Awaiting Command...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── The Action Deck ── */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <ActionCard 
            title="Motivation Boost"
            icon="✨"
            subtitle="Encouraging AI feedback"
            colorClass="bg-purple-500"
            onClick={() => getBoost(completedDays, TOTAL_DAYS)}
            isLoading={isLoadingMotivation}
          />
          <ActionCard 
            title="Audio Coaching"
            icon="🔊"
            subtitle="Verbal boost from Coach"
            colorClass="bg-green-500"
            onClick={() => playAudio(completedDays)}
            isLoading={isLoadingAudio}
            isActive={isAudioPlaying}
            pulseColor="ring-green-500/50"
          />
          <ActionCard 
            title="Workout Tip"
            icon="💪"
            subtitle="Perfect your form"
            colorClass="bg-blue-500"
            onClick={getTip}
            isLoading={isLoadingTip}
          />
        </motion.div>

        {/* ── Global Context Footer ── */}
        <div className="mt-12 flex items-center justify-center gap-8 border-t border-white/5 pt-8">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-black text-white">Coach Online</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Progress</p>
            <p className="text-xs font-black text-white">{completedDays} / {TOTAL_DAYS} Days</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AICoach;
