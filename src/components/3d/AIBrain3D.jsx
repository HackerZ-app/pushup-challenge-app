"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const AICore = ({ isActive = false, color = '#8b5cf6' }) => {
  const coreRef = useRef();
  const ringsRef = useRef([]);
  const particlesRef = useRef();

  // Create particle positions
  const particleCount = 50;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1.5 + Math.random() * 0.5;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    
    // Animate core
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.scale.setScalar(isActive ? 1 + Math.sin(t * 3) * 0.1 : 1);
    }

    // Animate rings
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = t * (0.2 + i * 0.1);
        ring.rotation.y = t * (0.1 + i * 0.05);
      }
    });

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.1;
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const offset = Math.sin(t * 2 + i * 0.5) * 0.05;
        positions[i3] *= (1 + offset * 0.1);
        positions[i3 + 1] *= (1 + offset * 0.1);
        positions[i3 + 2] *= (1 + offset * 0.1);
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group>
        {/* Core sphere */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.5, 64, 64]} />
          <MeshDistortMaterial
            color={color}
            distort={isActive ? 0.4 : 0.2}
            speed={isActive ? 4 : 2}
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={isActive ? 0.5 : 0.2}
          />
        </mesh>

        {/* Inner glow */}
        <Sphere args={[0.6, 32, 32]}>
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.2}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </Sphere>

        {/* Orbital rings */}
        {[0.9, 1.1, 1.3].map((radius, i) => (
          <mesh key={i} ref={(el) => (ringsRef.current[i] = el)}>
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.4 - i * 0.1}
              emissive={color}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color={color}
            size={0.03}
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      </group>
    </Float>
  );
};

const AIBrain3D = ({ 
  isActive = false,
  color = '#8b5cf6',
  className = '',
  style = {}
}) => {
  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color={color} />
        <pointLight position={[5, -5, -5]} intensity={0.3} color="#ec4899" />
        <AICore isActive={isActive} color={color} />
      </Canvas>
    </div>
  );
};

export default AIBrain3D;
