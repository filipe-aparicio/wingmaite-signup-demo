precision highp float;
precision highp int;

varying vec2 vUV;

uniform vec2  u_res;          // canvas size in CSS px
uniform float u_softness;
uniform float u_warpAmp, u_waveFreq, u_gain;
uniform int   u_octaves, u_pointCount;

uniform vec2  u_points[8];
uniform vec3  u_colors[8];

// Noise-driven softness controls
uniform float u_softNoiseAmp;
uniform float u_softNoiseFreq;

// Jitter-proof phases driven by CPU integration
uniform float u_phase;
uniform float u_softPhase;

// --- Simplex noise (Ashima Arts, MIT License) ---
// Source: https://github.com/ashima/webgl-noise/blob/master/src/noise3D.glsl
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise3(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(
    permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
      i.x +
      vec4(0.0, i1.x, i2.x, 1.0)
  );

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(
    vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3))
  );
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(
    0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)),
    0.0
  );
  m = m * m;
  return 42.0 *
    dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// -------------------- utils --------------------
float hash1(float x) { return fract(sin(x * 127.1) * 43758.5453); }

// noisy sigma field (pixels) — uses 3D noise (x, y, tPhase)
// ASPECT-CORRECT: domain is normalized by min-dimension and de-skewed by aspect
float sigmaAt(vec2 px, int i) {
  float s = min(u_res.x, u_res.y);
  vec2 aspect = vec2(u_res.x / s, u_res.y / s);          // >=1 on long axis
  vec2 base = (px / s) * (u_softNoiseFreq / aspect);     // cycles per min-dim, equal on both axes

  float h = hash1(float(i) + 13.0);
  base += vec2(37.0 * h, -91.0 * h); // per-point phase offset (domain units)

  float t  = u_softPhase;                  // integrated phase (no jitter)
  float n  = snoise3(vec3(base, t));       // [-1,1]
  float nd = n * 0.5 + 0.5;                // [0,1]

  float sigma = u_softness * (1.0 + u_softNoiseAmp * (nd * 2.0 - 1.0));
  return max(0.0001, sigma);
}

// -------------------- fBM family (3D) --------------------
float turbulence1(vec2 p, float t, int octaves, float gain, float lac) {
  float a = 1.0, sum = 0.0;
  for (int i=0; i<16; i++) {
    if (i >= octaves) break;
    sum += a * abs(snoise3(vec3(p, t)));
    p *= lac;
    a *= gain;
  }
  return sum;
}
vec2 turb2(vec2 p, float t, int octaves, float gain, float lac) {
  return vec2(
    turbulence1(p + vec2(137.2, -91.7), t, octaves, gain, 2.0),
    turbulence1(p + vec2(-53.9, 204.8),  t, octaves, gain, 2.0)
  );
}

// -------------------- main --------------------
void main() {
  vec2 uv = vUV;                 // 0..1
  vec2 px = uv * u_res;          // pixel coords
  float s  = min(u_res.x, u_res.y);

  // ASPECT-CORRECT warp domain: equal cycles on both axes
  vec2 aspect = vec2(u_res.x / s, u_res.y / s);
  vec2 q = (px / s) * (u_waveFreq / aspect);

  float t = u_phase;             // integrated phase (no jitter)

  vec2 w = turb2(q, t, u_octaves, u_gain, 2.0);

  float ampPx = u_warpAmp * 0.06 * s;  // same semantics as before
  vec2 disp = w * ampPx;

  vec3 accum = vec3(0.0);
  float W = 0.0;

  for (int i = 0; i < 8; i++) {
    if (i >= u_pointCount) break;
    vec2 p = u_points[i];
    vec2 d = (px + disp) - p;

    float sigma = sigmaAt(px, i);
    float denom = 2.0 * sigma * sigma;

    float wgt = exp(-dot(d, d) / denom);
    vec3 col = u_colors[i];

    accum += col * wgt;
    W += wgt;
  }

  vec3 col = (W > 0.0) ? (accum / W) : vec3(1.0);
  gl_FragColor = vec4(col, 1.0);
}
