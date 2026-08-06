'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DesktopStudioWorkspace({ mousePos }: { mousePos: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null!);
  const screenGlowRef = useRef<THREE.PointLight>(null!);

  // Animated Screen Mesh References
  const codeLinesGroupRef = useRef<THREE.Group>(null!);
  const terminalCursorRef = useRef<THREE.Mesh>(null!);
  const graphWaveRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Mouse parallax movement
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.2,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.y * 0.1,
        0.05
      );
    }

    // Screen Glow Intensity Pulse
    if (screenGlowRef.current) {
      screenGlowRef.current.intensity = 2.5 + Math.sin(time * 3) * 0.5;
    }

    // ── ANIMATED MAIN SCREEN: Scrolling Code Lines ──
    if (codeLinesGroupRef.current) {
      codeLinesGroupRef.current.children.forEach((child, i) => {
        // Move code line horizontally & pulse width/scale
        child.position.x = -1.0 + Math.sin(time * 1.5 + i * 0.6) * 0.15;
        (child as THREE.Mesh).scale.x = 0.8 + Math.sin(time * 2 + i) * 0.2;
      });
    }

    // ── ANIMATED GRAPH WAVE ON MAIN SCREEN ──
    if (graphWaveRef.current) {
      graphWaveRef.current.scale.y = 0.8 + Math.sin(time * 4) * 0.3;
    }

    // ── ANIMATED MACBOOK SCREEN: Blinking Terminal Cursor ──
    if (terminalCursorRef.current) {
      terminalCursorRef.current.visible = Math.floor(time * 4) % 2 === 0;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 12, 6]} intensity={2.2} color="#3B82F6" />
      <directionalLight position={[-8, -8, -4]} intensity={1.2} color="#8B5CF6" />
      <pointLight ref={screenGlowRef} position={[0, 0.4, 0.5]} intensity={2.5} color="#06B6D4" />

      {/* Float effect sitting in lower background so it never collides with UI text */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={groupRef} position={[0, -0.9, -0.5]} scale={1.1}>
          {/* 1. Dark Glass Studio Desk */}
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[4.2, 0.08, 1.8]} />
            <meshStandardMaterial color="#0A0D18" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Desk LED Glow Front Edge */}
          <mesh position={[0, -0.4, 0.91]}>
            <boxGeometry args={[4.2, 0.02, 0.02]} />
            <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={2} />
          </mesh>

          {/* 2. Main Ultrawide Glass Screen with Animated IDE Interface */}
          <group position={[0, 0.45, -0.3]}>
            {/* Screen Bezel */}
            <mesh>
              <boxGeometry args={[2.8, 1.25, 0.06]} />
              <meshStandardMaterial color="#050508" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Inner Glass Display Panel */}
            <mesh position={[0, 0, 0.035]} scale={[2.7, 1.15, 0.01]}>
              <boxGeometry args={[1, 1, 1]} />
              <MeshTransmissionMaterial
                backside
                samples={16}
                resolution={512}
                transmission={0.85}
                roughness={0.1}
                clearcoat={1}
                thickness={0.5}
                color="#60A5FA"
              />
            </mesh>
            {/* Display Base Canvas */}
            <mesh position={[0, 0, 0.04]}>
              <planeGeometry args={[2.6, 1.1]} />
              <meshStandardMaterial color="#060913" roughness={0.2} />
            </mesh>

            {/* ── ANIMATED SCREEN CONTENT ── */}
            {/* IDE Header Bar */}
            <mesh position={[0, 0.45, 0.045]}>
              <planeGeometry args={[2.5, 0.12]} />
              <meshStandardMaterial color="#0D1122" emissive="#3B82F6" emissiveIntensity={0.2} />
            </mesh>
            {/* IDE Window Buttons */}
            {[-1.15, -1.08, -1.01].map((xPos, idx) => (
              <mesh key={idx} position={[xPos, 0.45, 0.048]}>
                <circleGeometry args={[0.02, 16]} />
                <meshStandardMaterial
                  color={idx === 0 ? '#FF5F56' : idx === 1 ? '#FFBD2E' : '#27C93F'}
                  emissive={idx === 0 ? '#FF5F56' : idx === 1 ? '#FFBD2E' : '#27C93F'}
                  emissiveIntensity={1.5}
                />
              </mesh>
            ))}

            {/* Code Lines Group (Animated) */}
            <group ref={codeLinesGroupRef} position={[-0.2, 0.1, 0.048]}>
              {[
                { y: 0.2,  w: 1.2, color: '#3B82F6' },
                { y: 0.1,  w: 0.9, color: '#06B6D4' },
                { y: 0.0,  w: 1.4, color: '#8B5CF6' },
                { y: -0.1, w: 0.7, color: '#3B82F6' },
                { y: -0.2, w: 1.1, color: '#60A5FA' },
              ].map((line, idx) => (
                <mesh key={idx} position={[-0.4, line.y, 0]}>
                  <planeGeometry args={[line.w, 0.04]} />
                  <meshStandardMaterial color={line.color} emissive={line.color} emissiveIntensity={2} />
                </mesh>
              ))}
            </group>

            {/* Animated Graph / Telemetry Visualizer on Right Side of Screen */}
            <group position={[0.75, -0.05, 0.048]}>
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.8, 0.6]} />
                <meshStandardMaterial color="#0A0F24" border-radius="4" />
              </mesh>
              <mesh ref={graphWaveRef} position={[0, -0.05, 0.002]}>
                <planeGeometry args={[0.7, 0.35]} />
                <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={1.2} wireframe />
              </mesh>
            </group>

            {/* Monitor Metallic Stand */}
            <mesh position={[0, -0.75, -0.1]}>
              <cylinderGeometry args={[0.08, 0.12, 0.35]} />
              <meshStandardMaterial color="#111322" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>

          {/* 3. Open Laptop (MacBook) with Animated Terminal */}
          <group position={[-1.2, -0.28, 0.3]} rotation={[0, 0.35, 0]}>
            {/* Base Keyboard Unit */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.9, 0.025, 0.6]} />
              <meshStandardMaterial color="#111322" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Keyboard Trackpad */}
            <mesh position={[0, 0.015, 0.16]}>
              <boxGeometry args={[0.3, 0.005, 0.2]} />
              <meshStandardMaterial color="#1A1D2E" roughness={0.4} />
            </mesh>
            {/* Open Laptop Screen */}
            <group position={[0, 0.3, -0.28]} rotation={[-0.2, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.9, 0.58, 0.02]} />
                <meshStandardMaterial color="#050508" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[0.86, 0.54]} />
                <meshStandardMaterial color="#070A14" emissive="#3B82F6" emissiveIntensity={0.2} />
              </mesh>
              {/* Laptop Terminal Lines */}
              <mesh position={[-0.15, 0.1, 0.014]}>
                <planeGeometry args={[0.5, 0.03]} />
                <meshStandardMaterial color="#27C93F" emissive="#27C93F" emissiveIntensity={2} />
              </mesh>
              {/* Blinking Cursor */}
              <mesh ref={terminalCursorRef} position={[0.15, 0.1, 0.014]}>
                <planeGeometry args={[0.04, 0.04]} />
                <meshStandardMaterial color="#27C93F" emissive="#27C93F" emissiveIntensity={3} />
              </mesh>
            </group>
          </group>

          {/* 4. Studio Monitor Speakers (Left & Right) */}
          {[-1.8, 1.8].map((xPos, i) => (
            <group key={i} position={[xPos, 0.1, -0.3]}>
              <mesh>
                <boxGeometry args={[0.35, 0.65, 0.4]} />
                <meshStandardMaterial color="#080912" roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Speaker Cones */}
              <mesh position={[0, 0.1, 0.21]}>
                <cylinderGeometry args={[0.1, 0.1, 0.02]} />
                <meshStandardMaterial color="#1A1E30" emissive="#3B82F6" emissiveIntensity={0.5} />
              </mesh>
              <mesh position={[0, -0.12, 0.21]}>
                <cylinderGeometry args={[0.12, 0.12, 0.02]} />
                <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.5} />
              </mesh>
            </group>
          ))}

          {/* 5. Minimalist Wireless Keyboard & Mouse */}
          <mesh position={[0, -0.35, 0.45]}>
            <boxGeometry args={[0.8, 0.02, 0.25]} />
            <meshStandardMaterial color="#111322" metalness={0.8} />
          </mesh>
          <mesh position={[0.6, -0.35, 0.45]}>
            <boxGeometry args={[0.14, 0.03, 0.22]} />
            <meshStandardMaterial color="#1A1D2E" metalness={0.9} />
          </mesh>
        </group>
      </Float>

      {/* Ambient Code Particle Dust */}
      <Sparkles count={80} scale={10} size={2.5} speed={0.4} color="#60A5FA" />
      <Sparkles count={40} scale={8} size={1.8} speed={0.3} color="#06B6D4" />
    </>
  );
}

export default function HeroScene({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.2, 5.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <DesktopStudioWorkspace mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
