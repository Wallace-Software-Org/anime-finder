import { describe, it, expect } from "vitest";
import { buildUserMessage, EXPERIENCE_MAP } from "@/app/lib/prompts";
import type { MoodValue, ThemeValue, EraValue } from "@/app/lib/types";

describe("EXPERIENCE_MAP", () => {
  it("contains all four experience levels", () => {
    expect(Object.keys(EXPERIENCE_MAP)).toEqual([
      "beginner",
      "casual",
      "seasoned",
      "veteran",
    ]);
  });

  it("each level maps to a non-empty string", () => {
    Object.values(EXPERIENCE_MAP).forEach((val) => {
      expect(typeof val).toBe("string");
      expect(val.length).toBeGreaterThan(0);
    });
  });
});

describe("buildUserMessage", () => {
  const base = {
    experience: "seasoned" as const,
    mood: ["intense"] as MoodValue[],
    themes: ["power-and-ambition"] as ThemeValue[],
    commitment: "short" as const,
    era: ["any"] as EraValue[],
    exclude: [] as string[],
  };

  it("includes the experience instruction in output", () => {
    const msg = buildUserMessage(base);
    expect(msg).toContain(EXPERIENCE_MAP.seasoned);
  });

  it("includes mood in output", () => {
    const msg = buildUserMessage(base);
    expect(msg).toContain("intense");
  });

  it("enforces short episode constraint", () => {
    const msg = buildUserMessage({ ...base, commitment: "short" });
    expect(msg).toContain("26 episodes or fewer");
  });

  it("enforces long episode constraint", () => {
    const msg = buildUserMessage({ ...base, commitment: "long" as const });
    expect(msg).toContain("27 episodes or more");
  });

  it("skips era constraint when any is selected", () => {
    const msg = buildUserMessage({ ...base, era: ["any"] as EraValue[] });
    expect(msg).toContain("any (no restriction)");
  });

  it("includes specific era when decade is selected", () => {
    const msg = buildUserMessage({ ...base, era: ["2000s"] as EraValue[] });
    expect(msg).toContain("2000s");
    expect(msg).not.toContain("any (no restriction)");
  });

  it("falls back to seasoned when experience is empty string", () => {
    const msg = buildUserMessage({ ...base, experience: "" as const });
    expect(msg).toContain(EXPERIENCE_MAP.seasoned);
  });

  it("includes exclude list when provided", () => {
    const msg = buildUserMessage({
      ...base,
      exclude: ["Naruto", "Bleach"],
    });
    expect(msg).toContain("Naruto");
    expect(msg).toContain("Bleach");
  });

  it("does not include exclude section when list is empty", () => {
    const msg = buildUserMessage({ ...base, exclude: [] });
    expect(msg).not.toContain("Do not recommend");
  });
});
