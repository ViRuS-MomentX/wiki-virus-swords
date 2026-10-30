import { d as data } from "./data.js";
const bundle = data.models || { textures: [], models: {} };
const FRAME = [
  [[1, 1, 0], [-1, 0, 0], [0, -1, 0], [0, 0, -1]],
  [[0, 1, 1], [1, 0, 0], [0, -1, 0], [0, 0, 1]],
  [[0, 1, 0], [0, 0, 1], [0, -1, 0], [-1, 0, 0]],
  [[1, 1, 1], [0, 0, -1], [0, -1, 0], [1, 0, 0]],
  [[0, 1, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]],
  [[0, 0, 1], [1, 0, 0], [0, 0, -1], [0, -1, 0]]
];
const MAX_CELLS = 4096;
const pixels = /* @__PURE__ */ new Map();
function pixelsOf(i) {
  if (!pixels.has(i)) {
    pixels.set(i, new Promise((done) => {
      const e = bundle.textures[i];
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = e.w;
        c.height = e.h;
        const x = c.getContext("2d");
        x.drawImage(img, 0, 0);
        done({ w: e.w, h: e.h, d: x.getImageData(0, 0, e.w, e.h).data });
      };
      img.onerror = () => done(null);
      img.src = e.src;
    }));
  }
  return pixels.get(i);
}
function texel(p, u, v) {
  const x = Math.min(p.w - 1, Math.max(0, Math.floor(u * p.w))), y = Math.min(p.h - 1, Math.max(0, Math.floor(v * p.h)));
  const k = (y * p.w + x) * 4;
  return [p.d[k], p.d[k + 1], p.d[k + 2], p.d[k + 3]];
}
function rotate(p, axis, deg, origin, rescale) {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  let x = p[0] - origin[0], y = p[1] - origin[1], z = p[2] - origin[2];
  if (axis === 0) [y, z] = [y * c - z * s, y * s + z * c];
  else if (axis === 1) [x, z] = [x * c + z * s, -x * s + z * c];
  else [x, y] = [x * c - y * s, x * s + y * c];
  if (rescale) {
    const k = 1 / Math.cos(Math.abs(a));
    if (axis !== 0) x *= k;
    if (axis !== 1) y *= k;
    if (axis !== 2) z *= k;
  }
  return [x + origin[0], y + origin[1], z + origin[2]];
}
function poser(gui) {
  const [rx, ry, rz] = (gui == null ? void 0 : gui.rotation) || [0, 0, 0];
  const [sx, sy, sz] = (gui == null ? void 0 : gui.scale) || [1, 1, 1];
  return (p, normal) => {
    let q = normal ? [...p] : [(p[0] - 8) * sx, (p[1] - 8) * sy, (p[2] - 8) * sz];
    q = rotate(q, 2, rz, [0, 0, 0], 0);
    q = rotate(q, 1, ry, [0, 0, 0], 0);
    q = rotate(q, 0, rx, [0, 0, 0], 0);
    return q;
  };
}
async function build(id, size = 2.6) {
  var _a;
  const model = bundle.models[id];
  if (!model) return null;
  const tex = await Promise.all(model.t.map(pixelsOf));
  const pose = poser((_a = model.d) == null ? void 0 : _a.gui);
  const quads = [];
  const add = (corners, normal, colour) => {
    const pts = corners.flatMap((c) => pose(c, false));
    let n = pose(normal, true);
    const l = Math.hypot(...n) || 1;
    n = n.map((v) => v / l);
    quads.push({ pts, n, c: colour });
  };
  if (model.g) {
    const p = tex[0];
    if (!p) return null;
    const solid = (x, y) => x >= 0 && y >= 0 && x < p.w && y < p.h && p.d[(y * p.w + x) * 4 + 3] > 10;
    const px = 16 / p.w, py = 16 / p.h, Z0 = 7.5, Z1 = 8.5;
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
      if (!solid(x, y)) continue;
      const k = (y * p.w + x) * 4, c = [p.d[k], p.d[k + 1], p.d[k + 2], p.d[k + 3]];
      const x0 = x * px, x1 = x0 + px, y1 = 16 - y * py, y0 = y1 - py;
      add([[x0, y1, Z1], [x1, y1, Z1], [x1, y0, Z1], [x0, y0, Z1]], [0, 0, 1], c);
      add([[x1, y1, Z0], [x0, y1, Z0], [x0, y0, Z0], [x1, y0, Z0]], [0, 0, -1], c);
      if (!solid(x, y - 1)) add([[x0, y1, Z0], [x1, y1, Z0], [x1, y1, Z1], [x0, y1, Z1]], [0, 1, 0], c);
      if (!solid(x, y + 1)) add([[x0, y0, Z1], [x1, y0, Z1], [x1, y0, Z0], [x0, y0, Z0]], [0, -1, 0], c);
      if (!solid(x - 1, y)) add([[x0, y1, Z0], [x0, y1, Z1], [x0, y0, Z1], [x0, y0, Z0]], [-1, 0, 0], c);
      if (!solid(x + 1, y)) add([[x1, y1, Z1], [x1, y1, Z0], [x1, y0, Z0], [x1, y0, Z1]], [1, 0, 0], c);
    }
  } else {
    for (const [fx, fy, fz, tx, ty, tz, rot, faces] of model.e) {
      const from = [fx, fy, fz], to = [tx, ty, tz];
      for (const [side, u1, v1, u2, v2, local, turn] of faces) {
        const p = tex[local];
        if (!p) continue;
        const [origin, du, dv, n] = FRAME[side];
        let uvs = [[u1, v1], [u2, v1], [u2, v2], [u1, v2]].map(([u, v]) => [u / 16, v / 16]);
        const q = (turn || 0) / 90 % 4;
        if (q) uvs = uvs.map((_, k) => uvs[(k - q + 4) % 4]);
        const uvAt = (a, b) => [0, 1].map((k) => uvs[0][k] * (1 - a) * (1 - b) + uvs[1][k] * a * (1 - b) + uvs[2][k] * a * b + uvs[3][k] * (1 - a) * b);
        const place = (a, b) => {
          let c = [0, 1, 2].map((k) => from[k] + (to[k] - from[k]) * (origin[k] + du[k] * a + dv[k] * b));
          if (rot) c = rotate(c, rot[0], rot[1], [rot[2], rot[3], rot[4]], rot[5]);
          return c;
        };
        const normal = rot ? rotate(n, rot[0], rot[1], [0, 0, 0], 0) : n;
        let nu = Math.max(1, Math.round(Math.abs(u2 - u1) * p.w / 16)), nv = Math.max(1, Math.round(Math.abs(v2 - v1) * p.h / 16));
        if (nu * nv <= 4) {
          let r = 0, g = 0, bl = 0, al = 0, cnt = 0;
          for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
            const [u, v] = uvAt((i + 0.5) / nu, (j + 0.5) / nv), t = texel(p, u, v);
            if (t[3] > 20) {
              r += t[0];
              g += t[1];
              bl += t[2];
              al += t[3];
              cnt++;
            }
          }
          if (cnt === nu * nv) {
            add([place(0, 0), place(1, 0), place(1, 1), place(0, 1)], normal, [r / cnt, g / cnt, bl / cnt, al / cnt]);
            continue;
          }
          if (!cnt) continue;
        }
        while (nu * nv > MAX_CELLS) {
          nu = Math.ceil(nu / 2);
          nv = Math.ceil(nv / 2);
        }
        for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
          const [u, v] = uvAt((i + 0.5) / nu, (j + 0.5) / nv), t = texel(p, u, v);
          if (t[3] <= 20) continue;
          const a0 = i / nu, a1 = (i + 1) / nu, b0 = j / nv, b1 = (j + 1) / nv;
          add([place(a0, b0), place(a1, b0), place(a1, b1), place(a0, b1)], normal, [t[0], t[1], t[2], t[3]]);
        }
      }
    }
  }
  if (!quads.length) return null;
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const q of quads) for (let k = 0; k < 12; k++) {
    const a = k % 3;
    lo[a] = Math.min(lo[a], q.pts[k]);
    hi[a] = Math.max(hi[a], q.pts[k]);
  }
  const mid = lo.map((v, a) => (v + hi[a]) / 2);
  const s = size / Math.max(hi[0] - lo[0], hi[1] - lo[1], (hi[2] - lo[2]) * 0.6);
  for (const q of quads) for (let k = 0; k < 12; k++) q.pts[k] = (q.pts[k] - mid[k % 3]) * s;
  return quads;
}
const D = 7.2, TAN = Math.tan(15 * Math.PI / 180);
function draw(ctx, w, h, quads, yaw, lift = 0, grow = 1) {
  ctx.clearRect(0, 0, w, h);
  const c = Math.cos(yaw), s = Math.sin(yaw), f = h / 2 / TAN;
  const out = [];
  for (const q of quads) {
    const sp = new Array(8);
    let depth = 0;
    for (let k = 0; k < 4; k++) {
      const x = q.pts[k * 3] * grow, y = q.pts[k * 3 + 1] * grow + lift, z = q.pts[k * 3 + 2] * grow;
      const rx = x * c + z * s, rz = -x * s + z * c;
      const d = D - rz;
      sp[k * 2] = w / 2 + rx * f / d;
      sp[k * 2 + 1] = h / 2 - (y - 0.1) * f / d;
      depth += d;
    }
    const nx = q.n[0] * c + q.n[2] * s, nz = -q.n[0] * s + q.n[2] * c, ny = q.n[1];
    const light = Math.min(1.12, 0.62 + 0.34 * Math.max(0, nz) + 0.22 * Math.max(0, ny) + 0.14 * Math.max(0, -nz) + 0.08 * Math.max(0, -nx));
    const a = (q.c[3] ?? 255) / 255;
    out.push({ sp, depth, solid: a > 0.95, col: `rgba(${Math.min(255, q.c[0] * light) | 0},${Math.min(255, q.c[1] * light) | 0},${Math.min(255, q.c[2] * light) | 0},${a.toFixed(3)})` });
  }
  out.sort((a, b) => b.depth - a.depth);
  ctx.lineJoin = "round";
  ctx.lineWidth = 0.6;
  for (const o of out) {
    const p = o.sp;
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(p[2], p[3]);
    ctx.lineTo(p[4], p[5]);
    ctx.lineTo(p[6], p[7]);
    ctx.closePath();
    ctx.fillStyle = o.col;
    ctx.fill();
    if (o.solid) {
      ctx.strokeStyle = o.col;
      ctx.stroke();
    }
  }
}
export {
  build,
  draw
};
