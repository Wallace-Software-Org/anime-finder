import { AniMatchLogo } from "./AniMatchLogo";

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
