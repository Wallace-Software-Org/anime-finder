import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuiz } from "@/app/hooks/useQuiz";

describe("useQuiz", () => {
  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.mood).toBe("");
    expect(result.current.themes).toEqual([]);
    expect(result.current.experience).toBe("");
  });

  it("setMood updates mood correctly", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.setMood("dark");
    });
    expect(result.current.mood).toBe("dark");
  });

  it("toggleTheme adds a theme when under limit", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleTheme("power-and-ambition");
    });
    expect(result.current.themes).toContain("power-and-ambition");
  });

  it("toggleTheme does not add a third theme", () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.toggleTheme("power-and-ambition");
      result.current.toggleTheme("mystery-and-secrets");
      result.current.toggleTheme("growth-and-becoming-someone");
    });
    expect(result.current.themes).toHaveLength(2);
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
      result.current.setMood("dark");
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
