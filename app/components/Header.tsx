function AniMatchLogo() {
  return (
    <svg
      width="32"
      height="32"
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

export default function Header({
  isQuiz,
  step,
  totalSteps,
  onLogoClick,
}: {
  isQuiz: boolean;
  step: number;
  totalSteps: number;
  onLogoClick: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 w-full bg-background">
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2.5 cursor-pointer"
      >
        <AniMatchLogo />
        <span style={{ fontSize: "15px", fontWeight: 500 }}>
          <span className="text-white">Ani</span>
          <span style={{ color: "#7c5cfc" }}>Match</span>
        </span>
      </button>
      {isQuiz && (
        <span className="text-sm text-muted font-medium">
          {step} of {totalSteps}
        </span>
      )}
    </header>
  );
}
