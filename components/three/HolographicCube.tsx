'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CubeMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
    }
    if (lineRef.current) {
      lineRef.current.rotation.x += delta * 0.5;
      lineRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <group scale={1.3}>
        {/* Transparent faces */}
        <mesh ref={meshRef}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshPhysicalMaterial
            color="#06B6D4"
            transparent
            opacity={0.15}
            roughness={0.1}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>

        {/* Wireframe edges */}
        <lineSegments ref={lineRef}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
          <lineBasicMaterial color="#3B82F6" linewidth={2} />
        </lineSegments>
      </group>
    </Float>
  );
}

export default function HolographicCube() {
  return (
    <div className="w-full h-[220px] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#06B6D4" />
        <CubeMesh />
      </Canvas>
    </div>
  );
}
