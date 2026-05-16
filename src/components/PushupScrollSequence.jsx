"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import Link from "next/link";

// ── Constants ────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 192;
const FRAME_PREFIX = "/zip_UI/";

function getFramePath(index) {
  const padded = String(index).padStart(5, "0");
  return `${FRAME_PREFIX}${padded}.jpg`;
}

// ── Loading Spinner ──────────────────────────────────────────────────────────
const CyberpunkLoader = ({ progress }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: "#0A0A0F" }}>
    {/* Ambient glow behind spinner */}
    <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
    <div className="absolute w-[300px] h-[300px] rounded-full bg-fuchsia-500/8 blur-[100px] animate-pulse" />

    {/* Spinner ring */}
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
      <div
        className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"
        style={{ animationDuration: "1.2s" }}
      />
      <div
        className="absolute inset-2 rounded-full border-t-2 border-fuchsia-400 animate-spin"
        style={{ animationDuration: "1.8s", animationDirection: "reverse" }}
      />
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
    </div>

    {/* Loading text */}
    <p className="text-cyan-400/80 text-xs font-bold uppercase tracking-[0.35em] mb-4">
      Calibrating AI Tracking...
    </p>

    {/* Progress bar */}
    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
    <p className="mt-2 text-gray-600 text-[10px] font-mono">{Math.round(progress)}% loaded</p>
  </div>
);

// ── Glass Card Wrapper ───────────────────────────────────────────────────────
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`backdrop-blur-xl border border-white/[0.08] rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl max-w-lg ${className}`}
    style={{ background: "rgba(255,255,255,0.04)" }}
  >
    {children}
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
export default function PushupScrollSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastDrawnFrameRef = useRef(-1);
  const rafIdRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Apply physics-based smoothing to the scroll progress
  // This ensures the image sequence plays smoothly even if the user
  // scrolls in discrete jumps (e.g., with a mouse wheel).
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // ── Preload all images ──────────────────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0;
    const images = new Array(TOTAL_FRAMES);

    const onLoad = () => {
      loadedCount++;
      setLoadProgress((loadedCount / TOTAL_FRAMES) * 100);
      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = images;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i + 1); // frames are 1-indexed
      img.onload = onLoad;
      img.onerror = onLoad; // count errors to avoid stuck loader
      images[i] = img;
    }

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // ── Canvas drawing with "cover" fit ─────────────────────────────────────
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;

    if (displayW === 0 || displayH === 0) return;

    // Set canvas resolution
    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Clear with matching background
    ctx.fillStyle = "#0A0A0F";
    ctx.fillRect(0, 0, displayW, displayH);

    // "cover" fit to fill entire canvas while maintaining aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayW / displayH;

    let drawW, drawH, drawX, drawY;

    if (canvasAspect > imgAspect) {
      drawW = displayW;
      drawH = displayW / imgAspect;
      drawX = 0;
      drawY = (displayH - drawH) / 2;
    } else {
      drawH = displayH;
      drawW = displayH * imgAspect;
      drawX = (displayW - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // ── Resize handler ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    const handleResize = () => {
      lastDrawnFrameRef.current = -1; // force redraw
      const progress = smoothProgress.get();
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
      );
      drawFrame(frameIndex);
    };

    window.addEventListener("resize", handleResize);
    // Initial draw
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, drawFrame, smoothProgress]);

  // ── Scroll → Frame mapping ─────────────────────────────────────────────
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!isLoaded) return;

    setCurrentProgress(latest);

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(latest * (TOTAL_FRAMES - 1)))
    );

    if (frameIndex === lastDrawnFrameRef.current) return;
    lastDrawnFrameRef.current = frameIndex;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
  });

  // ── Overlay visibility helpers ─────────────────────────────────────────
  // We compute overlay opacity/y from state instead of useTransform 
  // because the overlays need to be absolutely positioned within the sticky container
  function computeOverlay(progress, fadeIn, holdStart, holdEnd, fadeOut) {
    if (progress < fadeIn) return { opacity: 0, y: 40 };
    if (progress < holdStart) {
      const t = (progress - fadeIn) / (holdStart - fadeIn);
      return { opacity: t, y: 40 * (1 - t) };
    }
    if (progress < holdEnd) return { opacity: 1, y: 0 };
    if (progress < fadeOut) {
      const t = (progress - holdEnd) / (fadeOut - holdEnd);
      return { opacity: 1 - t, y: -30 * t };
    }
    return { opacity: 0, y: -30 };
  }

  const hero = computeOverlay(currentProgress, -0.01, 0, 0.12, 0.18);
  const form = computeOverlay(currentProgress, 0.18, 0.23, 0.32, 0.40);
  const growth = computeOverlay(currentProgress, 0.50, 0.56, 0.66, 0.74);
  
  // CTA stays visible once it appears
  const ctaRaw = computeOverlay(currentProgress, 0.80, 0.87, 1.0, 1.1);
  const cta = { opacity: ctaRaw.opacity, y: ctaRaw.y };

  const scrollIndicator = currentProgress < 0.04 ? 1 : 0;

  return (
    <>
      {/* Loading overlay — covers everything until images are ready */}
      {!isLoaded && <CyberpunkLoader progress={loadProgress} />}

      {/* Main scroll container — ALWAYS mounted so the ref is attached for useScroll */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "400vh",
          background: "#0A0A0F",
        }}
      >
        {/* ── Ambient Aurora Glows ─────────────────────────────────────────── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "25%",
              left: "-100px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "rgba(6,182,212,0.06)",
              filter: "blur(150px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "33%",
              right: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "rgba(52,211,153,0.05)",
              filter: "blur(130px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "66%",
              left: "33%",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background: "rgba(192,38,211,0.04)",
              filter: "blur(120px)",
            }}
          />
        </div>

        {/* ── Sticky Canvas ────────────────────────────────────────────────── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              background: "#0A0A0F",
            }}
          />

          {/* ── Text Overlays (absolutely positioned over the sticky canvas) ── */}

          {/* Beat 1: Hero — 0% (centered, high impact) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 24px",
              pointerEvents: "none",
              zIndex: 20,
              opacity: hero.opacity,
              transform: `translateY(${hero.y}px)`,
              transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#22D3EE",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                }}
              >
                PushUp100 · AI Fitness
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: "white",
                textShadow: "0 0 60px rgba(6,182,212,0.3), 0 0 120px rgba(168,85,247,0.15)",
                margin: 0,
              }}
            >
              Master the{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #22D3EE, #D946EF, #EC4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Pushup.
              </span>
            </h1>
            <p
              style={{
                marginTop: "16px",
                color: "#9CA3AF",
                fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                fontWeight: 500,
                maxWidth: "28rem",
              }}
            >
              100 Days. Zero Excuses.
            </p>
          </div>

          {/* Beat 2: Form — 25% (left aligned glass card) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "0 24px",
              paddingLeft: "clamp(24px, 5vw, 96px)",
              pointerEvents: "none",
              zIndex: 20,
              opacity: form.opacity,
              transform: `translateY(${form.y}px)`,
              transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            }}
          >
            <GlassCard>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#22D3EE",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    color: "#22D3EE",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  AI Analysis
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.03em",
                  textShadow: "0 0 40px rgba(6,182,212,0.25)",
                  margin: 0,
                }}
              >
                Form is Everything.
              </h2>
              <p style={{ marginTop: "12px", color: "#9CA3AF", fontSize: "clamp(0.8rem, 1.5vw, 1rem)", lineHeight: 1.6 }}>
                AI-powered tracking ensures every rep is perfect. Real-time form correction and muscle activation mapping.
              </p>
              <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, height: "4px", borderRadius: "9999px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: "92%",
                      height: "100%",
                      background: "linear-gradient(to right, #22D3EE, #34D399)",
                      borderRadius: "9999px",
                    }}
                  />
                </div>
                <span style={{ color: "#22D3EE", fontSize: "12px", fontFamily: "monospace", fontWeight: 700 }}>92%</span>
              </div>
              <p style={{ marginTop: "4px", color: "#4B5563", fontSize: "10px", fontFamily: "monospace" }}>FORM ACCURACY SCORE</p>
            </GlassCard>
          </div>

          {/* Beat 3: Growth — 60% (right aligned glass card) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "0 24px",
              paddingRight: "clamp(24px, 5vw, 96px)",
              pointerEvents: "none",
              zIndex: 20,
              opacity: growth.opacity,
              transform: `translateY(${growth.y}px)`,
              transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            }}
          >
            <GlassCard>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#D946EF",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    color: "#D946EF",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  Analytics
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.03em",
                  textShadow: "0 0 40px rgba(192,38,211,0.25)",
                  margin: 0,
                }}
              >
                Progressive Growth.
              </h2>
              <p style={{ marginTop: "12px", color: "#9CA3AF", fontSize: "clamp(0.8rem, 1.5vw, 1rem)", lineHeight: 1.6 }}>
                Real-time analytics to shatter your limits. Track muscle groups, rep velocity, and progressive overload.
              </p>
              <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Reps", value: "2,847", color: "#D946EF" },
                  { label: "Streak", value: "47d", color: "#EC4899" },
                  { label: "Power", value: "+34%", color: "#34D399" },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", fontWeight: 900, fontFamily: "monospace", color: stat.color, margin: 0 }}>
                      {stat.value}
                    </p>
                    <p style={{ color: "#4B5563", fontSize: "10px", fontFamily: "monospace", textTransform: "uppercase", margin: 0 }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Beat 4: CTA — 90% (centered) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 24px",
              pointerEvents: cta.opacity > 0.5 ? "auto" : "none",
              zIndex: 20,
              opacity: cta.opacity,
              transform: `translateY(${cta.y}px)`,
              transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            }}
          >
            <GlassCard className="!max-w-xl">
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 5vw, 3rem)",
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  textShadow: "0 0 50px rgba(6,182,212,0.25)",
                  margin: 0,
                }}
              >
                Your Journey{" "}
                <span
                  style={{
                    background: "linear-gradient(to right, #22D3EE, #D946EF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Begins.
                </span>
              </h2>
              <p style={{ marginTop: "12px", color: "#9CA3AF", fontSize: "clamp(0.8rem, 1.5vw, 1rem)" }}>
                Join the Challenge. Transform your strength in 100 days.
              </p>
              <div style={{ marginTop: "24px" }}>
                <Link href="/auth/register" style={{ display: "inline-block" }}>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(6,182,212,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      position: "relative",
                      padding: "16px 40px",
                      borderRadius: "16px",
                      background: "linear-gradient(to right, #06B6D4, #D946EF, #EC4899)",
                      color: "white",
                      fontWeight: 900,
                      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                      letterSpacing: "0.02em",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 8px 32px rgba(168,85,247,0.4)",
                      overflow: "hidden",
                    }}
                  >
                    Start Day 1 →
                  </motion.button>
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* ── Scroll indicator (bottom of screen) ──────────────────────── */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              zIndex: 30,
              pointerEvents: "none",
              opacity: scrollIndicator,
              transition: "opacity 0.4s ease-out",
            }}
          >
            <span
              style={{
                color: "#6B7280",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.35em",
              }}
            >
              Scroll to begin
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.6 }}
              >
                <path d="m7 13 5 5 5-5" />
                <path d="m7 6 5 5 5-5" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
