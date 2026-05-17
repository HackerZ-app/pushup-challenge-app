"use client";

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import 3D component
const Podium3D = dynamic(() => import('./3d/Podium3D'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
    </div>
  )
});

// Podium configuration
const PODIUM_CONFIG = {
  1: {
    label: '1st',
    medal: 'gold',
    ringColor: 'ring-yellow-400',
    glowColor: 'rgba(250,204,21,0.4)',
    badgeBg: 'from-yellow-400 via-yellow-500 to-amber-500',
    textAccent: 'text-yellow-400',
    bgGradient: 'from-yellow-500/10 via-yellow-600/5 to-transparent',
    borderColor: 'border-yellow-500/30',
    scale: 'scale-110',
    delay: 0.2,
  },
  2: {
    label: '2nd',
    medal: 'silver',
    ringColor: 'ring-slate-300',
    glowColor: 'rgba(148,163,184,0.35)',
    badgeBg: 'from-slate-300 via-slate-400 to-slate-500',
    textAccent: 'text-slate-300',
    bgGradient: 'from-slate-400/10 via-slate-500/5 to-transparent',
    borderColor: 'border-slate-400/30',
    scale: '',
    delay: 0.3,
  },
  3: {
    label: '3rd',
    medal: 'bronze',
    ringColor: 'ring-orange-400',
    glowColor: 'rgba(249,115,22,0.35)',
    badgeBg: 'from-orange-500 via-orange-600 to-amber-700',
    textAccent: 'text-orange-400',
    bgGradient: 'from-orange-500/10 via-orange-600/5 to-transparent',
    borderColor: 'border-orange-500/30',
    scale: '',
    delay: 0.4,
  },
};

const AvatarPlaceholder = ({ name, size = 'w-16 h-16', textSize = 'text-xl' }) => {
  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 flex items-center justify-center font-black text-white ${textSize} select-none shadow-xl`}>
      {initials}
    </div>
  );
};

// Premium Podium Card
const PodiumCard = ({ user, rank }) => {
  const cfg = PODIUM_CONFIG[rank];
  if (!user) return <div className="flex-1" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: cfg.delay, type: 'spring', stiffness: 200, damping: 22 }}
      className={`flex flex-col items-center flex-1 max-w-[200px] ${cfg.scale}`}
    >
      {/* Medal icon */}
      <motion.div 
        className="text-4xl mb-3 drop-shadow-2xl"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
      </motion.div>

      {/* Avatar with premium glow */}
      <div className="relative mb-4">
        <div
          className={`absolute -inset-2 rounded-full blur-xl opacity-60 bg-gradient-to-br ${cfg.badgeBg}`}
          style={{ boxShadow: `0 0 40px ${cfg.glowColor}` }}
        />
        <div className={`relative ring-4 ${cfg.ringColor} rounded-full shadow-2xl overflow-hidden`}>
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarPlaceholder name={user.name} size="w-20 h-20" textSize="text-2xl" />
          )}
        </div>
        {/* Rank badge */}
        <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br ${cfg.badgeBg} flex items-center justify-center text-gray-900 text-xs font-black border-2 border-gray-950 shadow-lg`}>
          {rank}
        </div>
      </div>

      {/* Name */}
      <p className="text-white font-black text-base text-center leading-tight truncate w-full px-2 max-w-[180px]">
        {user.name}
      </p>
      <p className={`text-[10px] font-bold ${cfg.textAccent} uppercase tracking-[0.2em] mt-1`}>
        {cfg.label} Place
      </p>

      {/* Stats */}
      <div className="mt-3 flex gap-4 text-[11px] font-bold">
        <div className="flex items-center gap-1.5 text-purple-400">
          <span>💪</span>
          <span>{user.totalReps.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-orange-400">
          <span>🔥</span>
          <span>{user.currentStreak}d</span>
        </div>
      </div>

      {/* Podium visual */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: rank === 1 ? 80 : rank === 2 ? 56 : 40 }}
        transition={{ duration: 0.8, delay: cfg.delay + 0.2, ease: 'easeOut' }}
        className={`mt-4 w-full rounded-t-2xl bg-gradient-to-b ${cfg.bgGradient} border-t border-l border-r ${cfg.borderColor} backdrop-blur-sm flex items-center justify-center overflow-hidden`}
      >
        <span className={`text-xs font-black ${cfg.textAccent} opacity-40 uppercase tracking-widest`}>
          {cfg.label}
        </span>
      </motion.div>
    </motion.div>
  );
};

// Premium List Row
const LeaderboardRow = ({ user, rank, isCurrentUser }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.05 + rank * 0.02 }}
    whileHover={{ scale: 1.01, x: 4 }}
    className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 cursor-default ${
      isCurrentUser
        ? 'bg-gradient-to-r from-purple-900/40 to-violet-900/20 border-purple-500/30 shadow-lg shadow-purple-500/10'
        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
    }`}
  >
    {/* Rank */}
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center flex-shrink-0">
      <span className="text-gray-400 font-black text-sm">{rank}</span>
    </div>

    {/* Avatar */}
    <div className="relative flex-shrink-0">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10"
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarPlaceholder name={user.name} size="w-11 h-11" textSize="text-sm" />
      )}
      {isCurrentUser && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-gray-950 flex items-center justify-center">
          <span className="text-[8px]">✓</span>
        </div>
      )}
    </div>

    {/* Name & meta */}
    <div className="flex-1 min-w-0">
      <p className="text-white font-bold text-sm truncate flex items-center gap-2">
        {user.name}
        {isCurrentUser && (
          <span className="text-[9px] bg-gradient-to-r from-purple-600 to-violet-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
            You
          </span>
        )}
      </p>
      <p className="text-gray-500 text-[11px] font-medium">{user.daysCompleted} days completed</p>
    </div>

    {/* Streak */}
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
      <span className="text-orange-400 text-sm">🔥</span>
      <span className="text-orange-400 font-bold text-sm">{user.currentStreak}</span>
    </div>

    {/* Total reps */}
    <div className="text-right flex-shrink-0 min-w-[80px]">
      <p className="text-purple-400 font-black text-lg">{user.totalReps.toLocaleString()}</p>
      <p className="text-gray-600 text-[9px] uppercase tracking-wider font-bold">reps</p>
    </div>
  </motion.div>
);

// Main Component
const LeaderboardClient = ({ users, currentUserId }) => {
  const top3 = users.slice(0, 3);
  const rest = users.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRanks = [2, 1, 3];

  return (
    <div className="w-full">
      {/* 3D Podium Scene */}
      {top3.length > 0 && (
        <div className="mb-8">
          {/* 3D Visualization */}
          <div className="h-48 mb-6 relative">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
              </div>
            }>
              <Podium3D className="w-full h-full" />
            </Suspense>
            {/* Gradient overlay for blending */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
          </div>

          {/* Winner Cards */}
          <div className="flex items-end justify-center gap-4 md:gap-8 px-4">
            {podiumOrder.map((user, i) => (
              <PodiumCard
                key={user?.id || i}
                user={user}
                rank={podiumRanks[i]}
              />
            ))}
          </div>
          
          {/* Podium base line */}
          <div className="h-1 rounded-full bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mt-0" />
        </div>
      )}

      {/* Column Headers */}
      {rest.length > 0 && (
        <>
          <div className="flex items-center gap-4 px-5 mb-3 mt-8">
            <span className="w-10 text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center">Rank</span>
            <span className="w-11 flex-shrink-0" />
            <span className="flex-1 text-[9px] text-gray-600 font-bold uppercase tracking-widest">Athlete</span>
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Streak</span>
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-right min-w-[80px]">Total Reps</span>
          </div>

          {/* Remaining athletes */}
          <div className="flex flex-col gap-2">
            {rest.map((user, i) => (
              <LeaderboardRow
                key={user.id}
                user={user}
                rank={i + 4}
                isCurrentUser={user.id === currentUserId}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {users.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-5xl opacity-30">🏆</span>
          </div>
          <p className="text-gray-400 font-bold text-lg">No athletes on the board yet</p>
          <p className="text-gray-600 text-sm">Be the first to complete a day and claim your spot!</p>
        </motion.div>
      )}
    </div>
  );
};

export default LeaderboardClient;
