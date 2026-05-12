"use client";

import { useState } from "react";
import type {
  CommitmentValue,
  EraValue,
  ExperienceLevel,
  MoodValue,
  QuizCommitmentValue,
  Recommendation,
  ThemeValue,
} from "../lib/types";

export const TOTAL_STEPS = 4;

async function streamRecommendations(
  body: object,
  onResult: (rec: Recommendation) => void,
): Promise<void> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || "Something went wrong");
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        onResult(JSON.parse(trimmed) as Recommendation);
      } catch {
        // skip malformed lines
      }
    }
  }

  // flush any remaining buffered line
  const remaining = buffer.trim();
  if (remaining) {
    try {
      onResult(JSON.parse(remaining) as Recommendation);
    } catch {
      // ignore
    }
  }
}

export function useQuiz() {
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [mood, setMood] = useState<MoodValue[]>([]);
  const [themes, setThemes] = useState<ThemeValue[]>([]);
  const [commitment, setCommitment] = useState<QuizCommitmentValue | "">("");
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [era, setEra] = useState<EraValue[]>(["any"]);

  // q1=experience, q2=mood, q3=themes, q4=commitment
  const canProceed = () => {
    if (step === 1) return experience !== "";
    if (step === 2) return mood.length > 0;
    if (step === 3) return true;
    if (step === 4) return commitment !== "";
    return true;
  };

  const toggleMood = (value: MoodValue) =>
    setMood((prev) =>
      prev.includes(value)
        ? prev.filter((m) => m !== value)
        : prev.length < 2
          ? [...prev, value]
          : prev,
    );

  const toggleTheme = (value: ThemeValue) =>
    setThemes((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : prev.length < 3
          ? [...prev, value]
          : prev,
    );

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    setError("");
    let navigated = false;
    try {
      await streamRecommendations(
        { experience, mood, themes, commitment, era },
        (rec) => {
          if (!navigated) {
            setResults([rec]);
            setStep(TOTAL_STEPS + 1);
            navigated = true;
          } else {
            setResults((prev) => [...(prev ?? []), rec]);
          }
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (
    selectedEra: EraValue[],
    selectedCommitment: CommitmentValue | "",
    filterExperience: ExperienceLevel | "",
  ) => {
    setEra(selectedEra);
    setLoading(true);
    setError("");
    let first = true;
    try {
      await streamRecommendations(
        {
          experience: filterExperience,
          mood,
          themes,
          commitment: selectedCommitment,
          era: selectedEra,
        },
        (rec) => {
          if (first) {
            setResults([rec]);
            first = false;
          } else {
            setResults((prev) => [...(prev ?? []), rec]);
          }
        },
      );
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
      await streamRecommendations(
        { experience, mood, themes, commitment, era, exclude },
        (rec) => {
          setResults((prev) => [...(prev ?? []), rec]);
        },
      );
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
    setMood([]);
    setThemes([]);
    setCommitment("");
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
    toggleMood,
    themes,
    toggleTheme,
    commitment,
    setCommitment,
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
