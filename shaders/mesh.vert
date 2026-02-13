precision highp float;
precision highp int;
attribute vec3 aPosition;     // <-- p5 attribute name
varying vec2 vUV;
void main() {
  vUV = (aPosition.xy + 1.0) * 0.5;
  gl_Position = vec4(aPosition, 1.0);
}
