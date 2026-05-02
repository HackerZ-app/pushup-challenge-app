"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3D Card Hover Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Manual login logic would go here
    // For now, let's just simulate or use Google
    setIsLoading(false);
    alert("Manual login is coming soon! Please use Google Login for now.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-md h-[600px] rounded-[40px] bg-gray-900/60 backdrop-blur-2xl border border-white/10 shadow-3xl p-10 flex flex-col items-center"
      >
        {/* Inner Content with Z-translation */}
        <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} className="w-full flex flex-col items-center">
          
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Athlete Login Console</p>
          </div>

          <form onSubmit={handleManualLogin} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="athlete@strength.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Manual Access"}
            </motion.button>
          </form>

          <div className="w-full flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Or Secure Entry</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </motion.button>

          <p className="mt-8 text-gray-500 text-xs font-medium">
            New here? <Link href="/auth/register" className="text-cyan-400 font-bold hover:underline">Deep Dive into Registration</Link>
          </p>
        </div>

        {/* Decorative 3D Floating Bits */}
        <div style={{ transform: "translateZ(50px)" }} className="absolute -top-6 -right-6 text-4xl select-none">✨</div>
        <div style={{ transform: "translateZ(30px)" }} className="absolute bottom-10 -left-6 text-4xl select-none opacity-20">🛡️</div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
