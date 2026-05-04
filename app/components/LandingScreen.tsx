function AniMatchLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="none"
        stroke="#7c5cfc"
        strokeWidth="1.25"
      />
      <line
        x1="6"
        y1="9"
        x2="26"
        y2="9"
        stroke="#7c5cfc"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      />
      <line
        x1="8"
        y1="14"
        x2="24"
        y2="14"
        stroke="#7c5cfc"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="10"
        y1="19"
        x2="22"
        y2="19"
        stroke="#7c5cfc"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="25" r="2" fill="#7c5cfc" />
    </svg>
  );
}

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-start flex-1 text-center gap-6 py-12">
      <AniMatchLogo />
      <div className="space-y-0">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Find your next anime.
        </h1>
        <p className="text-muted text-base max-w-xs mx-auto">
          Answer five questions. Get five hidden gems matched to your taste.
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
