'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ── Glass Crystal Icosahedron (primary orb) ─────────────────────────────── */
function CrystalOrb({ mousePos }: { mousePos: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const accentRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slow auto-rotation
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
    }

    // Mouse-reactive light position
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x, mousePos.x * 3, 0.04
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y, mousePos.y * 2 + 0.5, 0.04
      );
      lightRef.current.intensity = 4 + Math.sin(t * 2.5) * 1.5;
    }

    if (accentRef.current) {
      accentRef.current.intensity = 2 + Math.sin(t * 1.8 + 1.2) * 1;
    }
  });

  return (
    <>
      {/* Environment lighting */}
      <ambientLight intensity={0.4} color="#0C1A3A" />
      <pointLight ref={lightRef} position={[2, 2, 3]} intensity={4} color="#3B82F6" />
      <pointLight ref={accentRef} position={[-3, -1, 2]} intensity={2} color="#8B5CF6" />
      <pointLight position={[0, -3, 1]} intensity={1.5} color="#06B6D4" />

      {/* Float wrapping the crystal for organic motion */}
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 2]} />
          <MeshTransmissionMaterial
            backside
            samples={10}
            resolution={512}
            transmission={0.95}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0}
            thickness={0.6}
            chromaticAberration={0.08}
            anisotropy={0.3}
            distortion={0.3}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#A5C5FF"
            attenuationColor="#3B82F6"
            attenuationDistance={2}
          />
        </mesh>
      </Float>
    </>
  );
}

/* ── Orbiting ring particles ─────────────────────────────────────────────── */
function OrbitalRing({ radius = 2.5, count = 40, color = '#3B82F6', speed = 0.4, tilt = 0 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr[i * 3]     = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.sin(angle) * radius * Math.sin(tilt);
      arr[i * 3 + 2] = Math.sin(angle) * radius * Math.cos(tilt);
    }
    return arr;
  }, [radius, count, tilt]);

  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * speed;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

/* ── Canvas export ───────────────────────────────────────────────────────── */
export default function HeroScene({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <CrystalOrb mousePos={mousePos} />

        {/* Orbital particle rings */}
        <OrbitalRing radius={2.2} count={50} color="#3B82F6" speed={0.35} tilt={0.3} />
        <OrbitalRing radius={2.8} count={35} color="#8B5CF6" speed={-0.25} tilt={1.2} />
        <OrbitalRing radius={3.2} count={25} color="#06B6D4" speed={0.18} tilt={0.7} />

        {/* Ambient sparkle dust */}
        <Sparkles count={120} scale={10} size={2} speed={0.25} color="#60A5FA" opacity={0.5} />
        <Sparkles count={60}  scale={8}  size={1.5} speed={0.15} color="#A78BFA" opacity={0.4} />
      </Canvas>
    </div>
  );
}
