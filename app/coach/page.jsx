"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { usePushup } from '../../src/context/PushupContext';
import { 
  useMotivationalBoost, 
  useWorkoutTip, 
  useAudioMotivation 
} from '../../src/hooks/useGemini';

// Dynamic import for 3D component
const AIBrain3D = dynamic(() => import('../../src/components/3d/AIBrain3D'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
    </div>
  )
});

// Typewriter Component
const Typewriter = ({ text, speed = 25 }) => {
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

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
};

// Action Card Component
const ActionCard = ({ 
  title, 
  description, 
  icon, 
  gradient, 
  glowColor, 
  onClick, 
  isLoading, 
  isActive 
}) => (
  <motion.button
    variants={cardVariants}
    whileHover={{ scale: 1.03, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={isLoading}
    className={`relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 transition-all duration-300 group overflow-hidden ${
      isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/20'
    } ${isActive ? 'ring-2 ring-offset-2 ring-offset-gray-950 ring-emerald-500/50' : ''}`}
  >
    {/* Background gradient on hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
    
    {/* Corner decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.03] to-transparent rounded-bl-full" />
    
    {/* Glow effect */}
    <div className={`absolute -inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl rounded-full ${glowColor}`} />
    
    {/* Icon container */}
    <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    
    <h3 className="relative z-10 text-white font-black text-lg mb-1">{title}</h3>
    <p className="relative z-10 text-gray-500 text-xs font-medium text-center">{description}</p>
    
    {/* Loading overlay */}
    {isLoading && (
      <div className="absolute inset-0 bg-gray-950/60 flex items-center justify-center backdrop-blur-sm rounded-2xl">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )}
    
    {/* Active indicator */}
    {isActive && (
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-emerald-400 text-[9px] font-bold uppercase">Playing</span>
      </div>
    )}
  </motion.button>
);

// Main AI Coach Page
const AICoach = () => {
  const { pushupData, TOTAL_DAYS, isLoaded } = usePushup();
  const { motivation, isLoadingMotivation, getBoost } = useMotivationalBoost();
  const { workoutTip, isLoadingTip, getTip } = useWorkoutTip();
  const { isAudioPlaying, isLoadingAudio, playAudio } = useAudioMotivation();

  const isAnyLoading = isLoadingMotivation || isLoadingTip;
  const currentMessage = motivation || workoutTip;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  const completedDays = pushupData.filter(day => day.isCompleted).length;

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
        
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-xl"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">AI-Powered Training</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">Coach</span> Console
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-4 text-gray-400 font-medium text-sm md:text-base max-w-lg mx-auto"
          >
            Your personalized AI training assistant. Access high-performance motivation and expert form corrections.
          </motion.p>
        </div>

        {/* Main Display Panel with 3D Brain */}
        <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 md:p-12 mb-10 shadow-2xl overflow-hidden min-h-[400px]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
              backgroundSize: '32px 32px' 
            }} 
          />

          {/* 3D AI Brain */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 pointer-events-none opacity-60">
            <Suspense fallback={null}>
              <AIBrain3D 
                isActive={isAnyLoading || isAudioPlaying}
                color="#8b5cf6"
                className="w-full h-full"
              />
            </Suspense>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px]">
            <AnimatePresence mode="wait">
              {isAnyLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-purple-500/20 animate-ping absolute inset-0" />
                    <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                    </span>
                    <p className="text-purple-400 font-bold text-sm uppercase tracking-widest">Synthesizing response...</p>
                  </div>
                </motion.div>
              ) : currentMessage ? (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-2xl text-center"
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">AI Response</span>
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed text-white">
                    <Typewriter text={currentMessage} />
                  </p>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: 60 }} 
                    transition={{ delay: 0.5 }}
                    className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-8 rounded-full" 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-[0.2em]">Awaiting Command</p>
                    <p className="text-gray-600 text-xs mt-2">Select an action below to get started</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audio playing indicator */}
          {isAudioPlaying && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full"
                    animate={{ height: [8, 20, 8] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <span className="text-emerald-400 font-bold text-sm">Audio Playing</span>
            </motion.div>
          )}
        </div>

        {/* Action Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <ActionCard 
            title="Motivation Boost"
            description="Get AI-powered encouragement"
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            gradient="from-purple-500 to-violet-600"
            glowColor="bg-purple-500"
            onClick={() => getBoost(completedDays, TOTAL_DAYS)}
            isLoading={isLoadingMotivation}
          />
          <ActionCard 
            title="Audio Coaching"
            description="Hear verbal motivation"
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            }
            gradient="from-emerald-500 to-green-600"
            glowColor="bg-emerald-500"
            onClick={() => playAudio(completedDays)}
            isLoading={isLoadingAudio}
            isActive={isAudioPlaying}
          />
          <ActionCard 
            title="Workout Tip"
            description="Perfect your form"
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            gradient="from-blue-500 to-cyan-600"
            glowColor="bg-blue-500"
            onClick={getTip}
            isLoading={isLoadingTip}
          />
        </motion.div>

        {/* Status Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-8 py-6 border-t border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Coach Online</p>
            </div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <span className="text-purple-400 text-sm">💪</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your Progress</p>
              <p className="text-white font-black text-sm">{completedDays} / {TOTAL_DAYS} Days</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AICoach;
