"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ── Icons (Raw SVGs for high fidelity) ───────────────────────────────────────

const TrackingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

const GrowthIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ── Components ───────────────────────────────────────────────────────────────

const FeatureCard = ({ title, description, icon: Icon, gradient }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col gap-4 shadow-2xl"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${gradient}`}>
      <Icon />
    </div>
    <h3 className="text-xl font-black text-white">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="relative w-full overflow-x-hidden">
      
      {/* ── SECTION 1: HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 relative">
        {/* Floating 3D elements (decorative) */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 md:left-20 text-6xl opacity-20 blur-sm select-none"
        >
          💪
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-10 md:right-20 text-6xl opacity-20 blur-sm select-none"
        >
          🔥
        </motion.div>

        <div className="max-w-4xl text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black text-white tracking-tight leading-tight"
          >
            Master the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-pink-500">
              Pushup Challenge
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Join thousands of fitness enthusiasts in the ultimate pushup challenge.
            Track your progress, compete with friends, and transform your strength.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl border-2 border-cyan-500 text-white font-black text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:bg-cyan-500/10 transition-all"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/auth/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-pink-500 text-gray-900 font-black text-lg shadow-[0_10px_30px_rgba(236,72,153,0.3)]"
              >
                Deep Dive
              </motion.button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-20 flex flex-col items-center gap-4 text-gray-500 text-sm font-bold uppercase tracking-widest"
          >
            <span>Scroll to explore</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 13 5 5 5-5" /><path d="m7 6 5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: FEATURES ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Why Choose Pushup Challenge?</h2>
            <p className="text-gray-500 text-lg font-medium">Scientifically designed features to maximize your fitness journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Real-Time Tracking"
              description="Monitor your progress instantly with detailed metrics and performance analytics."
              icon={TrackingIcon}
              gradient="bg-emerald-500"
            />
            <FeatureCard 
              title="Progressive Growth"
              description="Build muscle strength systematically with science-backed training progressions."
              icon={GrowthIcon}
              gradient="bg-gradient-to-br from-emerald-400 to-pink-500"
            />
            <FeatureCard 
              title="Community Challenges"
              description="Compete with thousands of fitness enthusiasts and celebrate victories together."
              icon={CommunityIcon}
              gradient="bg-gradient-to-br from-pink-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: CTA ── */}
      <section className="py-32 px-4 relative">
        <div className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 md:p-20 text-center shadow-3xl">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Transform Your Strength?</h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
            Join the fitness revolution and start your pushup challenge today. 
            Track progress, build community, achieve greatness.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl border-2 border-cyan-500 text-white font-black text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:bg-cyan-500/10 transition-all"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/auth/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-pink-500 text-gray-900 font-black text-lg shadow-[0_10px_30px_rgba(236,72,153,0.3)]"
              >
                Deep Dive
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm font-medium">© 2026 Pushup Challenge App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
