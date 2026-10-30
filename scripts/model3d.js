import { G as Group, B as Box3, V as Vector3, C as TextureLoader, N as NearestFilter, S as SRGBColorSpace, D as BufferGeometry, E as Float32BufferAttribute, M as Mesh, H as MeshLambertMaterial, I as DoubleSide } from "./vue.js";
import { J } from "./vue.js";
import { d as data } from "./data.js";
const bundle = data.models || { textures: [], models: {} };
const hasModel = (id) => !!bundle.models[id];
const FRAME = [
  [[1, 1, 0], [-1, 0, 0], [0, -1, 0], [0, 0, -1]],
  [[0, 1, 1], [1, 0, 0], [0, -1, 0], [0, 0, 1]],
  [[0, 1, 0], [0, 0, 1], [0, -1, 0], [-1, 0, 0]],
  [[1, 1, 1], [0, 0, -1], [0, -1, 0], [1, 0, 0]],
  [[0, 1, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]],
  [[0, 0, 1], [1, 0, 0], [0, 0, -1], [0, -1, 0]]
];
const loader = new TextureLoader();
const textures = /* @__PURE__ */ new Map();
function texture(i) {
  if (textures.has(i)) return textures.get(i);
  const entry = bundle.textures[i];
  const tex = loader.load(entry.src);
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  tex.generateMipmaps = false;
  tex.flipY = false;
  tex.colorSpace = SRGBColorSpace;
  if (entry.n) tex.repeat.set(1, 1 / entry.n);
  const out = { tex, entry };
  textures.set(i, out);
  return out;
}
function animate(ticks) {
  for (const { tex, entry } of textures.values()) {
    if (!entry.n) continue;
    const order = entry.o || [...Array(entry.n).keys()];
    const frame = order[Math.floor(ticks / (entry.ft || 1)) % order.length];
    tex.offset.y = frame / entry.n;
  }
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
function material(map) {
  return new MeshLambertMaterial({ map, transparent: true, alphaTest: 0.04, side: DoubleSide });
}
class Builder {
  constructor() {
    this.parts = /* @__PURE__ */ new Map();
  }
  part(t) {
    if (!this.parts.has(t)) this.parts.set(t, { pos: [], uv: [], nrm: [], idx: [] });
    return this.parts.get(t);
  }
  quad(t, corners, uvs, normal) {
    const p = this.part(t), base = p.pos.length / 3;
    for (let k = 0; k < 4; k++) {
      p.pos.push(...corners[k]);
      p.uv.push(...uvs[k]);
      p.nrm.push(...normal);
    }
    p.idx.push(base, base + 3, base + 2, base, base + 2, base + 1);
  }
  group() {
    const g = new Group();
    for (const [t, p] of this.parts) {
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(p.pos, 3));
      geo.setAttribute("uv", new Float32BufferAttribute(p.uv, 2));
      geo.setAttribute("normal", new Float32BufferAttribute(p.nrm, 3));
      geo.setIndex(p.idx);
      g.add(new Mesh(geo, material(texture(t).tex)));
    }
    return g;
  }
}
function cuboids(model) {
  const b = new Builder();
  for (const [fx, fy, fz, tx, ty, tz, rot, faces] of model.e) {
    const from = [fx, fy, fz], to = [tx, ty, tz];
    for (const [side, u1, v1, u2, v2, local, turn] of faces) {
      const [origin, du, dv, n] = FRAME[side];
      const unit = [origin, origin.map((o, k) => o + du[k]), origin.map((o, k) => o + du[k] + dv[k]), origin.map((o, k) => o + dv[k])];
      let corners = unit.map((c) => c.map((v, k) => from[k] + (to[k] - from[k]) * v));
      let normal = n;
      if (rot) {
        const [axis, angle, ox, oy, oz, rescale] = rot;
        corners = corners.map((c) => rotate(c, axis, angle, [ox, oy, oz], rescale));
        normal = rotate(n, axis, angle, [0, 0, 0], 0);
      }
      let uvs = [[u1, v1], [u2, v1], [u2, v2], [u1, v2]].map(([u, v]) => [u / 16, v / 16]);
      const q = (turn || 0) / 90 % 4;
      if (q) uvs = uvs.map((_, k) => uvs[(k - q + 4) % 4]);
      b.quad(model.t[local], corners, uvs, normal);
    }
  }
  return b.group();
}
function sprite(model) {
  const g = new Group();
  const layers = model.t;
  const { entry } = texture(layers[0]);
  const img = new Image();
  img.onload = () => {
    const w = entry.w, h = entry.h;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);
    const alpha = ctx.getImageData(0, 0, w, h).data;
    const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && alpha[(y * w + x) * 4 + 3] > 10;
    const b = new Builder();
    const px = 16 / w, py = 16 / h;
    const Z0 = 7.5, Z1 = 8.5;
    layers.forEach((t, li) => {
      const dz = li * 0.01;
      b.quad(t, [[0, 16, Z1 + dz], [16, 16, Z1 + dz], [16, 0, Z1 + dz], [0, 0, Z1 + dz]], [[0, 0], [1, 0], [1, 1], [0, 1]], [0, 0, 1]);
      b.quad(t, [[16, 16, Z0 - dz], [0, 16, Z0 - dz], [0, 0, Z0 - dz], [16, 0, Z0 - dz]], [[1, 0], [0, 0], [0, 1], [1, 1]], [0, 0, -1]);
    });
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!solid(x, y)) continue;
      const x0 = x * px, x1 = x0 + px, y1 = 16 - y * py, y0 = y1 - py;
      const uv = [(x + 0.5) / w, (y + 0.5) / h], uvs = [uv, uv, uv, uv];
      const t = layers[0];
      if (!solid(x, y - 1)) b.quad(t, [[x0, y1, Z0], [x1, y1, Z0], [x1, y1, Z1], [x0, y1, Z1]], uvs, [0, 1, 0]);
      if (!solid(x, y + 1)) b.quad(t, [[x0, y0, Z1], [x1, y0, Z1], [x1, y0, Z0], [x0, y0, Z0]], uvs, [0, -1, 0]);
      if (!solid(x - 1, y)) b.quad(t, [[x0, y1, Z0], [x0, y1, Z1], [x0, y0, Z1], [x0, y0, Z0]], uvs, [-1, 0, 0]);
      if (!solid(x + 1, y)) b.quad(t, [[x1, y1, Z1], [x1, y1, Z0], [x1, y0, Z0], [x1, y0, Z1]], uvs, [1, 0, 0]);
    }
    g.add(...b.group().children);
    g.dispatchEvent({ type: "built" });
  };
  img.src = entry.src;
  return g;
}
function build(id, size = 2.6) {
  var _a;
  const model = bundle.models[id];
  if (!model) return null;
  const raw = model.g ? sprite(model) : cuboids(model);
  const inner = new Group();
  const gui = (_a = model.d) == null ? void 0 : _a.gui;
  if (gui) {
    const [rx, ry, rz] = (gui.rotation || [0, 0, 0]).map((d) => d * Math.PI / 180);
    const pose = new Group();
    pose.rotation.set(rx, ry, rz, "XYZ");
    pose.scale.set(...gui.scale || [1, 1, 1]);
    raw.position.set(-8, -8, -8);
    pose.add(raw);
    inner.add(pose);
  } else {
    raw.position.set(-8, -8, -8);
    inner.add(raw);
  }
  raw.addEventListener("built", () => inner.dispatchEvent({ type: "built" }));
  const outer = new Group();
  outer.add(inner);
  const fit = () => {
    inner.position.set(0, 0, 0);
    inner.scale.setScalar(1);
    const box = new Box3().setFromObject(inner);
    if (box.isEmpty()) return;
    const centre = box.getCenter(new Vector3()), dims = box.getSize(new Vector3());
    const k = size / Math.max(dims.x, dims.y, dims.z * 0.6);
    inner.scale.setScalar(k);
    inner.position.copy(centre.multiplyScalar(-k));
  };
  fit();
  inner.addEventListener("built", fit);
  return outer;
}
function dispose(obj) {
  obj == null ? void 0 : obj.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });
}
export {
  J as THREE,
  animate,
  build,
  dispose,
  hasModel
};
