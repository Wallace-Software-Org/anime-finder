function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11 4L6 9L11 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavigationButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex-1 h-12 rounded-full w-40 font-semibold text-base transition-opacity duration-150 flex items-center justify-center gap-2",
        !disabled
          ? "bg-surface border border-border text-white hover:border-accent/40"
          : "bg-surface border border-border text-muted cursor-not-allowed opacity-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function BottomNavigation({
  step,
  totalSteps,
  canProceed,
  loading,
  onBack,
  onNext,
}: {
  step: number;
  totalSteps: number;
  canProceed: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const showBackButton = step > 1;

  return (
    <div
      className={[
        "flex flex-row justify-center items-center",
        showBackButton ? "gap-4" : "",
      ].join(" ")}
    >
      {showBackButton && (
        <NavigationButton onClick={onBack} disabled={loading}>
          Back
        </NavigationButton>
      )}
      <NavigationButton onClick={onNext} disabled={!canProceed || loading}>
        {loading
          ? "Finding gems…"
          : step === totalSteps
            ? "Find my anime"
            : "Next"}
      </NavigationButton>
    </div>
  );
}
