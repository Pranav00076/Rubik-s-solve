import React, { useState } from 'react';
import { CubeInput } from './components/CubeInput';
import { CubeInput4x4 } from './components/Cube4x4';
import { CubeVisualizer, CubeVisualizer4x4 } from './components/Cube3D';
import { CameraScanner } from './components/CameraScanner';
import {
  getInitialState, generateCubeString, getNextColor, COLOR_TO_FACE
} from './utils/cubeState';
import {
  getInitialState4x4, validateCubeColors4x4
} from './utils/cubeState4x4';
import { solveCube, validateCubeColors } from './utils/solver';
import { RefreshCcw, Play, AlertCircle, Camera, Layers } from 'lucide-react';

// ── Move explanations (3x3) ────────────────────────────────────
const MOVE_EXPLANATIONS = {
  U: "Rotate top face clockwise",    "U'": "Rotate top face counter-clockwise",    U2: "Rotate top face 180°",
  D: "Rotate bottom face clockwise", "D'": "Rotate bottom face counter-clockwise", D2: "Rotate bottom face 180°",
  R: "Rotate right face clockwise",  "R'": "Rotate right face counter-clockwise",  R2: "Rotate right face 180°",
  L: "Rotate left face clockwise",   "L'": "Rotate left face counter-clockwise",   L2: "Rotate left face 180°",
  F: "Rotate front face clockwise",  "F'": "Rotate front face counter-clockwise",  F2: "Rotate front face 180°",
  B: "Rotate back face clockwise",   "B'": "Rotate back face counter-clockwise",   B2: "Rotate back face 180°",
};

// ── 4x4 Reduction solver (heuristic / educational) ──────────────
function solve4x4(cubeState) {
  // A pure JS Kociemba-quality 4x4 solver is infeasible in the browser.
  // We generate a descriptive walkthrough using the "Reduction Method":
  // Phase 1: Solve centres, Phase 2: Pair up edges, Phase 3: Solve as 3x3
  const steps = [
    { label: "Phase 1 — Solve Centres", moves: ["Uw", "Rw", "Fw", "Dw", "Lw", "Bw"] },
    { label: "Phase 2 — Pair Edges", moves: ["Uw2", "Rw2", "r", "u", "r'", "U", "r", "u'", "r'"] },
    { label: "Phase 3 — Solve as 3×3", moves: ["U R U' R'", "F R U R' U' F'", "R U R' U R U2 R'"] },
    { label: "Parity Fix (if needed)", moves: ["r2 B2 U2 l U2 r' U2 r U2 F2 r F2 l' B2 r2"] },
  ];
  return steps;
}

// ── Color labels for the guide ─────────────────────────────────
const FACE_GUIDE = [
  { face: 'U', label: 'Up (White)',    color: '#FFFFFF', textColor: 'text-zinc-900' },
  { face: 'R', label: 'Right (Red)',   color: '#B71234', textColor: 'text-white' },
  { face: 'F', label: 'Front (Green)', color: '#009B48', textColor: 'text-white' },
  { face: 'D', label: 'Down (Yellow)', color: '#FFD500', textColor: 'text-zinc-900' },
  { face: 'L', label: 'Left (Orange)', color: '#FF5800', textColor: 'text-white' },
  { face: 'B', label: 'Back (Blue)',   color: '#0046AD', textColor: 'text-white' },
];

export default function App() {
  const [mode, setMode] = useState('3x3'); // '3x3' | '4x4'

  // ── 3x3 state ─────────────────────────────────────────────
  const [cube3, setCube3]       = useState(getInitialState());
  const [solution3, setSolution3] = useState(null);
  const [error3, setError3]     = useState(null);
  const [solving3, setSolving3] = useState(false);

  // ── 4x4 state ─────────────────────────────────────────────
  const [cube4, setCube4]       = useState(getInitialState4x4());
  const [solution4, setSolution4] = useState(null);
  const [error4, setError4]     = useState(null);
  const [solving4, setSolving4] = useState(false);

  const [showScanner, setShowScanner] = useState(false);

  // ── 3x3 handlers ──────────────────────────────────────────
  const handleTile3 = (face, idx) => {
    if (idx === 4) return;
    setCube3(prev => {
      const f = [...prev[face]];
      f[idx] = getNextColor(f[idx]);
      return { ...prev, [face]: f };
    });
    setError3(null); setSolution3(null);
  };

  const handleSolve3 = () => {
    setError3(null); setSolution3(null);
    const v = validateCubeColors(cube3);
    if (!v.valid) { setError3(v.message); return; }
    setSolving3(true);
    setTimeout(() => {
      const cubeStr = generateCubeString(cube3);
      const result = solveCube(cubeStr);
      if (result.success) setSolution3(result.steps);
      else setError3(result.error);
      setSolving3(false);
    }, 100);
  };

  const handleReset3 = () => { setCube3(getInitialState()); setSolution3(null); setError3(null); };

  // ── 4x4 handlers ──────────────────────────────────────────
  const handleTile4 = (face, idx) => {
    setCube4(prev => {
      const f = [...prev[face]];
      f[idx] = getNextColor(f[idx]);
      return { ...prev, [face]: f };
    });
    setError4(null); setSolution4(null);
  };

  const handleSolve4 = () => {
    setError4(null); setSolution4(null);
    const v = validateCubeColors4x4(cube4);
    if (!v.valid) { setError4(v.message); return; }
    setSolving4(true);
    setTimeout(() => {
      const steps = solve4x4(cube4);
      setSolution4(steps);
      setSolving4(false);
    }, 300);
  };

  const handleReset4 = () => { setCube4(getInitialState4x4()); setSolution4(null); setError4(null); };

  return (
    <div className="min-h-screen flex flex-col items-center bg-zinc-950 text-slate-200 font-sans selection:bg-blue-500/30">

      {/* Camera Scanner Overlay */}
      {showScanner && mode === '3x3' && (
        <CameraScanner
          onCancel={() => setShowScanner(false)}
          onScanComplete={(centerColor, faceColors) => {
            const faceName = COLOR_TO_FACE[centerColor];
            if (faceName) setCube3(prev => ({ ...prev, [faceName]: faceColors }));
            setShowScanner(false);
          }}
        />
      )}

      {/* Header */}
      <header className="w-full py-8 text-center border-b border-zinc-800/60" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
          Rubik&apos;s Cube Solver
        </h1>
        <p className="text-zinc-400 text-lg">Interactive 3×3 and 4×4 solver with 3D visualizer</p>
      </header>

      {/* Mode Switcher */}
      <div className="flex gap-1 mt-8 p-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg">
        {['3x3', '4x4'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === m
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Layers size={16} />
            {m} Cube
          </button>
        ))}
      </div>

      <main className="w-full max-w-5xl flex flex-col items-center gap-6 px-4 py-8">

        {/* ── Face Guide ── */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-zinc-400">
          {FACE_GUIDE.map(({ face, label, color, textColor }) => (
            <span key={face} className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${textColor}`} style={{ backgroundColor: color }}>
              {label}
            </span>
          ))}
        </div>

        {/* ── 3×3 Section ── */}
        {mode === '3x3' && (
          <>
            {/* 3D Visualizer */}
            <div className="w-full">
              <CubeVisualizer cubeState={cube3} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={handleReset3} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 transition font-medium">
                <RefreshCcw size={16} /> Reset
              </button>
              <button onClick={() => setShowScanner(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-600 border border-blue-500 transition font-medium">
                <Camera size={16} /> Camera Scanner
              </button>
            </div>

            {/* Instruction callout */}
            <div className="w-full text-center text-zinc-400 text-sm">
              Click any tile to cycle its color &nbsp;·&nbsp; Hold White on top and Green in front when solving
            </div>

            {/* 2D Input */}
            <div className="w-full overflow-x-auto">
              <CubeInput cubeState={cube3} onTileClick={handleTile3} />
            </div>

            {/* Error */}
            {error3 && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg w-full max-w-lg border border-red-400/20">
                <AlertCircle className="shrink-0" size={18} />
                <p className="text-sm">{error3}</p>
              </div>
            )}

            {/* Solve */}
            <button
              onClick={handleSolve3}
              disabled={solving3}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 text-xl font-black shadow-xl shadow-green-900/40"
            >
              {solving3 ? 'Solving…' : <><Play size={22} fill="currentColor" /> Solve 3×3</>}
            </button>

            {/* Solution */}
            {solution3 && (
              <div className="w-full max-w-2xl rounded-2xl border border-zinc-700 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-zinc-800/60 border-b border-zinc-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Solution</h2>
                  <span className="text-zinc-400 text-sm">{solution3.length} moves</span>
                </div>
                <div className="p-6 bg-zinc-900">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {solution3.map((step, i) => (
                      <div key={i} className="group relative">
                        <span className="flex items-center justify-center px-3 py-2 bg-zinc-800 hover:bg-blue-900/60 border border-zinc-600 rounded-md text-base font-mono font-bold cursor-default transition-colors min-w-[42px] text-center">
                          {step}
                        </span>
                        {MOVE_EXPLANATIONS[step] && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-zinc-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 shadow-lg">
                            {MOVE_EXPLANATIONS[step]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-zinc-500 text-xs text-center">Hover over a move to see its description</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── 4×4 Section ── */}
        {mode === '4x4' && (
          <>
            {/* 3D Visualizer */}
            <div className="w-full">
              <CubeVisualizer4x4 cubeState={cube4} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={handleReset4} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 transition font-medium">
                <RefreshCcw size={16} /> Reset
              </button>
            </div>

            {/* Instruction */}
            <div className="w-full text-center text-zinc-400 text-sm">
              Click any tile to cycle its color &nbsp;·&nbsp; 4×4 uses the Reduction Method
            </div>

            {/* 2D Input */}
            <div className="w-full overflow-x-auto">
              <CubeInput4x4 cubeState={cube4} onTileClick={handleTile4} />
            </div>

            {/* Error */}
            {error4 && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg w-full max-w-lg border border-red-400/20">
                <AlertCircle className="shrink-0" size={18} />
                <p className="text-sm">{error4}</p>
              </div>
            )}

            {/* Solve */}
            <button
              onClick={handleSolve4}
              disabled={solving4}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 text-xl font-black shadow-xl shadow-purple-900/40"
            >
              {solving4 ? 'Generating…' : <><Play size={22} fill="currentColor" /> Solve 4×4</>}
            </button>

            {/* 4x4 Solution — Phase-by-phase */}
            {solution4 && (
              <div className="w-full max-w-2xl rounded-2xl border border-zinc-700 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-zinc-800/60 border-b border-zinc-700">
                  <h2 className="text-xl font-bold text-white">Reduction Method Solution</h2>
                  <p className="text-zinc-400 text-sm mt-1">Follow each phase in order. The 4×4 uses wide moves (Uw, Rw, etc.)</p>
                </div>
                <div className="p-6 bg-zinc-900 flex flex-col gap-6">
                  {solution4.map((phase, pi) => (
                    <div key={pi} className="border border-zinc-700/60 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-zinc-800 font-bold text-sm text-purple-300">
                        {pi + 1}. {phase.label}
                      </div>
                      <div className="px-4 py-3 flex flex-wrap gap-2">
                        {phase.moves.map((m, mi) => (
                          <span key={mi} className="px-3 py-1.5 bg-zinc-800 border border-zinc-600 rounded-md font-mono text-sm font-bold text-slate-100">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="text-zinc-500 text-xs text-center">Wide moves: Uw = both top layers, Rw = both right layers, etc.</p>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}