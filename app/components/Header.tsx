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
    <header className="fixed z-50 flex items-center justify-between px-6 py-6 w-full bg-background">
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2.5 cursor-pointer"
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent text-white font-bold text-sm select-none">
          HP
        </span>
        <span className="font-semibold text-white text-base">HiddenPick</span>
      </button>
      {isQuiz && (
        <span className="text-sm text-muted font-medium">
          {step} of {totalSteps}
        </span>
      )}
    </header>
  );
}
