import { AniMatchLogo } from "./AniMatchLogo";

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-start flex-1 text-center gap-6 py-12">
      <AniMatchLogo size={48} />
      <div className="space-y-0">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Find your next anime.
        </h1>
        <p className="text-muted text-base max-w-xs mx-auto">
          Answer four questions. Get five recommendations.
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="relative z-10 mt-4 w-full max-w-xs h-12 rounded-full bg-surface border border-border text-white font-semibold hover:border-accent/40 transition-colors duration-150 touch-manipulation"
      >
        Find my anime
      </button>
    </div>
  );
}
