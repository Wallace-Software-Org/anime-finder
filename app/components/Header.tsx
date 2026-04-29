export default function Header({
  isQuiz,
  step,
  onLogoClick,
}: {
  isQuiz: boolean;
  step: number;
  onLogoClick: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-6 pt-6 pb-0 w-full">
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
        <span className="text-sm text-muted font-medium">{step} of 5</span>
      )}
    </header>
  );
}
