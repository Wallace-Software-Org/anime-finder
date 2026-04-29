import type { Recommendation } from "../lib/types";

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

export default function ResultsScreen({
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
