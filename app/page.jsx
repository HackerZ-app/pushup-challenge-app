"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import DayFlashcard from '../src/components/DayFlashcard';
import LandingPage from '../src/components/LandingPage';
import { usePushup } from '../src/context/PushupContext';

// Page transition animation variants.
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/**
 * Main Page Entry: Conditionally renders Landing Page or Dashboard based on Auth.
 */
const Page = () => {
  const { status } = useSession();
  const { pushupData, handleDayClick, TOTAL_DAYS, isLoaded } = usePushup();
  const audioRef = React.useRef(null);

  const playCelebration = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio playback blocked:', e));
    }
  };

  // Loading state (Auth or Context)
  if (status === 'loading' || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
        </div>
        <p className="mt-4 text-purple-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          Synchronizing...
        </p>
      </div>
    );
  }

  // Unauthenticated: Show Landing Page
  if (status === 'unauthenticated') {
    return <LandingPage />;
  }

  // Authenticated: Show Dashboard
  const currentActiveDay = pushupData.find((day) => !day.isCompleted);
  const completedCount = pushupData.filter((d) => d.isCompleted).length;
  const completionPercentage = Math.round((completedCount / TOTAL_DAYS) * 100);
  const isChallengeComplete = completedCount === TOTAL_DAYS;

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen p-4 md:p-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <audio ref={audioRef} src="/success.mp3" preload="auto" />
      
      {/* Header & Global Progress Section */}
      <div className="w-full max-w-4xl p-8 bg-gray-900/60 backdrop-blur-xl text-white rounded-3xl shadow-2xl mb-12 relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="2" />
            <path d="M60 10V110M10 60H110" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
          100-DAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">CHALLENGE</span>
        </h1>

        <div className="w-full max-w-2xl mx-auto relative pt-4">
          <div className="flex items-center justify-between mb-12">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Progress</span>
            <span className="text-lg font-black text-purple-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 relative shadow-inner border border-white/5">
            <motion.div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: 'circOut' }}
            />
            
            {[25, 50, 75, 100].map((milestone) => (
              <div 
                key={milestone}
                className="absolute -top-9 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${milestone}%` }}
              >
                <span className={`text-sm transition-all duration-500 ${completionPercentage >= milestone ? 'scale-125 opacity-100' : 'opacity-20 grayscale'}`}>
                  🏆
                </span>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">{milestone}%</span>
                <div className={`w-1 h-1 rounded-full mt-1 ${completionPercentage >= milestone ? 'bg-purple-500' : 'bg-gray-700'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md flex justify-center items-center">
        <AnimatePresence mode="wait">
          {isChallengeComplete ? (
            <motion.div
              key="completed"
              initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border-2 border-emerald-500/50 flex flex-col items-center text-center space-y-6"
            >
              <div className="text-7xl">🏆</div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                YOU DID IT!<br />
                <span className="text-emerald-500 italic">100 DAYS STRONG</span>
              </h2>
              <p className="text-gray-500 font-medium">
                You've conquered the challenge. You are now in the elite tier of discipline and strength.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-xl"
              >
                Start Over?
              </motion.button>
            </motion.div>
          ) : (
            <DayFlashcard
              key={currentActiveDay?.day}
              dayData={currentActiveDay}
              onComplete={handleDayClick}
              onMilestone={playCelebration}
            />
          )}
        </AnimatePresence>
      </div>

      <p className="mt-12 mb-6 text-gray-400 text-sm font-medium animate-bounce text-center">
        Complete today to unlock the next level ↓
      </p>
    </motion.div>
  );
};

export default Page;

