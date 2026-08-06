'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function OrbMesh() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} scale={1.4}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#3B82F6"
          attach="material"
          distort={0.45}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function LiquidOrb() {
  return (
    <div className="w-full h-[300px] sm:h-[400px] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#8B5CF6" />
        <pointLight position={[-5, -5, -2]} intensity={1.5} color="#06B6D4" />
        <OrbMesh />
      </Canvas>
    </div>
  );
}
