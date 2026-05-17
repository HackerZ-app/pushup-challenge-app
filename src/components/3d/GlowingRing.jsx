"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedRing = ({ color = '#8b5cf6', scale = 1 }) => {
  const ringRef = useRef();
  const innerRingRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.3;
      ringRef.current.rotation.z = clock.elapsedTime * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.3) * 0.3;
      innerRingRef.current.rotation.z = -clock.elapsedTime * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group scale={scale}>
        {/* Outer Ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.2, 0.08, 32, 100]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Inner Ring */}
        <mesh ref={innerRingRef}>
          <torusGeometry args={[0.8, 0.05, 32, 100]} />
          <MeshTransmissionMaterial
            backside
            thickness={0.3}
            chromaticAberration={0.2}
            transmission={1}
            roughness={0.1}
            ior={1.5}
          />
        </mesh>

        {/* Center Glow Sphere */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
};

const GlowingRing = ({ 
  className = '', 
  color = '#8b5cf6',
  scale = 1,
  style = {}
}) => {
  return (
    <div className={`${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color={color} />
        <AnimatedRing color={color} scale={scale} />
      </Canvas>
    </div>
  );
};

export default GlowingRing;
