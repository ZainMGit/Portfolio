import { Renderer, Program, Mesh, Color, Triangle } from 'https://esm.sh/ogl@1.0.11';

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {\
  int index = 0;\
  for (int i = 0; i < 2; i++) {\
     ColorStop currentColor = colors[i];\
     bool isInBetween = currentColor.position <= factor;\
     index = int(mix(float(index), float(i), float(isInBetween)));\
  }\
  ColorStop currentColor = colors[index];\
  ColorStop nextColor = colors[index + 1];\
  float range = nextColor.position - currentColor.position;\
  float lerpFactor = (factor - currentColor.position) / range;\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor);\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float flowX = uv.x * 2.2 + uTime * 1.2;
  float flowY = uTime * 0.9 + sin(uv.x * 6.2831 + uTime * 0.35) * 0.15;
  float height = snoise(vec2(flowX, flowY)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 1.15 * height;

  float midPoint = 0.08;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  gl_FragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

function toRgbStops(stops) {
  return stops.map((hex) => {
    const c = new Color(hex);
    return [c.r, c.g, c.b];
  });
}

function initAurora(container, options = {}) {
  if (!container) return;

  const settings = {
    colorStops: options.colorStops || ['#7cff67', '#B19EEF', '#5227FF'],
    amplitude: options.amplitude ?? 1.0,
    blend: options.blend ?? 0.5,
    speed: options.speed ?? 1.0
  };

  const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.canvas.style.backgroundColor = 'transparent';

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) delete geometry.attributes.uv;

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: settings.amplitude },
      uColorStops: { value: toRgbStops(settings.colorStops) },
      uResolution: { value: [container.offsetWidth, container.offsetHeight] },
      uBlend: { value: settings.blend }
    }
  });

  const colorStopsRgb = toRgbStops(settings.colorStops);

  const mesh = new Mesh(gl, { geometry, program });
  container.appendChild(gl.canvas);

  const resize = () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [width, height];
  };

  let rafId = 0;
  const tick = (t) => {
    rafId = requestAnimationFrame(tick);
    // Match the original React timing so motion is visibly continuous.
    program.uniforms.uTime.value = t * 0.001 * settings.speed;
    program.uniforms.uAmplitude.value = settings.amplitude;
    program.uniforms.uBlend.value = settings.blend;
    program.uniforms.uColorStops.value = colorStopsRgb;
    renderer.render({ scene: mesh });
  };

  window.addEventListener('resize', resize);
  resize();
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

const target = document.querySelector('.aurora-container');
try {
  initAurora(target, {
    colorStops: ['#7cff67', '#B19EEF', '#5227FF'],
    blend: 1.0,
    amplitude: 2.2,
    speed: 1.8
  });
} catch (error) {
  if (target) {
    target.dataset.auroraFallback = '1';
  }
  console.warn('Aurora WebGL init failed, fallback remains active.', error);
}
