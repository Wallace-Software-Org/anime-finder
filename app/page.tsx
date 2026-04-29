"use client";

import { useState } from "react";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import QuizScreen from "./components/QuizScreen";
import BottomNavigation from "./components/BottomNavigation";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Recommendation {
  title: string;
  year: number;
  episodes: number;
  malId: number;
  whyItFits: string;
  hiddenGemNote: string;
  malScore: number | null;
  anilistScore: number | null;
  anilistId: number | null;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const MOOD_OPTIONS = [
  { emoji: "🔥", label: "Intense, edge of my seat", value: "intense" },
  { emoji: "😮‍💨", label: "Chill, something to relax into", value: "chill" },
  { emoji: "💀", label: "Dark, don't spare my feelings", value: "dark" },
  { emoji: "😂", label: "Light, make me laugh or feel good", value: "light" },
  {
    emoji: "🤯",
    label: "Mind-bending, I want to think after",
    value: "mind-bending",
  },
];

const THEME_OPTIONS = [
  { emoji: "🗡️", label: "Power and ambition", value: "power-and-ambition" },
  {
    emoji: "🤝",
    label: "Friendship and loyalty",
    value: "friendship-and-loyalty",
  },
  { emoji: "🧠", label: "Psychological games", value: "psychological-games" },
  {
    emoji: "🌍",
    label: "World-building and lore",
    value: "world-building-and-lore",
  },
  {
    emoji: "💔",
    label: "Love and relationships",
    value: "love-and-relationships",
  },
  { emoji: "🔍", label: "Mystery and secrets", value: "mystery-and-secrets" },
  {
    emoji: "🌱",
    label: "Growth and becoming someone",
    value: "growth-and-becoming-someone",
  },
];

const COMMITMENT_OPTIONS = [
  { emoji: "🎯", label: "Short and complete, under 15 eps", value: "short" },
  { emoji: "📺", label: "Standard, one or two seasons", value: "standard" },
  { emoji: "🏔️", label: "Long haul is fine", value: "long-haul" },
  { emoji: "✨", label: "No preference", value: "no-preference" },
];

const AVOID_OPTIONS = [
  { emoji: "😴", label: "Long filler arcs", value: "long-filler-arcs" },
  {
    emoji: "💪",
    label: "Overpowered main character",
    value: "overpowered-main-character",
  },
  { emoji: "🙈", label: "Heavy fan service", value: "heavy-fan-service" },
  { emoji: "🐢", label: "Too slow a pace", value: "too-slow-a-pace" },
  { emoji: "😤", label: "Incomplete ending", value: "incomplete-ending" },
  { emoji: "💘", label: "Heavy romance", value: "heavy-romance" },
];

// ── Shared UI ──────────────────────────────────────────────────────────────────

function OptionPill({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full max-w-sm flex items-center gap-3 px-5 py-4 rounded-full text-left transition-colors duration-150",
        selected
          ? "bg-accent-dim border border-accent text-white"
          : "bg-surface border border-border text-muted hover:border-accent/40 hover:text-white/70",
      ].join(" ")}
    >
      <span className="text-xl leading-none">{emoji}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      className="opacity-60"
    >
      <path
        d="M2 9L9 2M9 2H4M9 2V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

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
    // step 5 → submit
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

  return (
    <div className="min-h-screen bg-background text-white flex flex-col justify-start">
      <Header isQuiz={isQuiz} step={step} onLogoClick={handleStartOver} />
      {isQuiz && <ProgressBar step={step} onGoToStep={goToStep} />}

      {/* ── Screen content ── */}
      <main className="flex flex-col overflow-hidden items-center justify-center">
        <div
          key={step}
          className={[
            "flex flex-col flex-1 px-6 pt-8 lg:pt-24 pb-4 lg:pb-16 h-min animate-fade-up",
            isResults ? "overflow-y-auto" : "",
          ].join(" ")}
        >
          {step === 0 && <LandingScreen onStart={() => setStep(1)} />}

          {step === 1 && (
            <QuizScreen title="What kind of ride are you looking for?">
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
            <QuizScreen title="How much are you willing to commit?">
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
            >
              <div className="mt-2">
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Vinland Saga, Ping Pong the Animation..."
                  className="w-full bg-surface border-0 border-b border-border text-white placeholder:text-muted/60 px-0 py-3 text-base outline-none focus:border-accent/60 transition-colors duration-150"
                />
                <p className="mt-2 text-sm text-muted">optional</p>
              </div>
            </QuizScreen>
          )}

          {step === 5 && (
            <QuizScreen title="Anything you want to avoid?">
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

      {isQuiz && (
        <BottomNavigation
          step={step}
          canProceed={canProceed()}
          loading={loading}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

// ── Screen components ──────────────────────────────────────────────────────────

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center gap-6 py-12">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent text-white font-bold text-2xl select-none">
        HP
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Anime you have never heard of.
          <br />
          You will love it.
        </h1>
        <p className="text-muted text-base max-w-xs mx-auto">
          Answer five questions. Get five hidden gems matched to your taste.
        </p>
      </div>
      <button
        onClick={onStart}
        className="mt-4 w-full max-w-xs h-12 rounded-full bg-surface border border-border text-white font-semibold hover:border-accent/40 transition-colors duration-150"
      >
        Find my anime
      </button>
    </div>
  );
}

function ResultsScreen({
  results,
  onStartOver,
}: {
  results: Recommendation[];
  onStartOver: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold">Your hidden gems</h2>
        <p className="text-sm text-muted mt-1">Picked for your taste</p>
      </div>

      <div className="flex flex-col gap-4">
        {results.map((rec) => (
          <ResultCard key={rec.malId} rec={rec} />
        ))}
      </div>

      <button
        onClick={onStartOver}
        className="w-full h-12 rounded-full bg-surface border border-border text-white font-semibold hover:border-accent/40 transition-colors duration-150"
      >
        Start over
      </button>
    </div>
  );
}

function ResultCard({ rec }: { rec: Recommendation }) {
  const episodeLabel =
    rec.episodes > 0 ? `${rec.episodes} episodes` : "Ongoing";

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold">{rec.title}</h3>
        <p className="text-sm text-muted mt-0.5">
          {rec.year} · {episodeLabel}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`https://myanimelist.net/anime/${rec.malId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-sm hover:border-accent/40 transition-colors duration-150"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          <span className="text-white font-medium">
            MAL {rec.malScore != null ? rec.malScore.toFixed(1) : "—"}
          </span>
          <ExternalLinkIcon />
        </a>

        {rec.anilistId != null && (
          <a
            href={`https://anilist.co/anime/${rec.anilistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-sm hover:border-accent/40 transition-colors duration-150"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-white font-medium">
              AniList {rec.anilistScore != null ? `${rec.anilistScore}%` : "—"}
            </span>
            <ExternalLinkIcon />
          </a>
        )}
      </div>

      <p className="text-white/90 text-sm leading-relaxed">{rec.whyItFits}</p>

      <div className="border-t border-border pt-3">
        <p className="text-muted text-sm italic leading-relaxed">
          {rec.hiddenGemNote}
        </p>
      </div>
    </div>
  );
}
