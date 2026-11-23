export const BRAILLE_MAP: Record<string, number[]> = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5], f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5],
  k: [1, 3], l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5], p: [1, 2, 3, 4], q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6], y: [1, 3, 4, 5, 6], z: [1, 3, 5, 6],
};

export const MAX_CHARS = 144;
export const MAX_SIZE_MM = 100;
export const COLS_PER_LINE = 10;

export function charToDots(ch: string): number[] {
  return BRAILLE_MAP[ch.toLowerCase()] ?? [];
}

export function layout(text: string) {
  const n = Math.max(text.length, 1);
  const cols = Math.min(n, COLS_PER_LINE);
  const rows = Math.ceil(n / COLS_PER_LINE);
  const width = cols * 8 + 10;
  const height = rows * 12 + 10;
  return { cols, rows, width, height, fits: width <= MAX_SIZE_MM && height <= MAX_SIZE_MM };
}

type V = [number, number, number];
const f = (n: number) => n.toFixed(4);

function facet(a: V, b: V, c: V): string {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let nx = u[1]! * v[2]! - u[2]! * v[1]!, ny = u[2]! * v[0]! - u[0]! * v[2]!, nz = u[0]! * v[1]! - u[1]! * v[0]!;
  const l = Math.hypot(nx, ny, nz) || 1;
  nx /= l; ny /= l; nz /= l;
  return ` facet normal ${f(nx)} ${f(ny)} ${f(nz)}\n  outer loop\n   vertex ${a.map(f).join(" ")}\n   vertex ${b.map(f).join(" ")}\n   vertex ${c.map(f).join(" ")}\n  endloop\n endfacet\n`;
}

function box(w: number, h: number, t: number): string {
  const p: V[] = [[0,0,0],[w,0,0],[w,h,0],[0,h,0],[0,0,t],[w,0,t],[w,h,t],[0,h,t]];
  const q = (a: number, b: number, c: number, d: number) => facet(p[a]!, p[b]!, p[c]!) + facet(p[a]!, p[c]!, p[d]!);
  return q(0,3,2,1) + q(4,5,6,7) + q(0,1,5,4) + q(1,2,6,5) + q(2,3,7,6) + q(3,0,4,7);
}

function prism(cx: number, cy: number, z0: number, r: number, hgt: number, sides = 8): string {
  let s = "";
  const z1 = z0 + hgt;
  for (let i = 0; i < sides; i++) {
    const a0 = (i / sides) * Math.PI * 2, a1 = ((i + 1) / sides) * Math.PI * 2;
    const p0: V = [cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0];
    const p1: V = [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z0];
    const q0: V = [p0[0], p0[1], z1], q1: V = [p1[0], p1[1], z1];
    s += facet(p0, p1, q1) + facet(p0, q1, q0);
    s += facet([cx, cy, z1], q0, q1);
    s += facet([cx, cy, z0], p1, p0);
  }
  return s;
}

// Dot offsets within a 6x10mm cell (dots 1-3 left column top→bottom, 4-6 right)
const DOT_POS: Record<number, [number, number]> = {
  1: [1.5, 2.5], 2: [1.5, 5], 3: [1.5, 7.5], 4: [4.5, 2.5], 5: [4.5, 5], 6: [4.5, 7.5],
};

export function generateSTL(text: string): string {
  const { width, height } = layout(text);
  let out = "solid braille3d\n" + box(width, height, 2);
  [...text].forEach((ch, idx) => {
    const col = idx % COLS_PER_LINE, row = Math.floor(idx / COLS_PER_LINE);
    const cellX = 5 + col * 8;
    const cellTop = height - 5 - row * 12; // first line at top
    for (const d of charToDots(ch)) {
      const [dx, dy] = DOT_POS[d]!;
      out += prism(cellX + dx, cellTop - dy, 2, 0.75, 0.5);
    }
  });
  return out + "endsolid braille3d\n";
}
