"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import AchievementBadge from './AchievementBadge';
import { usePushup } from '../context/PushupContext';

const LoginCard = ({ onToggle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: -10 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="absolute top-full right-0 mt-3 bg-gray-900/95 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/10 z-[100] w-80 overflow-hidden"
  >
    {/* Background decoration */}
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-full blur-3xl" />
    
    <div className="relative z-10 flex flex-col items-center text-center space-y-5">
      <div className="flex justify-between w-full items-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Get Started</span>
        <button onClick={onToggle} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white flex items-center justify-center transition-all">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-white font-black text-lg">Join the Challenge</h3>
        <p className="text-gray-500 text-xs mt-1">Unlock your 100-day fitness journey</p>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => signIn('google')}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-black rounded-xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </motion.button>
    </div>
  </motion.div>
);

const ProfileCard = ({ session, badges = [], onReset, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: -10 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="absolute top-full right-0 mt-3 bg-gray-900/95 backdrop-blur-2xl p-5 rounded-2xl shadow-2xl border border-white/10 z-[100] w-80 overflow-hidden"
  >
    {/* Background decoration */}
    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full blur-3xl" />
    
    <div className="relative z-10 flex flex-col space-y-4">
      <div className="flex justify-between w-full items-center">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">My Profile</span>
        <button onClick={onToggle} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white flex items-center justify-center transition-all">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="relative">
          <img 
            src={session.user.image} 
            alt={session.user.name} 
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-gray-900" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-white font-black text-sm truncate">{session.user.name}</h3>
          <p className="text-gray-500 text-[10px] truncate">{session.user.email}</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
        <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 flex justify-between">
          <span>Achievements</span>
          <span className="text-purple-400 font-black">{badges.length}</span>
        </h4>

        {badges && badges.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {badges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                className="flex-shrink-0"
              >
                <AchievementBadge badgeName={badge} size="sm" showTooltip={true} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <span className="text-3xl opacity-20">🏅</span>
            <span className="text-[10px] text-gray-600 text-center">Complete 5 days to unlock your first badge!</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex-1 py-2.5 bg-white/5 text-gray-400 text-[10px] font-bold rounded-xl hover:bg-red-500/20 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all"
        >
          Reset Progress
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => signOut()}
          className="px-4 py-2.5 bg-white/5 text-gray-400 text-[10px] font-bold rounded-xl hover:bg-white/10 hover:text-white border border-white/5 transition-all"
        >
          Sign Out
        </motion.button>
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
    <div className="relative z-[100]">
      {/* Trigger Button */}
      {status === 'authenticated' && session?.user?.image ? (
        <motion.button 
          onClick={toggleOpen} 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <img 
            src={session.user.image} 
            alt="Profile" 
            className="relative w-10 h-10 rounded-full ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all object-cover"
            referrerPolicy="no-referrer"
          />
          {badges.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-950 shadow-lg">
              {badges.length}
            </span>
          )}
        </motion.button>
      ) : (
        <motion.button 
          onClick={toggleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1]" 
              onClick={toggleOpen} 
            />
            
            {status === 'loading' ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-full right-0 mt-3 w-80 h-24 bg-gray-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10"
              >
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </motion.div>
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
