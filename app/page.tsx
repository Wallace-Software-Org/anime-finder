"use client";

import { useState } from "react";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import QuizScreen from "./components/QuizScreen";
import BottomNavigation from "./components/BottomNavigation";
import OptionPill from "./components/OptionPill";
import LandingScreen from "./components/LandingScreen";
import ResultsScreen from "./components/ResultsScreen";
import {
  MOOD_OPTIONS,
  THEME_OPTIONS,
  COMMITMENT_OPTIONS,
  AVOID_OPTIONS,
} from "./lib/options";
import type { Recommendation } from "./lib/types";

export default function Page() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState("");
  const [themes, setThemes] = useState<string[]>([]);
  const [commitment, setCommitment] = useState("");
  const [reference, setReference] = useState("");
  const [avoid, setAvoid] = useState<string[]>([]);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canProceed = () => {
    if (step === 1) return mood !== "";
    if (step === 2) return themes.length > 0;
    if (step === 3) return commitment !== "";
    return true;
  };

  const toggleTheme = (value: string) => {
    setThemes((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : prev.length < 2
          ? [...prev, value]
          : prev,
    );
  };

  const toggleAvoid = (value: string) => {
    setAvoid((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value],
    );
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, themes, commitment, reference, avoid }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      const data: Recommendation[] = await res.json();
      setResults(data);
      setStep(6);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleStartOver = () => {
    setStep(0);
    setMood("");
    setThemes([]);
    setCommitment("");
    setReference("");
    setAvoid([]);
    setResults(null);
    setError("");
  };

  const goToStep = (s: number) => {
    if (s < step) setStep(s);
  };

  const isQuiz = step >= 1 && step <= 5;
  const isResults = step === 6;

  const quizNav = (
    <BottomNavigation
      step={step}
      canProceed={canProceed()}
      loading={loading}
      onBack={handleBack}
      onNext={handleNext}
    />
  );

  return (
    <div className="bg-background text-white flex flex-col justify-start h-full grow">
      <Header isQuiz={isQuiz} step={step} onLogoClick={handleStartOver} />
      {isQuiz && <ProgressBar step={step} onGoToStep={goToStep} />}

      <main className="flex flex-col overflow-hidden items-center justify-center h-full">
        <div
          key={step}
          className={[
            "flex flex-col flex-1 px-6 pt-10 md:pt-14 pb-8 h-min animate-fade-up",
            isResults ? "overflow-y-auto" : "",
          ].join(" ")}
        >
          {step === 0 && <LandingScreen onStart={() => setStep(1)} />}

          {step === 1 && (
            <QuizScreen
              title="What kind of ride are you looking for?"
              nav={quizNav}
            >
              <div className="flex flex-col gap-3">
                {MOOD_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={mood === opt.value}
                    onClick={() => setMood(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {step === 2 && (
            <QuizScreen
              title="What should it be about at its core?"
              subtitle="Pick up to 2"
              nav={quizNav}
            >
              <div className="flex flex-col gap-3">
                {THEME_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={themes.includes(opt.value)}
                    onClick={() => toggleTheme(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {step === 3 && (
            <QuizScreen
              title="How much are you willing to commit?"
              nav={quizNav}
            >
              <div className="flex flex-col gap-3">
                {COMMITMENT_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={commitment === opt.value}
                    onClick={() => setCommitment(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {step === 4 && (
            <QuizScreen
              title="What show do you want to find something like?"
              subtitle="Give us a reference and we will find hidden gems with the same soul"
              nav={quizNav}
            >
              <div className="mt-2">
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Vinland Saga, Ping Pong the Animation..."
                  className="min-w-xs md:min-w-sm w-full bg-surface border-0 border-b border-border text-white placeholder:text-muted/60 px-0 py-3 text-base outline-none focus:border-accent/60 transition-colors duration-150"
                />
                <p className="mt-2 text-sm text-muted">optional</p>
              </div>
            </QuizScreen>
          )}

          {step === 5 && (
            <QuizScreen title="Anything you want to avoid?" nav={quizNav}>
              <div className="flex flex-col gap-3">
                {AVOID_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={avoid.includes(opt.value)}
                    onClick={() => toggleAvoid(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {step === 6 && results && (
            <ResultsScreen results={results} onStartOver={handleStartOver} />
          )}

          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
        </div>
      </main>
    </div>
  );
}
