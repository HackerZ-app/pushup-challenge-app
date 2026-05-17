"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ProgressRing = ({ progress = 0, color = '#a855f7' }) => {
  const ringRef = useRef();
  const glowRef = useRef();
  
  const progressRadians = (progress / 100) * Math.PI * 2;

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.rotation.z = -clock.elapsedTime * 0.15;
    }
  });

  const ringGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 1.5;
    const innerRadius = 1.2;
    
    // Create arc based on progress
    const segments = 64;
    const angleStep = progressRadians / segments;
    
    // Outer arc
    for (let i = 0; i <= segments; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const x = Math.cos(angle) * outerRadius;
      const y = Math.sin(angle) * outerRadius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    
    // Inner arc (reverse)
    for (let i = segments; i >= 0; i--) {
      const angle = -Math.PI / 2 + i * angleStep;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      shape.lineTo(x, y);
    }
    
    shape.closePath();
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 8,
    });
  }, [progressRadians]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Background ring */}
        <mesh ref={glowRef}>
          <torusGeometry args={[1.35, 0.12, 16, 64]} />
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.3}
            roughness={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
        
        {/* Progress arc */}
        {progress > 0 && (
          <mesh ref={ringRef} geometry={ringGeometry}>
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        )}
        
        {/* Center orb */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <MeshDistortMaterial
            color={color}
            distort={0.3}
            speed={2}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
        
        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.2}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Stats3DRing = ({ 
  progress = 0, 
  color = '#a855f7',
  className = '',
  style = {}
}) => {
  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color={color} />
        <ProgressRing progress={progress} color={color} />
      </Canvas>
    </div>
  );
};

export default Stats3DRing;
