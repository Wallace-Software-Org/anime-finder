import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuiz } from "@/app/hooks/useQuiz";

describe("useQuiz", () => {
  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.mood).toEqual([]);
    expect(result.current.themes).toEqual([]);
    expect(result.current.experience).toBe("");
  });

  it("toggleMood adds a mood when under limit", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleMood("intense");
    });
    expect(result.current.mood).toContain("intense");
  });

  it("toggleMood does not add a third mood", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleMood("intense");
      result.current.toggleMood("dark");
      result.current.toggleMood("chill");
    });
    expect(result.current.mood).toHaveLength(2);
  });

  it("toggleMood removes a mood when already selected", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleMood("intense");
    });
    act(() => {
      result.current.toggleMood("intense");
    });
    expect(result.current.mood).not.toContain("intense");
  });

  it("toggleTheme adds a theme when under limit", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleTheme("power-and-ambition");
    });
    expect(result.current.themes).toContain("power-and-ambition");
  });

  it("toggleTheme does not add a fourth theme", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleTheme("power-and-ambition");
      result.current.toggleTheme("mystery-and-secrets");
      result.current.toggleTheme("growth-and-becoming-someone");
      result.current.toggleTheme("psychological-games");
    });
    expect(result.current.themes).toHaveLength(3);
  });

  it("toggleTheme removes a theme when already selected", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleTheme("power-and-ambition");
    });
    act(() => {
      result.current.toggleTheme("power-and-ambition");
    });
    expect(result.current.themes).not.toContain("power-and-ambition");
  });

  it("setCommitment updates commitment correctly", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.setCommitment("short");
    });
    expect(result.current.commitment).toBe("short");
  });

  it("handleStartOver returns all state to defaults", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleMood("dark");
      result.current.toggleTheme("power-and-ambition");
      result.current.setCommitment("short");
    });
    act(() => {
      result.current.handleStartOver();
    });
    expect(result.current.themes).toEqual([]);
    expect(result.current.commitment).toBe("");
  });

  it("step is 0 on landing screen", () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.step).toBe(0);
  });

  it("step updates when setStep is called", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.setStep(1);
    });
    expect(result.current.step).toBe(1);
  });
});
