"use client";

import React from 'react';
import { motion } from 'framer-motion';

// ─── Podium Card ──────────────────────────────────────────────────────────────

const PODIUM_CONFIG = {
  1: {
    label: '1st',
    medal: '🥇',
    ringColor: 'ring-yellow-400',
    glowColor: 'rgba(250,204,21,0.35)',
    badgeBg: 'from-yellow-500 to-amber-400',
    textAccent: 'text-yellow-400',
    podiumHeight: 'h-20',
    podiumBg: 'from-yellow-600/30 to-yellow-800/20',
    borderColor: 'border-yellow-500/40',
    scale: 'scale-110',
    delay: 0.2,
    yFrom: 40,
  },
  2: {
    label: '2nd',
    medal: '🥈',
    ringColor: 'ring-slate-400',
    glowColor: 'rgba(148,163,184,0.3)',
    badgeBg: 'from-slate-400 to-slate-500',
    textAccent: 'text-slate-300',
    podiumHeight: 'h-14',
    podiumBg: 'from-slate-600/30 to-slate-800/20',
    borderColor: 'border-slate-500/40',
    scale: '',
    delay: 0.3,
    yFrom: 30,
  },
  3: {
    label: '3rd',
    medal: '🥉',
    ringColor: 'ring-orange-500',
    glowColor: 'rgba(249,115,22,0.3)',
    badgeBg: 'from-orange-600 to-amber-700',
    textAccent: 'text-orange-400',
    podiumHeight: 'h-10',
    podiumBg: 'from-orange-700/30 to-orange-900/20',
    borderColor: 'border-orange-600/40',
    scale: '',
    delay: 0.4,
    yFrom: 20,
  },
};

const AvatarPlaceholder = ({ name, size = 'w-14 h-14' }) => {
  const initials = name
    ? name.slice(0, 2).toUpperCase()
    : '??';
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center font-black text-white text-sm select-none`}>
      {initials}
    </div>
  );
};

const PodiumCard = ({ user, rank }) => {
  const cfg = PODIUM_CONFIG[rank];
  if (!user) return <div className="flex-1" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: cfg.yFrom }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: cfg.delay, type: 'spring', stiffness: 200, damping: 22 }}
      className={`flex flex-col items-center flex-1 max-w-[180px] ${cfg.scale}`}
    >
      {/* Medal */}
      <span className="text-3xl mb-1 drop-shadow-lg">{cfg.medal}</span>

      {/* Avatar */}
      <div
        className={`relative ring-4 ${cfg.ringColor} rounded-full shadow-2xl`}
        style={{ boxShadow: `0 0 24px ${cfg.glowColor}` }}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <AvatarPlaceholder name={user.name} size="w-16 h-16" />
        )}
        {/* Rank badge overlay */}
        <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${cfg.badgeBg} flex items-center justify-center text-white text-[9px] font-black border-2 border-gray-950`}>
          {rank}
        </span>
      </div>

      {/* Name */}
      <p className="mt-2 text-white font-black text-sm text-center leading-tight truncate w-full px-1 max-w-[140px]">
        {user.name}
      </p>
      <p className={`text-[10px] font-bold ${cfg.textAccent} uppercase tracking-widest`}>{cfg.label} Place</p>

      {/* Stats mini-row */}
      <div className="mt-1 flex gap-2 text-[10px] font-semibold text-gray-400">
        <span>💪 {user.totalReps.toLocaleString()}</span>
        <span>🔥 {user.currentStreak}d</span>
      </div>

      {/* Podium block */}
      <div className={`mt-3 w-full ${cfg.podiumHeight} rounded-t-xl bg-gradient-to-b ${cfg.podiumBg} border ${cfg.borderColor} border-b-0 flex items-center justify-center`}>
        <span className={`text-xs font-black ${cfg.textAccent} opacity-50`}>{cfg.label}</span>
      </div>
    </motion.div>
  );
};

// ─── List Row (Rank 4+) ────────────────────────────────────────────────────────

const LeaderboardRow = ({ user, rank, isCurrentUser }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, delay: 0.05 + rank * 0.03 }}
    className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200 hover:scale-[1.01] cursor-default ${
      isCurrentUser
        ? 'bg-purple-900/30 border-purple-500/40 shadow-lg shadow-purple-500/10'
        : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'
    }`}
  >
    {/* Rank number */}
    <span className="w-7 text-center text-gray-500 font-black text-sm flex-shrink-0">
      {rank}
    </span>

    {/* Avatar */}
    <div className="flex-shrink-0">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-700"
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarPlaceholder name={user.name} size="w-9 h-9" />
      )}
    </div>

    {/* Name + you indicator */}
    <div className="flex-1 min-w-0">
      <p className="text-white font-bold text-sm truncate flex items-center gap-1.5">
        {user.name}
        {isCurrentUser && (
          <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wide">
            You
          </span>
        )}
      </p>
      <p className="text-gray-500 text-[10px]">{user.daysCompleted} days completed</p>
    </div>

    {/* Streak */}
    <div className="flex items-center gap-1 text-orange-400 font-bold text-sm flex-shrink-0">
      <span>🔥</span>
      <span>{user.currentStreak}</span>
    </div>

    {/* Total reps */}
    <div className="text-right flex-shrink-0">
      <p className="text-purple-400 font-black text-sm">{user.totalReps.toLocaleString()}</p>
      <p className="text-gray-600 text-[9px] uppercase tracking-wider">reps</p>
    </div>
  </motion.div>
);

// ─── Main Client Component ─────────────────────────────────────────────────────

const LeaderboardClient = ({ users, currentUserId }) => {
  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  // Podium order: 2nd | 1st | 3rd (classic podium layout)
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRanks = [2, 1, 3];

  return (
    <div className="w-full">
      {/* ── Top 3 Podium ── */}
      {top3.length > 0 && (
        <div className="mb-10">
          <div className="flex items-end justify-center gap-3 md:gap-6 px-4">
            {podiumOrder.map((user, i) => (
              <PodiumCard
                key={user?.id || i}
                user={user}
                rank={podiumRanks[i]}
              />
            ))}
          </div>
          {/* Podium base platform line */}
          <div className="h-1 rounded-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mt-0" />
        </div>
      )}

      {/* ── Column Headers ── */}
      {rest.length > 0 && (
        <>
          <div className="flex items-center gap-4 px-4 mb-2">
            <span className="w-7 text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center">Rank</span>
            <span className="flex-shrink-0 w-9" />
            <span className="flex-1 text-[9px] text-gray-600 font-bold uppercase tracking-widest">Athlete</span>
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Streak</span>
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-right w-12">Reps</span>
          </div>

          {/* ── Rank 4+ List ── */}
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
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-6xl opacity-20">🏆</span>
          <p className="text-gray-500 font-semibold text-sm">No athletes on the board yet.</p>
          <p className="text-gray-600 text-xs">Be the first to complete a day!</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardClient;
