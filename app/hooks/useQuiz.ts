"use client";

import { useState } from "react";
import type { Recommendation } from "../lib/types";

export const TOTAL_STEPS = 6;

export function useQuiz() {
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState("");
  const [mood, setMood] = useState("");
  const [themes, setThemes] = useState<string[]>([]);
  const [commitment, setCommitment] = useState("");
  const [reference, setReference] = useState("");
  const [avoid, setAvoid] = useState<string[]>([]);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [era, setEra] = useState<string[]>(["any"]);

  // q1=experience, q2=mood, q3=themes, q4=commitment, q5=reference, q6=avoid
  const canProceed = () => {
    if (step === 1) return experience !== "";
    if (step === 2) return mood !== "";
    if (step === 3) return themes.length > 0;
    if (step === 4) return commitment !== "";
    return true;
  };

  const toggleTheme = (value: string) =>
    setThemes((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : prev.length < 2
          ? [...prev, value]
          : prev,
    );

  const toggleAvoid = (value: string) =>
    setAvoid((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value],
    );

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience,
          mood,
          themes,
          commitment,
          reference,
          avoid,
          era,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      const data: Recommendation[] = await res.json();
      setResults(data);
      setStep(TOTAL_STEPS + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (selectedEra: string[]) => {
    setEra(selectedEra);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience,
          mood,
          themes,
          commitment,
          reference,
          avoid,
          era: selectedEra,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      const data: Recommendation[] = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFindMore = async () => {
    setLoading(true);
    setError("");
    try {
      const exclude = results?.map((r) => r.title) ?? [];
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience,
          mood,
          themes,
          commitment,
          reference,
          avoid,
          era,
          exclude,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      const data: Recommendation[] = await res.json();
      setResults((prev) => [...(prev ?? []), ...data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleStartOver = () => {
    setStep(0);
    setExperience("");
    setMood("");
    setThemes([]);
    setCommitment("");
    setReference("");
    setAvoid([]);
    setResults(null);
    setError("");
    setEra(["any"]);
  };

  const goToStep = (s: number) => {
    if (s < step) setStep(s);
  };

  return {
    step,
    setStep,
    experience,
    setExperience,
    mood,
    setMood,
    themes,
    toggleTheme,
    commitment,
    setCommitment,
    reference,
    setReference,
    avoid,
    toggleAvoid,
    results,
    loading,
    error,
    era,
    handleFilter,
    handleFindMore,
    canProceed,
    handleNext,
    handleBack,
    handleStartOver,
    goToStep,
    isQuiz: step >= 1 && step <= TOTAL_STEPS,
    isResults: step === TOTAL_STEPS + 1,
  };
}
