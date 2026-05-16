"use client";

import React from "react";
import PushupScrollSequence from "./PushupScrollSequence";

const IsometricFeatureGallery = ({ features }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[500px] md:h-[600px] flex items-center justify-center [perspective:1500px] overflow-visible">
      <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
        {features.map((feature, i) => {
          const isHovered = hoveredIndex === i;
          const isSomeHovered = hoveredIndex !== null;
          
          let dx = `calc(${(i - 1)} * clamp(80px, 12vw, 140px))`;
          let dz = `${(1 - i) * 80}px`;
          let rx = '15deg';
          let ry = '-30deg';
          let rz = '5deg';
          let scale = '1';
          let zIndex = 10 - i;
          let opacity = 1;

          if (isSomeHovered) {
            if (isHovered) {
              dx = '0px';
              dz = '150px';
              rx = '0deg';
              ry = '0deg';
              rz = '0deg';
              scale = '1.1';
              zIndex = 50;
            } else {
              const distance = Math.abs(i - hoveredIndex);
              const direction = i < hoveredIndex ? -1 : 1;
              dx = `calc(${direction} * clamp(140px, 20vw, 240px))`;
              dz = `${-100 - distance * 50}px`;
              rx = '15deg';
              ry = '-30deg';
              rz = '5deg';
              zIndex = 10 - distance;
              opacity = 0.4;
            }
          }

          return (
            <div
              key={feature.title}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="absolute w-[280px] md:w-[320px] h-[380px] md:h-[420px] rounded-3xl cursor-pointer"
              style={{
                transform: `translateX(${dx}) translateZ(${dz}) rotateX(${rx}) rotateY(${ry}) rotateZ(${rz}) scale(${scale})`,
                zIndex,
                opacity,
                transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
                transformStyle: "preserve-3d"
              }}
            >
              <div 
                className={`absolute inset-0 rounded-3xl border transition-all duration-800 overflow-hidden flex flex-col
                  ${isHovered 
                    ? 'bg-[#111118]/95 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)]' 
                    : 'bg-[#111118]/60 border-white/5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-md'}`}
              >
                {/* Background Glow */}
                <div 
                  className={`absolute inset-0 opacity-0 transition-opacity duration-800 pointer-events-none ${isHovered ? 'opacity-100' : ''}`}
                  style={{ background: `radial-gradient(120% 120% at 50% 100%, ${feature.glow} 0%, transparent 100%)` }}
                />

                {/* Default State: Icon & Title */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-800 ${isHovered ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-5xl font-black mb-8 shadow-[inset_0_2px_8px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.4)]"
                    style={{ background: feature.gradient }}
                  >
                    <span className="drop-shadow-lg">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center tracking-tight" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
                    {feature.title}
                  </h3>
                </div>

                {/* Hovered State: Full Information */}
                <div className={`absolute inset-0 flex flex-col justify-center p-8 md:p-10 transition-all duration-800 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-8 shadow-[inset_0_2px_8px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.4)]"
                    style={{ background: feature.gradient }}
                  >
                    <span className="drop-shadow-lg">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p className="text-[#A1A1AA] text-base md:text-lg leading-relaxed" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * LandingPage — Scrollytelling experience for unauthenticated visitors.
 * Wraps the PushupScrollSequence component and adds the final sections
 * that appear after the scroll sequence ends.
 * 
 * IMPORTANT: Do NOT set overflow-x: hidden on any ancestor of the sticky canvas,
 * as it breaks position: sticky behavior in all browsers.
 */
const LandingPage = () => {
  return (
    <div style={{ background: "#0A0A0F" }}>
      {/* ── The Main Scrollytelling Canvas Experience ── */}
      <PushupScrollSequence />

      {/* ── Post-scroll Feature Strip ── */}
      <section className="relative z-20 py-[clamp(80px,10vw,128px)] px-4 bg-[#0A0A0F]">
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-[clamp(64px,8vw,80px)]">
            <h2 
              className="text-[clamp(1.75rem,5vw,3.5rem)] font-black text-white tracking-tight m-0 drop-shadow-[0_0_50px_rgba(6,182,212,0.2)]"
              style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
            >
              Why{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                PushUp100
              </span>
              ?
            </h2>
            <p className="mt-4 text-gray-400 text-[clamp(0.8rem,1.5vw,1rem)] max-w-[480px] mx-auto" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
              Scientifically designed. AI-powered. Community-driven.
            </p>
          </div>

          <IsometricFeatureGallery
            features={[
              {
                icon: "✦",
                title: "AI Form Tracking",
                description: "Computer vision analyzes every rep for perfect form and maximum muscle engagement.",
                gradient: "linear-gradient(135deg, #22D3EE, #0891B2)",
                glow: "rgba(6,182,212,0.4)",
              },
              {
                icon: "↗",
                title: "Progressive Overload",
                description: "Smart algorithms adapt your daily targets based on recovery and performance data.",
                gradient: "linear-gradient(135deg, #34D399, #059669)",
                glow: "rgba(52,211,153,0.4)",
              },
              {
                icon: "⚔",
                title: "Community Battles",
                description: "Compete on leaderboards and challenge friends to push beyond their limits.",
                gradient: "linear-gradient(135deg, #D946EF, #9333EA)",
                glow: "rgba(192,38,211,0.4)",
              },
            ]}
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 20,
          padding: "40px 0",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
          background: "#0A0A0F",
        }}
      >
        <p style={{ color: "#4B5563", fontSize: "0.875rem", fontWeight: 500, margin: 0 }}>
          © 2026 PushUp100. Built for the relentless.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
