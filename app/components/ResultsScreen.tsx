"use client";

import { useState } from "react";
import type { Recommendation } from "../lib/types";

const ERA_CHIPS = [
  { label: "Before 1990", value: "Before 1990" },
  { label: "1990s", value: "1990s" },
  { label: "2000s", value: "2000s" },
  { label: "2010s", value: "2010s" },
  { label: "2020s", value: "2020s" },
  { label: "Any era", value: "any" },
];

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 3h12M3 7h8M5 11h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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
        {rec.malId != null ? (
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
        ) : rec.malScore != null ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="text-white font-medium">
              MAL {rec.malScore.toFixed(1)}
            </span>
          </span>
        ) : null}

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

export default function ResultsScreen({
  results,
  onStartOver,
  onFilter,
  onFindMore,
  loading,
}: {
  results: Recommendation[];
  onStartOver: () => void;
  onFilter: (era: string[]) => void;
  onFindMore: () => void;
  loading: boolean;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedEras, setSelectedEras] = useState<string[]>(["any"]);

  const toggleEra = (value: string) => {
    if (value === "any") {
      setSelectedEras(["any"]);
      return;
    }
    setSelectedEras((prev) => {
      const withoutAny = prev.filter((e) => e !== "any");
      return withoutAny.includes(value)
        ? withoutAny.filter((e) => e !== value).length === 0
          ? ["any"]
          : withoutAny.filter((e) => e !== value)
        : [...withoutAny, value];
    });
  };

  const handleClear = () => setSelectedEras(["any"]);

  const handleUpdate = () => {
    onFilter(selectedEras);
  };

  return (
    <div className="flex flex-col gap-8 sm:max-w-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Your hidden gems</h2>
          <p className="text-sm text-muted mt-1">Picked for your taste</p>
        </div>
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className="flex items-center gap-1.5 shrink-0 mt-1 px-3.5 h-9 rounded-full bg-surface border border-border text-white text-sm font-medium hover:border-accent/40 transition-colors duration-150"
        >
          <FilterIcon />
          Filter
        </button>
      </div>

      {filterOpen && (
        <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
              Era
            </p>
            <div className="flex flex-wrap gap-2">
              {ERA_CHIPS.map((chip) => {
                const selected = selectedEras.includes(chip.value);
                return (
                  <button
                    key={chip.value}
                    onClick={() => toggleEra(chip.value)}
                    disabled={loading}
                    className={[
                      "px-3.5 py-1.5 rounded-xl border text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
                      selected
                        ? "bg-accent/15 border-accent/50 text-white"
                        : "bg-background border-border text-muted hover:border-accent/30",
                    ].join(" ")}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-4 flex gap-4">
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-5 h-11 rounded-full bg-surface border border-border text-white text-sm font-semibold hover:border-accent/40 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 h-11 rounded-full bg-surface border border-border text-white text-sm font-semibold hover:border-accent/40 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating…" : "Update results"}
            </button>
          </div>

          {loading && (
            <p className="text-sm text-muted">Updating your recommendations…</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {results.map((rec) => (
          <ResultCard key={rec.title} rec={rec} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onFindMore}
          disabled={loading}
          className="w-full h-12 rounded-full bg-surface border border-border text-white font-semibold hover:border-accent/40 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Finding more…" : "Find 5 more"}
        </button>

        <button
          onClick={onStartOver}
          className="w-full h-12 rounded-full bg-surface border border-border text-white font-semibold hover:border-accent/40 transition-colors duration-150"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
