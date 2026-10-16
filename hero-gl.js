/* Hero WebGL field. Binance palette: #0B0E11 bg, #F0B90B / #FCD535 light. */
(() => {
  const canvas = document.getElementById("bnbgl");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) {
    canvas.closest(".hero")?.classList.add("no-gl");
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

  const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_ptr;
uniform float u_scroll;
uniform float u_textside;

float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), u.x),
             mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.55;
  for(int i=0;i<3;i++){ v += a*vnoise(p); p = p*2.13 + 17.7; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  vec2 par = u_ptr * 0.03;

  vec3 col = mix(vec3(0.033,0.043,0.055), vec3(0.062,0.075,0.094), clamp(uv.y*0.6+0.5,0.,1.));

  float energy = fbm(uv*1.4 + par*2.0 + vec2(u_time*0.035, -u_time*0.02));
  energy = smoothstep(0.35, 0.85, energy);

  vec2 q = mat2(0.7071, -0.7071, 0.7071, 0.7071) * (uv + par);
  float scale = 7.0;
  vec2 g = abs(fract(q*scale) - 0.5);
  float dist = min(g.x, g.y) / scale;
  float aa = 1.5 / u_res.y;
  float line = 1.0 - smoothstep(0.0008, 0.0008 + aa*2.0, dist);
  vec2 q2 = mat2(0.7071, -0.7071, 0.7071, 0.7071) * (uv + par*1.8) * 2.6 + 3.3;
  vec2 g2 = abs(fract(q2) - 0.5);
  float line2 = 1.0 - smoothstep(0.0018, 0.0018 + aa*3.0, min(g2.x, g2.y)/2.6);

  vec3 yellow = vec3(0.941,0.725,0.043);
  vec3 bright = vec3(0.988,0.835,0.208);

  vec3 acc = vec3(0.0);
  acc += yellow * line  * (0.05 + energy*0.55);
  acc += yellow * line2 * (0.03 + energy*0.22);

  vec2 cell = abs(fract(q*scale + 0.5) - 0.5);
  float node = 1.0 - smoothstep(0.02, 0.08, max(cell.x, cell.y));
  acc += bright * node * energy * 0.5;

  vec2 gpos = vec2(0.62 + sin(u_time*0.11)*0.05 - par.x*2.0, -0.05 + cos(u_time*0.09)*0.05);
  float glow = exp(-2.6*dot(uv-gpos, uv-gpos));
  acc += yellow * glow * 0.16;

  vec2 dp = uv*22.0 + vec2(0.0, u_time*0.12) + par*6.0;
  vec2 did = floor(dp);
  float dr = h21(did);
  if (dr < 0.06) {
    float tw = 0.5 + 0.5*sin(u_time*(0.6+dr*4.0) + dr*40.0);
    float d = length(fract(dp)-0.5);
    acc += bright * smoothstep(0.06,0.0,d) * tw * 0.5;
  }

  float mask;
  if (u_textside > 0.5) { mask = mix(0.25, 1.0, smoothstep(-0.85, 0.1, uv.x)); }
  else { mask = mix(0.3, 1.0, clamp(abs(uv.y)*1.2, 0.0, 1.0)); }
  acc *= mask;
  acc *= (1.0 - u_scroll*0.9);
  col += acc;

  float v = 1.0 - dot(uv*vec2(0.72,0.9), uv*vec2(0.72,0.9))*0.5;
  col *= v;

  gl_FragColor = vec4(col, 1.0);
}`;

  function shader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  const vs = shader(gl.VERTEX_SHADER, VERT);
  const fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    canvas.closest(".hero")?.classList.add("no-gl");
    return;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n) => gl.getUniformLocation(prog, n);
  const uRes = U("u_res");
  const uTime = U("u_time");
  const uPtr = U("u_ptr");
  const uScroll = U("u_scroll");
  const uSide = U("u_textside");

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.round(r.width * DPR);
    canvas.height = Math.round(r.height * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uSide, window.innerWidth > 960 ? 1 : 0);
  }
  resize();
  window.addEventListener("resize", resize);

  let tx = 0, ty = 0, px = 0, py = 0;
  window.addEventListener("pointermove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  const t0 = performance.now();
  function frame() {
    if (!running) return;
    const t = reduced ? 20 : (performance.now() - t0) / 1000;
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    const rect = canvas.parentElement.getBoundingClientRect();
    const prog01 = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uPtr, px, py);
    gl.uniform1f(uScroll, prog01);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduced) requestAnimationFrame(frame);
  }
  frame();
})();
