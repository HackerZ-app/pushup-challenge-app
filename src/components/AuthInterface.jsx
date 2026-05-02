"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import AchievementBadge from './AchievementBadge';

import { usePushup } from '../context/PushupContext';

const LoginCard = ({ onToggle }) => (
  <motion.div
    initial={{ rotateY: -20, opacity: 0, scale: 0.9, y: -20 }}
    animate={{ rotateY: 0, opacity: 1, scale: 1, y: 0 }}
    exit={{ rotateY: 20, opacity: 0, scale: 0.9, y: -20 }}
    className="absolute top-full right-0 mt-4 bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 z-[100] w-80 overflow-hidden group cursor-default"
  >
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl group-hover:bg-purple-600/30 transition-all"></div>
    
    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
      <div className="flex justify-between w-full items-center mb-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase">Join Now</span>
        <button onClick={onToggle} className="text-gray-500 hover:text-white">✕</button>
      </div>
      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-purple-500/50">
        💪
      </div>
      <div>
        <h3 className="text-white font-black text-sm">Join the Challenge</h3>
        <p className="text-gray-400 text-[10px]">Unlock your 100-day journey.</p>
      </div>
      <button
        onClick={() => signIn('google')}
        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all active:scale-95"
      >
        Sign in with Google
      </button>
    </div>
  </motion.div>
);

const ProfileCard = ({ session, badges = [], onReset, onToggle }) => (
  <motion.div
    initial={{ rotateY: 20, opacity: 0, scale: 0.9, y: -20 }}
    animate={{ rotateY: 0, opacity: 1, scale: 1, y: 0 }}
    exit={{ rotateY: -20, opacity: 0, scale: 0.9, y: -20 }}
    className="absolute top-full right-0 mt-4 bg-gray-900 p-5 rounded-2xl shadow-2xl border border-gray-700 z-[100] w-80 overflow-hidden group cursor-default"
  >
    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/30 transition-all"></div>
    
    <div className="relative z-10 flex flex-col space-y-4">
      <div className="flex justify-between w-full items-center mb-1">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">My Profile</span>
        <button onClick={onToggle} className="text-gray-500 hover:text-white">✕</button>
      </div>
      <div className="flex items-center space-x-3">
        <img 
          src={session.user.image} 
          alt={session.user.name} 
          className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-md"
        />
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-white font-black text-xs truncate">{session.user.name}</h3>
          <p className="text-gray-500 text-[9px] truncate">{session.user.email}</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-black/30 rounded-xl p-3 border border-white/5">
        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
          <span>Achievements</span>
          <span className="text-purple-400">{badges.length}</span>
        </h4>

        {badges && badges.length > 0 ? (
          /* Scrollable horizontal badge strip */
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {badges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                className="flex-shrink-0"
              >
                <AchievementBadge badgeName={badge} size="sm" showTooltip={true} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3 gap-1">
            <span className="text-2xl opacity-30">🏅</span>
            <span className="text-[8px] text-gray-600 italic">Complete 5 days to unlock your first badge!</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onReset}
          className="flex-1 py-1.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all"
        >
          Reset Progress
        </button>
        <button
          onClick={() => signOut()}
          className="px-3 py-1.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded-lg hover:bg-gray-700 hover:text-white transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  </motion.div>
);

const AuthInterface = () => {
  const { data: session, status } = useSession();
  const { badges, resetProgress } = usePushup();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="perspective-1000 relative z-[100]">
      {/* Small Trigger Button */}
      {status === 'authenticated' && session?.user?.image ? (
        <button onClick={toggleOpen} className="relative group">
          <img 
            src={session.user.image} 
            alt="Profile" 
            className="w-9 h-9 rounded-full border-2 border-purple-500 shadow-lg group-hover:border-white transition-all"
          />
          {badges.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-900">
              {badges.length}
            </span>
          )}
        </button>
      ) : (
        <button 
          onClick={toggleOpen}
          className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 hover:border-purple-500 transition-all text-sm"
        >
          👤
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close on click outside */}
            <div className="fixed inset-0 z-[-1]" onClick={toggleOpen} />
            
            {status === 'loading' ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-full right-0 mt-4 w-48 h-20 bg-gray-800/50 animate-pulse rounded-2xl"
              />
            ) : session ? (
              <ProfileCard 
                key="profile" 
                session={session} 
                badges={badges} 
                onReset={resetProgress}
                onToggle={toggleOpen}
              />
            ) : (
              <LoginCard key="login" onToggle={toggleOpen} />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthInterface;
