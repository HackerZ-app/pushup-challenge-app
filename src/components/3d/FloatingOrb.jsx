"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = ({ 
  color = '#8b5cf6', 
  secondaryColor = '#ec4899',
  distort = 0.4, 
  speed = 2,
  scale = 1 
}) => {
  const meshRef = useRef();
  
  const gradientMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color) },
        uColor2: { value: new THREE.Color(secondaryColor) },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(vNormal, viewDirection), 2.0);
          
          vec3 gradient = mix(uColor1, uColor2, vUv.y + sin(uTime * 0.5) * 0.2);
          vec3 finalColor = mix(gradient, vec3(1.0), fresnel * 0.5);
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
      transparent: true,
    });
  }, [color, secondaryColor]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y = clock.elapsedTime * 0.2;
      gradientMaterial.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          distort={distort}
          speed={speed}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
};

const FloatingOrb = ({ 
  className = '', 
  color = '#8b5cf6', 
  secondaryColor = '#ec4899',
  distort = 0.4,
  speed = 2,
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color={secondaryColor} />
        <AnimatedSphere 
          color={color} 
          secondaryColor={secondaryColor}
          distort={distort}
          speed={speed}
          scale={scale}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default FloatingOrb;
