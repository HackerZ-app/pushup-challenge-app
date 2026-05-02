"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Badge visual definitions keyed by the badge name string from the DB.
 * Each tier has a distinct color palette, shape accent, and icon.
 */
const BADGE_DEFINITIONS = {
  // ── Tier 1: Bronze (Days 5–20) ─────────────────────────────
  'Beginner': {
    icon: '🌱',
    tier: 'Bronze',
    day: 5,
    outerRing: '#92400e',
    innerRing: '#b45309',
    bg: 'from-amber-900 to-amber-700',
    glow: 'rgba(180,83,9,0.6)',
    label: 'Day 5',
  },
  'Starter': {
    icon: '⚡',
    tier: 'Bronze',
    day: 10,
    outerRing: '#92400e',
    innerRing: '#b45309',
    bg: 'from-amber-800 to-yellow-600',
    glow: 'rgba(180,83,9,0.6)',
    label: 'Day 10',
  },
  'Momentum Builder': {
    icon: '🔥',
    tier: 'Bronze',
    day: 15,
    outerRing: '#92400e',
    innerRing: '#c2410c',
    bg: 'from-orange-800 to-amber-600',
    glow: 'rgba(194,65,12,0.6)',
    label: 'Day 15',
  },
  'Achiever': {
    icon: '💥',
    tier: 'Bronze',
    day: 20,
    outerRing: '#78350f',
    innerRing: '#d97706',
    bg: 'from-yellow-700 to-amber-500',
    glow: 'rgba(217,119,6,0.6)',
    label: 'Day 20',
  },

  // ── Tier 2: Silver (Days 25–45) ────────────────────────────
  'Fitness Enthusiast': {
    icon: '💪',
    tier: 'Silver',
    day: 25,
    outerRing: '#475569',
    innerRing: '#94a3b8',
    bg: 'from-slate-600 to-slate-400',
    glow: 'rgba(148,163,184,0.6)',
    label: 'Day 25',
  },
  'Warrior': {
    icon: '⚔️',
    tier: 'Silver',
    day: 30,
    outerRing: '#334155',
    innerRing: '#cbd5e1',
    bg: 'from-slate-700 to-slate-500',
    glow: 'rgba(203,213,225,0.5)',
    label: 'Day 30',
  },
  'Power House': {
    icon: '🏋️',
    tier: 'Silver',
    day: 35,
    outerRing: '#1e3a5f',
    innerRing: '#60a5fa',
    bg: 'from-blue-800 to-slate-600',
    glow: 'rgba(96,165,250,0.5)',
    label: 'Day 35',
  },
  'Iron Will': {
    icon: '🛡️',
    tier: 'Silver',
    day: 40,
    outerRing: '#312e81',
    innerRing: '#818cf8',
    bg: 'from-indigo-800 to-slate-600',
    glow: 'rgba(129,140,248,0.5)',
    label: 'Day 40',
  },
  'Unstoppable': {
    icon: '🚀',
    tier: 'Silver',
    day: 45,
    outerRing: '#1e3a5f',
    innerRing: '#38bdf8',
    bg: 'from-sky-700 to-indigo-600',
    glow: 'rgba(56,189,248,0.55)',
    label: 'Day 45',
  },

  // ── Tier 3: Gold (Days 50–70) ──────────────────────────────
  'Halfway Hero': {
    icon: '⭐',
    tier: 'Gold',
    day: 50,
    outerRing: '#78350f',
    innerRing: '#fbbf24',
    bg: 'from-yellow-600 to-amber-400',
    glow: 'rgba(251,191,36,0.7)',
    label: 'Day 50',
  },
  'Dedicated': {
    icon: '🎯',
    tier: 'Gold',
    day: 55,
    outerRing: '#713f12',
    innerRing: '#f59e0b',
    bg: 'from-amber-500 to-yellow-400',
    glow: 'rgba(245,158,11,0.7)',
    label: 'Day 55',
  },
  'Disciplined': {
    icon: '🧠',
    tier: 'Gold',
    day: 60,
    outerRing: '#7c2d12',
    innerRing: '#fb923c',
    bg: 'from-orange-500 to-yellow-400',
    glow: 'rgba(251,146,60,0.7)',
    label: 'Day 60',
  },
  'Machine': {
    icon: '⚙️',
    tier: 'Gold',
    day: 65,
    outerRing: '#3f3f46',
    innerRing: '#facc15',
    bg: 'from-yellow-500 to-zinc-400',
    glow: 'rgba(250,204,21,0.7)',
    label: 'Day 65',
  },
  'Elite': {
    icon: '👑',
    tier: 'Gold',
    day: 70,
    outerRing: '#713f12',
    innerRing: '#eab308',
    bg: 'from-yellow-500 to-amber-400',
    glow: 'rgba(234,179,8,0.75)',
    label: 'Day 70',
  },

  // ── Tier 4: Platinum (Days 75–90) ──────────────────────────
  'Master': {
    icon: '🔮',
    tier: 'Platinum',
    day: 75,
    outerRing: '#4c1d95',
    innerRing: '#c084fc',
    bg: 'from-purple-700 to-violet-500',
    glow: 'rgba(192,132,252,0.8)',
    label: 'Day 75',
  },
  'Legend': {
    icon: '🦁',
    tier: 'Platinum',
    day: 80,
    outerRing: '#6d28d9',
    innerRing: '#e879f9',
    bg: 'from-fuchsia-700 to-purple-600',
    glow: 'rgba(232,121,249,0.8)',
    label: 'Day 80',
  },
  'God Mode': {
    icon: '⚡',
    tier: 'Platinum',
    day: 85,
    outerRing: '#be185d',
    innerRing: '#f472b6',
    bg: 'from-pink-700 to-fuchsia-600',
    glow: 'rgba(244,114,182,0.8)',
    label: 'Day 85',
  },
  'Apex': {
    icon: '🌟',
    tier: 'Platinum',
    day: 90,
    outerRing: '#0f172a',
    innerRing: '#818cf8',
    bg: 'from-indigo-600 to-purple-500',
    glow: 'rgba(129,140,248,0.85)',
    label: 'Day 90',
  },

  // ── Tier 5: Diamond (Days 95–100) ──────────────────────────
  'Inhuman': {
    icon: '💎',
    tier: 'Diamond',
    day: 95,
    outerRing: '#0e7490',
    innerRing: '#67e8f9',
    bg: 'from-cyan-500 to-teal-400',
    glow: 'rgba(103,232,249,0.9)',
    label: 'Day 95',
  },
  'Century King': {
    icon: '🏆',
    tier: 'Diamond',
    day: 100,
    outerRing: '#78350f',
    innerRing: '#fde68a',
    bg: 'from-yellow-300 via-amber-400 to-orange-400',
    glow: 'rgba(253,230,138,1)',
    label: 'Day 100',
  },
};

const TIER_LABEL_STYLE = {
  Bronze: 'text-amber-600',
  Silver: 'text-slate-400',
  Gold: 'text-yellow-400',
  Platinum: 'text-purple-400',
  Diamond: 'text-cyan-300',
};

// ─── Single Badge Visual ───────────────────────────────────────────────────────

const AchievementBadge = ({ badgeName, size = 'md', showTooltip = true }) => {
  const [hovered, setHovered] = useState(false);
  const def = BADGE_DEFINITIONS[badgeName];

  if (!def) {
    // Fallback for unknown badges
    return (
      <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black rounded uppercase">
        {badgeName}
      </span>
    );
  }

  const sizes = {
    sm: { outer: 44, inner: 34, font: '18px', ring: 3, labelSize: '7px' },
    md: { outer: 56, inner: 44, font: '22px', ring: 3.5, labelSize: '8px' },
    lg: { outer: 80, inner: 64, font: '30px', ring: 5, labelSize: '10px' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* SVG Badge */}
      <motion.div
        whileHover={{ scale: 1.15, rotate: [-1, 1, -1, 0] }}
        transition={{ duration: 0.3 }}
        style={{ filter: hovered ? `drop-shadow(0 0 8px ${def.glow})` : `drop-shadow(0 2px 4px rgba(0,0,0,0.5))` }}
      >
        <svg
          width={s.outer}
          height={s.outer}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`bg-${badgeName.replace(/\s/g, '')}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={def.outerRing} />
              <stop offset="100%" stopColor={def.innerRing} />
            </linearGradient>
            <radialGradient id={`shine-${badgeName.replace(/\s/g, '')}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Outer hexagonal ring */}
          <polygon
            points="40,4 72,22 72,58 40,76 8,58 8,22"
            fill={`url(#bg-${badgeName.replace(/\s/g, '')})`}
            stroke={def.outerRing}
            strokeWidth="1"
          />

          {/* Inner hexagonal panel */}
          <polygon
            points="40,12 66,27 66,53 40,68 14,53 14,27"
            fill={`url(#bg-${badgeName.replace(/\s/g, '')})`}
            stroke={def.innerRing}
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* Shine overlay */}
          <polygon
            points="40,12 66,27 66,53 40,68 14,53 14,27"
            fill={`url(#shine-${badgeName.replace(/\s/g, '')})`}
          />

          {/* Decorative tick marks around edge */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 40 + 35 * Math.cos(rad);
            const y1 = 40 + 35 * Math.sin(rad);
            const x2 = 40 + 31 * Math.cos(rad);
            const y2 = 40 + 31 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={def.innerRing}
                strokeWidth="1.5"
                opacity="0.7"
              />
            );
          })}

          {/* Center emoji icon */}
          <text
            x="40"
            y="46"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="26"
          >
            {def.icon}
          </text>
        </svg>
      </motion.div>

      {/* Badge name label */}
      <span
        className={`mt-1 font-black uppercase tracking-wide text-center leading-tight ${TIER_LABEL_STYLE[def.tier]}`}
        style={{ fontSize: s.labelSize, maxWidth: s.outer + 8 }}
      >
        {badgeName}
      </span>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 shadow-2xl text-center">
              <p className={`font-black text-[10px] uppercase ${TIER_LABEL_STYLE[def.tier]}`}>{badgeName}</p>
              <p className="text-gray-400 text-[9px] font-medium mt-0.5">{def.tier} · {def.label}</p>
            </div>
            <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45 mx-auto -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AchievementBadge, BADGE_DEFINITIONS, TIER_LABEL_STYLE };
export default AchievementBadge;
