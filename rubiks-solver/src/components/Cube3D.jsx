import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const colorHex = {
  white: '#FFFFFF',
  red: '#B71234',
  green: '#009B48',
  yellow: '#FFD500',
  orange: '#FF5800',
  blue: '#0046AD',
  base: '#1a1a1a'
};

// ──────────────────────────────────────────────────────────────
// 3x3 Cube
// ──────────────────────────────────────────────────────────────
const Cublet3 = ({ position, colors }) => {
  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: colors.R || colorHex.base, roughness: 0.15, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: colors.L || colorHex.base, roughness: 0.15, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: colors.U || colorHex.base, roughness: 0.15, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: colors.D || colorHex.base, roughness: 0.15, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: colors.F || colorHex.base, roughness: 0.15, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: colors.B || colorHex.base, roughness: 0.15, metalness: 0.1 }),
  ], [colors]);

  return (
    <mesh position={position}>
      <boxGeometry args={[0.93, 0.93, 0.93]} />
      {materials.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
    </mesh>
  );
};

const getCubletColors3 = (x, y, z, cs) => {
  const colors = {};
  if (y === 1)  colors.U = colorHex[cs.U[(z + 1) * 3 + (x + 1)]];
  if (y === -1) colors.D = colorHex[cs.D[(-z + 1) * 3 + (x + 1)]];
  if (x === 1)  colors.R = colorHex[cs.R[(-y + 1) * 3 + (-z + 1)]];
  if (x === -1) colors.L = colorHex[cs.L[(-y + 1) * 3 + (z + 1)]];
  if (z === 1)  colors.F = colorHex[cs.F[(-y + 1) * 3 + (x + 1)]];
  if (z === -1) colors.B = colorHex[cs.B[(-y + 1) * 3 + (-x + 1)]];
  return colors;
};

const Cube3x3 = ({ cubeState }) => {
  const groupRef = useRef();
  const cublets = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        cublets.push(
          <Cublet3
            key={`${x}${y}${z}`}
            position={[x, y, z]}
            colors={getCubletColors3(x, y, z, cubeState)}
          />
        );
      }
    }
  }
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x += 0.002;
    }
  });
  return <group ref={groupRef}>{cublets}</group>;
};

// ──────────────────────────────────────────────────────────────
// 4x4 Cube
// ──────────────────────────────────────────────────────────────
const OFFSETS4 = [-1.5, -0.5, 0.5, 1.5];

const getCubletColors4 = (xi, yi, zi, cs) => {
  // xi, yi, zi are indices 0..3
  const colors = {};
  const xPos = OFFSETS4[xi];
  const yPos = OFFSETS4[yi];
  const zPos = OFFSETS4[zi];

  // Face U: top layer (yi === 3) — sticker row = zi, col = xi
  if (yi === 3) colors.U = colorHex[cs.U[zi * 4 + xi]];
  // Face D: bottom layer (yi === 0) — sticker row = inverse z, col = xi
  if (yi === 0) colors.D = colorHex[cs.D[(3 - zi) * 4 + xi]];
  // Face R: right column (xi === 3)
  if (xi === 3) colors.R = colorHex[cs.R[(3 - yi) * 4 + (3 - zi)]];
  // Face L: left column (xi === 0)
  if (xi === 0) colors.L = colorHex[cs.L[(3 - yi) * 4 + zi]];
  // Face F: front face (zi === 3)
  if (zi === 3) colors.F = colorHex[cs.F[(3 - yi) * 4 + xi]];
  // Face B: back face (zi === 0)
  if (zi === 0) colors.B = colorHex[cs.B[(3 - yi) * 4 + (3 - xi)]];

  return colors;
};

const Cube4x4 = ({ cubeState }) => {
  const groupRef = useRef();
  const cublets = [];
  const isInterior = (xi, yi, zi) =>
    xi > 0 && xi < 3 && yi > 0 && yi < 3 && zi > 0 && zi < 3;

  for (let xi = 0; xi < 4; xi++) {
    for (let yi = 0; yi < 4; yi++) {
      for (let zi = 0; zi < 4; zi++) {
        if (isInterior(xi, yi, zi)) continue;
        const pos = [OFFSETS4[xi], OFFSETS4[yi], OFFSETS4[zi]];
        cublets.push(
          <mesh key={`${xi}${yi}${zi}`} position={pos}>
            <boxGeometry args={[0.93, 0.93, 0.93]} />
            {Object.entries({
              R: getCubletColors4(xi, yi, zi, cubeState).R || colorHex.base,
              L: getCubletColors4(xi, yi, zi, cubeState).L || colorHex.base,
              U: getCubletColors4(xi, yi, zi, cubeState).U || colorHex.base,
              D: getCubletColors4(xi, yi, zi, cubeState).D || colorHex.base,
              F: getCubletColors4(xi, yi, zi, cubeState).F || colorHex.base,
              B: getCubletColors4(xi, yi, zi, cubeState).B || colorHex.base,
            }).map(([, color], i) => (
              <meshStandardMaterial
                key={i}
                attach={`material-${i}`}
                color={color}
                roughness={0.15}
                metalness={0.1}
              />
            ))}
          </mesh>
        );
      }
    }
  }
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x += 0.002;
    }
  });
  return <group ref={groupRef}>{cublets}</group>;
};

// ──────────────────────────────────────────────────────────────
// Exported Visualizers
// ──────────────────────────────────────────────────────────────
const SceneEnv = () => (
  <>
    <ambientLight intensity={0.7} />
    <pointLight position={[10, 10, 10]} intensity={1.5} />
    <pointLight position={[-10, -10, -10]} intensity={0.5} />
    <OrbitControls enablePan={false} enableZoom />
  </>
);

export const CubeVisualizer = ({ cubeState }) => (
  <div className="w-full h-[600px] rounded-xl overflow-hidden border border-zinc-700 mx-auto" style={{ background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)' }}>
    <Canvas camera={{ position: [5, 5, 5], fov: 40 }}>
      <SceneEnv />
      <Cube3x3 cubeState={cubeState} />
    </Canvas>
  </div>
);

export const CubeVisualizer4x4 = ({ cubeState }) => (
  <div className="w-full h-[600px] rounded-xl overflow-hidden border border-zinc-700 mx-auto" style={{ background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)' }}>
    <Canvas camera={{ position: [7, 7, 7], fov: 40 }}>
      <SceneEnv />
      <Cube4x4 cubeState={cubeState} />
    </Canvas>
  </div>
);
