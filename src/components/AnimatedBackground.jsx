"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Orb = ({ color, duration, delay, xRange, yRange, scaleRange }) => (
  <motion.div
    className={`absolute rounded-full blur-[120px] ${color}`}
    initial={{ 
      x: xRange[0], 
      y: yRange[0], 
      scale: scaleRange[0] 
    }}
    animate={{ 
      x: xRange, 
      y: yRange, 
      scale: scaleRange 
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
    style={{ width: '500px', height: '500px' }}
  />
);

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-950 pointer-events-none select-none">
      {/* Aurora Orbs */}
      <Orb 
        color="bg-purple-600/20" 
        duration={25} 
        delay={0} 
        xRange={['-10%', '40%']} 
        yRange={['-10%', '30%']} 
        scaleRange={[1, 1.2]} 
      />
      <Orb 
        color="bg-fuchsia-600/20" 
        duration={30} 
        delay={2} 
        xRange={['60%', '20%']} 
        yRange={['50%', '-10%']} 
        scaleRange={[1.1, 0.9]} 
      />
      <Orb 
        color="bg-indigo-600/20" 
        duration={28} 
        delay={5} 
        xRange={['10%', '70%']} 
        yRange={['70%', '20%']} 
        scaleRange={[0.9, 1.1]} 
      />
      <Orb 
        color="bg-blue-600/15" 
        duration={35} 
        delay={1} 
        xRange={['80%', '30%']} 
        yRange={['10%', '60%']} 
        scaleRange={[1.2, 0.8]} 
      />

      {/* Subtle Grain Overlay (Optional but premium) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};

export default AnimatedBackground;
