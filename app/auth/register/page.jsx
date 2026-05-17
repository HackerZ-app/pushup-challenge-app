"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mouse Tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  // Rotate the entire card
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Parallax for inner card elements (Simulates Z-depth without hit-testing bugs)
  const titleX = useTransform(mouseXSpring, [-0.5, 0.5], ["-25px", "25px"]);
  const titleY = useTransform(mouseYSpring, [-0.5, 0.5], ["-25px", "25px"]);

  const buttonX = useTransform(mouseXSpring, [-0.5, 0.5], ["-15px", "15px"]);
  const buttonY = useTransform(mouseYSpring, [-0.5, 0.5], ["-15px", "15px"]);

  // Parallax for background
  const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-50px", "50px"]);
  const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-50px", "50px"]);

  const floatX1 = useTransform(mouseXSpring, [-0.5, 0.5], ["-30px", "30px"]);
  const floatY1 = useTransform(mouseYSpring, [-0.5, 0.5], ["-30px", "30px"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const router = useRouter();

  const handleManualRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto login after successful registration
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      if (signInRes?.ok) {
        // Force a hard navigation to ensure session is properly established
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-[#050508]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1500px" }}
    >
      {/* ── Beautiful Spline-like Background ── */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[0%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/40 to-pink-500/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/20 to-emerald-400/20 rounded-full blur-[120px]" />
      </motion.div>

      {/* Floating Elements (Behind Card) */}
      <motion.div
        style={{ x: floatX1, y: floatY1 }}
        className="absolute left-10 bottom-24 w-32 h-32 rounded-full pointer-events-none"
      >
        <div className="w-full h-full rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.6),inset_10px_10px_30px_rgba(255,255,255,0.4)] bg-gradient-to-br from-cyan-400 to-blue-600" />
      </motion.div>

      {/* Floating Elements (In Front of Card) */}
      <motion.div
        style={{ x: titleX, y: titleY, zIndex: 50 }}
        className="absolute right-10 top-20 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 pointer-events-none"
      >
        <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
        <span className="text-white font-bold text-sm tracking-widest uppercase">Secure Node</span>
      </motion.div>

      {/* ── Main Interactive Card ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d" // Only used for the card's tilt, NO translateZ inside!
        }}
        className="relative w-full max-w-md flex justify-center items-center z-10"
      >
        {/* Card Extrusion layer (Provides 3D physical thickness safely) */}
        <div 
          className="absolute inset-0 rounded-[40px] pointer-events-none"
          style={{
            transform: "translateZ(-16px)",
            background: "#08080C",
            boxShadow: "0 30px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)"
          }}
        />

        {/* The Card Glass Body */}
        <div 
          className="relative w-full rounded-[40px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.5)] p-10 flex flex-col items-center"
        >
          {/* Inner Content using Parallax (x,y) instead of translateZ for depth illusion */}
          
          <motion.div style={{ x: titleX, y: titleY }} className="mb-10 text-center pointer-events-none">
            <h1 className="text-4xl font-black text-white mb-2 leading-tight drop-shadow-lg">
              Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Journey</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">New Athlete Profile</p>
          </motion.div>

          {/* Form fields are absolutely flat relative to the glass, guaranteeing hit-test clicks work perfectly */}
          <form onSubmit={handleManualRegister} className="w-full space-y-5 relative z-50">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white shadow-[inset_0_4px_15px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 font-medium"
                placeholder="Elite Athlete"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white shadow-[inset_0_4px_15px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 font-medium"
                placeholder="athlete@strength.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Create Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white shadow-[inset_0_4px_15px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.div style={{ x: buttonX, y: buttonY }} className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98, y: 2 }}
                className="relative w-full py-4 bg-gradient-to-r from-emerald-400 to-cyan-500 text-gray-900 font-black rounded-2xl shadow-[0_15px_30px_rgba(6,182,212,0.3),inset_0_2px_0_rgba(255,255,255,0.5)] group overflow-hidden"
                disabled={isLoading}
                type="submit"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-600 translate-y-1.5 transition-transform group-active:translate-y-0" />
                <span className="relative z-10 drop-shadow-sm">{isLoading ? "Creating Profile..." : "Deep Dive Now"}</span>
              </motion.button>
            </motion.div>
          </form>

          <div className="w-full flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest drop-shadow-md">Or Instant Setup</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <motion.div style={{ x: buttonX, y: buttonY }} className="w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, y: 2 }}
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              type="button"
              className="relative w-full py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 group flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/40 translate-y-1.5 transition-transform group-active:translate-y-0" />
              <svg width="20" height="20" viewBox="0 0 24 24" className="relative z-10 drop-shadow-md">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="relative z-10 drop-shadow-md">Setup with Google</span>
            </motion.button>
          </motion.div>

          <p className="mt-8 text-gray-500 text-xs font-bold text-center uppercase tracking-wider">
            Already have a profile? <br />
            <Link href="/auth/login" className="text-cyan-400 font-black hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mt-2 inline-block transition-colors">Return to Athlete Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
