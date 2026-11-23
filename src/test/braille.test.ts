import { describe, it, expect } from "vitest";
import { charToDots, layout, generateSTL } from "@/lib/braille";

describe("braille", () => {
  it("maps letters case-insensitively and others to empty", () => {
    expect(charToDots("B")).toEqual([1, 2]);
    expect(charToDots("y")).toEqual([1, 3, 4, 5, 6]);
    expect(charToDots("7")).toEqual([]);
  });
  it("computes plate size", () => {
    expect(layout("BANHEIRO")).toMatchObject({ width: 74, height: 22, fits: true });
    expect(layout("a".repeat(70))).toMatchObject({ width: 90, height: 94, fits: true });
  });
  it("rejects plates over 100mm", () => {
    expect(layout("a".repeat(71)).fits).toBe(false);
  });
  it("emits base + 32 facets per dot", () => {
    const stl = generateSTL("b");
    expect((stl.match(/facet normal/g) ?? []).length).toBe(12 + 2 * 32);
  });
});
