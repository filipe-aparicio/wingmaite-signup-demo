'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import chroma from 'chroma-js';
import vertSrc from '@/shaders/mesh.vert';
import fragSrc from '@/shaders/mesh.frag';
import { cn } from '@/lib/utils';

type StarlingFlowProps = {
  colors?: string[];
  speed?: number;
  waveSpeed?: number;
  softNoiseSpeed?: number;
  softness?: number;
  width?: number;
  height?: number;
  className?: string;
};

const DEFAULT_COLORS = ['#FFC8A5', '#FFA26D', '#FF4809', '#CBC9FC'];
const DEFAULT_SPEED = 0.2;
const DEFAULT_WAVE_SPEED = 0.5;
const DEFAULT_SOFTNESS = 60;
const MAX_POINTS = 8;
const BASE_S = 150;

const CONFIG = {
  warpAmp: 6,
  waveFreq: 1,
  waveOctaves: 1.3,
  waveGain: 1,
  softNoiseAmp: 1,
  softNoiseFreq: 1,
  softNoiseSpeed: 0.1,
  lerp: { color: 2, param: 4 },
  phaseBump: {
    warpFromWaveSpeed: 10,
    warpFromPointSpeed: 5,
    softFromSoftSpeed: 20,
    decay: 6,
    maxWarpBoost: 5,
    maxSoftBoost: 5,
  },
};

const COLOR_MIX_SPACE: 'oklab' | 'oklch' = 'oklab';

type RgbColor = [number, number, number];

type InitialSketchProps = {
  colors: string[];
  speed: number;
  waveSpeed: number;
  softNoiseSpeed: number;
  softness: number;
};

type Pt = {
  pos: { x: number; y: number };
  a: number;
  r: number;
  i: number;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function hexToRgb(hex: string): RgbColor {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// ---- Resolution scaling helper --------------------------------------------

// Scale internal render resolution based on canvas CSS size.
// Small elements (buttons, small cards) => full res.
// Medium sections => 0.75.
// Large hero/footer backgrounds => 0.5.
function computeQuality(width: number, height: number): number {
  const area = width * height;

  // Very small elements (e.g. 48x48, 135x40, etc.)
  if (area <= 150_000) return 1.0;

  // Medium sections (e.g. ~800x600, small blocks)
  if (area <= 800_000) return 0.75;

  // Large sections / footers / heroes
  return 0.5;
}

// ---- WebGL helpers ---------------------------------------------------------

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info || ''}`);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSource: string,
  fragSource: string,
) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragSource);
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    throw new Error(`Program link error: ${info || ''}`);
  }

  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

// ---- Core engine -----------------------------------------------------------

function createMeshEngine(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  canvasId: string,
  initial: InitialSketchProps,
) {
  const program = createProgram(gl, vertSrc, fragSrc);
  gl.useProgram(program);

  const positionLoc = gl.getAttribLocation(program, 'aPosition');
  const uRes = gl.getUniformLocation(program, 'u_res');
  const uSoftness = gl.getUniformLocation(program, 'u_softness');
  const uPhase = gl.getUniformLocation(program, 'u_phase');
  const uSoftPhase = gl.getUniformLocation(program, 'u_softPhase');
  const uSoftNoiseAmp = gl.getUniformLocation(program, 'u_softNoiseAmp');
  const uSoftNoiseFreq = gl.getUniformLocation(program, 'u_softNoiseFreq');
  const uWarpAmp = gl.getUniformLocation(program, 'u_warpAmp');
  const uWaveFreq = gl.getUniformLocation(program, 'u_waveFreq');
  const uOctaves = gl.getUniformLocation(program, 'u_octaves');
  const uGain = gl.getUniformLocation(program, 'u_gain');
  const uPointCount = gl.getUniformLocation(program, 'u_pointCount');

  const uPoints = gl.getUniformLocation(program, 'u_points[0]');
  const uColors = gl.getUniformLocation(program, 'u_colors[0]');

  // Fullscreen quad [-1,1]
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw new Error('Failed to create buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

  const initialColors = initial.colors.slice(0, MAX_POINTS);
  const state = {
    colors: initialColors.map(hexToRgb) as RgbColor[],
    curColors: initialColors.map(hexToRgb) as RgbColor[],

    targetSpeed: Math.max(0, initial.speed),
    curSpeed: Math.max(0, initial.speed),

    targetWaveSpeed: initial.waveSpeed,
    curWaveSpeed: initial.waveSpeed,

    targetSoftSpeed: Math.max(0, initial.softNoiseSpeed),
    curSoftSpeed: Math.max(0, initial.softNoiseSpeed),
    softness: Math.max(0, initial.softness),

    prevTargetSpeed: Math.max(0, initial.speed),
    prevTargetWaveSpeed: initial.waveSpeed,
    prevTargetSoftSpeed: Math.max(0, initial.softNoiseSpeed),

    warpPhase: Math.random() * 1000,
    softPhase: Math.random() * 1000,

    warpBoostVel: (Math.random() * 2 - 1) * CONFIG.phaseBump.maxWarpBoost,
    softBoostVel: (Math.random() * 2 - 1) * CONFIG.phaseBump.maxSoftBoost,

    // CSS-space resolution (for consistent visual scale,
    // independent of internal render resolution)
    cssWidth: 1,
    cssHeight: 1,
  };

  const pts: Pt[] = [];

  function initPoints(cssWidth: number, cssHeight: number) {
    pts.length = 0;
    const count = Math.min(state.colors.length, MAX_POINTS);
    const s = Math.min(cssWidth, cssHeight);
    const cx = cssWidth * 0.5;
    const cy = cssHeight * 0.5;

    for (let i = 0; i < count; i++) {
      pts.push({
        pos: { x: cx, y: cy },
        a: Math.random() * Math.PI * 2,
        r: s * (0.15 + Math.random() * 0.45),
        i,
      });
    }
  }

  function updatePoints(
    cssWidth: number,
    cssHeight: number,
    t: number,
    dt: number,
  ) {
    const s = Math.min(cssWidth, cssHeight);
    const cx = cssWidth * 0.5;
    const cy = cssHeight * 0.5;
    const aspect =
      cssWidth >= cssHeight
        ? { x: cssWidth / cssHeight, y: 1 }
        : { x: 1, y: cssHeight / cssWidth };

    for (const p of pts) {
      // keep angular velocity consistent across frame rates (60fps baseline)
      p.a += 0.2 * state.curSpeed * Math.sin(t * 0.3 + p.i) * dt * 60;
      const rNorm = (Math.sin(t * 0.5 + p.i) + 1.0) * 0.5;
      p.r = s * (0.15 + rNorm * 0.45);
      const r = p.r;
      p.pos.x = cx + Math.cos(p.a) * r * aspect.x;
      p.pos.y = cy + Math.sin(p.a) * r * aspect.y;
    }
  }

  // cssWidth / cssHeight are CSS px (logical),
  // internal canvas size is scaled by DPR * quality for performance.
  function resize(cssWidth: number, cssHeight: number) {
    state.cssWidth = Math.max(1, cssWidth);
    state.cssHeight = Math.max(1, cssHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const quality = computeQuality(cssWidth, cssHeight);

    const internalW = Math.max(1, Math.round(cssWidth * dpr * quality));
    const internalH = Math.max(1, Math.round(cssHeight * dpr * quality));

    canvas.width = internalW;
    canvas.height = internalH;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.id = canvasId;

    gl.viewport(0, 0, internalW, internalH);
    initPoints(state.cssWidth, state.cssHeight);
  }

  function updateProps(props: {
    colors?: string[];
    speed?: number;
    waveSpeed?: number;
    softNoiseSpeed?: number;
    softness?: number;
  }) {
    if (props.colors) {
      const next = props.colors.slice(0, MAX_POINTS).map(hexToRgb);
      const lenChanged = next.length !== state.colors.length;
      state.colors = next;
      if (lenChanged) state.curColors = next.map(c => [...c] as RgbColor);
    }

    if (typeof props.speed === 'number') {
      const newTarget = Math.max(0, props.speed);
      const d = newTarget - state.prevTargetSpeed;
      if (d !== 0) {
        state.warpBoostVel = clamp(
          state.warpBoostVel +
            Math.abs(d) * CONFIG.phaseBump.warpFromPointSpeed,
          -CONFIG.phaseBump.maxWarpBoost,
          CONFIG.phaseBump.maxWarpBoost,
        );
        state.prevTargetSpeed = newTarget;
      }
      state.targetSpeed = newTarget;
    }

    if (typeof props.waveSpeed === 'number') {
      const newTarget = props.waveSpeed;
      const d = newTarget - state.prevTargetWaveSpeed;
      if (d !== 0) {
        state.warpBoostVel = clamp(
          state.warpBoostVel + Math.abs(d) * CONFIG.phaseBump.warpFromWaveSpeed,
          -CONFIG.phaseBump.maxWarpBoost,
          CONFIG.phaseBump.maxWarpBoost,
        );
        state.prevTargetWaveSpeed = newTarget;
      }
      state.targetWaveSpeed = newTarget;
    }

    if (typeof props.softNoiseSpeed === 'number') {
      const newTarget = Math.max(0, props.softNoiseSpeed);
      const d = newTarget - state.prevTargetSoftSpeed;
      if (d !== 0) {
        state.softBoostVel = clamp(
          state.softBoostVel + Math.abs(d) * CONFIG.phaseBump.softFromSoftSpeed,
          -CONFIG.phaseBump.maxSoftBoost,
          CONFIG.phaseBump.maxSoftBoost,
        );
        state.prevTargetSoftSpeed = newTarget;
      }
      state.targetSoftSpeed = newTarget;
    }

    if (typeof props.softness === 'number') {
      state.softness = Math.max(0, props.softness);
    }
  }

  function step(dt: number, t: number) {
    const kColor = 1 - Math.exp(-CONFIG.lerp.color * dt);
    const kParam = 1 - Math.exp(-CONFIG.lerp.param * dt);

    const targetLen = state.colors.length;
    if (state.curColors.length !== targetLen) {
      state.curColors = state.colors.map(c => [...c] as RgbColor);
    }

    for (let i = 0; i < targetLen; i++) {
      const cur = state.curColors[i];
      const tgt = state.colors[i];
      const mixed = chroma
        .mix(
          chroma.gl(cur[0], cur[1], cur[2]),
          chroma.gl(tgt[0], tgt[1], tgt[2]),
          kColor,
          COLOR_MIX_SPACE,
        )
        .gl();
      cur[0] = mixed[0];
      cur[1] = mixed[1];
      cur[2] = mixed[2];
    }

    state.curSpeed += (state.targetSpeed - state.curSpeed) * kParam;
    state.curWaveSpeed += (state.targetWaveSpeed - state.curWaveSpeed) * kParam;
    state.curSoftSpeed += (state.targetSoftSpeed - state.curSoftSpeed) * kParam;

    const decayK = Math.exp(-CONFIG.phaseBump.decay * dt);
    state.warpBoostVel *= decayK;
    state.softBoostVel *= decayK;

    state.warpPhase += (state.curWaveSpeed + state.warpBoostVel) * dt;
    state.softPhase += (state.curSoftSpeed + state.softBoostVel) * dt;

    if (state.warpPhase > 1e6) state.warpPhase -= 1e6;
    if (state.softPhase > 1e6) state.softPhase -= 1e6;

    updatePoints(state.cssWidth, state.cssHeight, t, dt);

    // --- uniforms + draw ---------------------------------------------------
    gl.useProgram(program);
    gl.disable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const W = state.cssWidth;
    const H = state.cssHeight;
    const s = Math.min(W, H);
    const softnessPx = state.softness * (s / BASE_S);

    if (uRes) gl.uniform2f(uRes, W, H);
    if (uSoftness) gl.uniform1f(uSoftness, softnessPx);
    if (uPhase) gl.uniform1f(uPhase, state.warpPhase);
    if (uSoftPhase) gl.uniform1f(uSoftPhase, state.softPhase);
    if (uSoftNoiseAmp) gl.uniform1f(uSoftNoiseAmp, CONFIG.softNoiseAmp);
    if (uSoftNoiseFreq) gl.uniform1f(uSoftNoiseFreq, CONFIG.softNoiseFreq);
    if (uWarpAmp) gl.uniform1f(uWarpAmp, CONFIG.warpAmp);
    if (uWaveFreq) gl.uniform1f(uWaveFreq, CONFIG.waveFreq);
    if (uOctaves) {
      gl.uniform1i(
        uOctaves,
        Math.max(1, Math.min(8, Math.floor(CONFIG.waveOctaves))),
      );
    }
    if (uGain) gl.uniform1f(uGain, CONFIG.waveGain);

    const count = Math.min(state.curColors.length, MAX_POINTS);

    const pxy = new Float32Array(MAX_POINTS * 2);
    for (let i = 0; i < MAX_POINTS; i++) {
      if (i < count) {
        pxy[i * 2 + 0] = pts[i].pos.x;
        pxy[i * 2 + 1] = pts[i].pos.y;
      } else {
        pxy[i * 2 + 0] = 0;
        pxy[i * 2 + 1] = 0;
      }
    }

    const rgb = new Float32Array(MAX_POINTS * 3);
    for (let i = 0; i < MAX_POINTS; i++) {
      if (i < count) {
        const c = state.curColors[i];
        rgb[i * 3 + 0] = c[0];
        rgb[i * 3 + 1] = c[1];
        rgb[i * 3 + 2] = c[2];
      } else {
        rgb[i * 3 + 0] = 1;
        rgb[i * 3 + 1] = 1;
        rgb[i * 3 + 2] = 1;
      }
    }

    if (uPointCount) gl.uniform1i(uPointCount, count);
    if (uPoints) gl.uniform2fv(uPoints, pxy);
    if (uColors) gl.uniform3fv(uColors, rgb);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function dispose() {
    gl.deleteProgram(program);
    gl.deleteBuffer(positionBuffer);
  }

  return { resize, updateProps, step, dispose };
}

// ---- React wrapper ---------------------------------------------------------

export default function StarlingFlow({
  colors = DEFAULT_COLORS,
  speed = DEFAULT_SPEED,
  waveSpeed = DEFAULT_WAVE_SPEED,
  softNoiseSpeed = CONFIG.softNoiseSpeed,
  softness = DEFAULT_SOFTNESS,
  width,
  height,
  className,
}: StarlingFlowProps) {
  const reactId = useId();
  const canvasId = useMemo(() => `mesh-gradient-${reactId}`, [reactId]);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shouldRender, setShouldRender] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const propsRef = useRef({
    colors,
    speed,
    waveSpeed,
    softNoiseSpeed,
    softness,
  });
  useEffect(() => {
    propsRef.current = { colors, speed, waveSpeed, softNoiseSpeed, softness };
  }, [colors, speed, waveSpeed, softNoiseSpeed, softness]);

  // Reduced motion preference
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Initial "preload when near viewport" observer
  useEffect(() => {
    if (reducedMotion) return;
    const node = hostRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Track CSS size of host
  useEffect(() => {
    if (reducedMotion) return;
    const node = hostRef.current;
    if (!node) return;

    const update = () => {
      const w = Math.max(1, Math.round(node.clientWidth || 0));
      const h = Math.max(1, Math.round(node.clientHeight || 0));
      setSize(prev => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target !== node) continue;
          const w = Math.max(1, Math.round(entry.contentRect.width));
          const h = Math.max(1, Math.round(entry.contentRect.height));
          setSize(prev =>
            prev && prev.w === w && prev.h === h ? prev : { w, h },
          );
        }
      });
      ro.observe(node);
      update();
      return () => ro.disconnect();
    }

    update();
  }, [reducedMotion]);

  const canvasWidth = width ?? size?.w ?? BASE_S;
  const canvasHeight = height ?? size?.h ?? BASE_S;

  // WebGL setup + loop + pause/resume
  useEffect(() => {
    if (!shouldRender || reducedMotion) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;

    let engine = createMeshEngine(gl, canvas, canvasId, {
      colors,
      speed,
      waveSpeed,
      softNoiseSpeed,
      softness,
    });

    engine.resize(canvasWidth, canvasHeight);
    engine.updateProps(propsRef.current);

    let frameId = 0;
    let last = performance.now();
    const playingRef = { current: false };

    const loop = (time: number) => {
      if (!playingRef.current) return;
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      engine.updateProps(propsRef.current);
      engine.step(dt, time / 1000);
      frameId = requestAnimationFrame(loop);
    };

    const startRAF = () => {
      if (playingRef.current) return;
      playingRef.current = true;
      last = performance.now();
      frameId = requestAnimationFrame(loop);
    };

    const stopRAF = () => {
      playingRef.current = false;
      if (frameId) cancelAnimationFrame(frameId);
    };

    // Visibility-based pause/resume (viewport)
    const visObs = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        startRAF();
      } else {
        stopRAF();
      }
    });
    visObs.observe(host);

    // Tab visibility pause/resume
    const handleVisibility = () => {
      if (document.hidden) {
        stopRAF();
      } else {
        // Check viewport visibility manually
        const rect = host.getBoundingClientRect();
        const isVisible =
          rect.bottom >= 0 &&
          rect.right >= 0 &&
          rect.top <= window.innerHeight &&
          rect.left <= window.innerWidth;

        if (isVisible) {
          startRAF();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopRAF();
      visObs.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      engine.dispose();
      // @ts-expect-error allow GC
      engine = null;
    };
  }, [shouldRender, reducedMotion, canvasWidth, canvasHeight, canvasId]);

  return (
    <div ref={hostRef} className={cn('h-full w-full', className)}>
      {!reducedMotion && shouldRender ? (
        <canvas ref={canvasRef} className="h-full w-full pointer-events-none" />
      ) : null}
    </div>
  );
}
