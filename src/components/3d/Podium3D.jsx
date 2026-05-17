"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const Medal = ({ position, color, rank, scale = 1 }) => {
  const medalRef = useRef();
  
  useFrame(({ clock }) => {
    if (medalRef.current) {
      medalRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5 + rank) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position} ref={medalRef} scale={scale}>
        {/* Medal body */}
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
          <meshStandardMaterial 
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Medal ring */}
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.08, 0.025, 16, 32]} />
          <meshStandardMaterial 
            color={color}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Ribbon */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.02]} />
          <meshStandardMaterial 
            color="#1f2937"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
};

const PodiumBlock = ({ position, height, color, delay = 0 }) => {
  const blockRef = useRef();
  
  useFrame(({ clock }) => {
    if (blockRef.current) {
      blockRef.current.scale.y = THREE.MathUtils.lerp(
        blockRef.current.scale.y,
        1,
        0.05
      );
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={blockRef}
        args={[1.2, height, 0.8]}
        radius={0.1}
        smoothness={4}
        scale={[1, 0, 1]}
      >
        <meshStandardMaterial 
          color={color}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      
      {/* Top glow */}
      <mesh position={[0, height / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

const Podium3D = ({ className = '', style = {} }) => {
  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#fbbf24" />
        <pointLight position={[5, 5, 5]} intensity={0.3} color="#94a3b8" />
        
        {/* 2nd Place */}
        <PodiumBlock position={[-1.5, -0.5, 0]} height={1.5} color="#64748b" />
        <Medal position={[-1.5, 1.3, 0]} color="#94a3b8" rank={2} scale={0.8} />
        
        {/* 1st Place */}
        <PodiumBlock position={[0, -0.25, 0]} height={2} color="#ca8a04" />
        <Medal position={[0, 1.8, 0]} color="#fbbf24" rank={1} scale={1} />
        
        {/* 3rd Place */}
        <PodiumBlock position={[1.5, -0.75, 0]} height={1} color="#b45309" />
        <Medal position={[1.5, 0.8, 0]} color="#f97316" rank={3} scale={0.7} />

        {/* Base platform */}
        <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial 
            color="#111827"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Podium3D;
