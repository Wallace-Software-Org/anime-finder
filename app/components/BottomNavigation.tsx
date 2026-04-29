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

export default function BottomNavigation({
  step,
  canProceed,
  loading,
  onBack,
  onNext,
}: {
  step: number;
  canProceed: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="px-6 pb-6 pt-2 flex gap-3 max-w-sm w-full justify-center">
      {step > 1 && (
        <button
          onClick={onBack}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border text-white hover:border-accent/40 transition-colors duration-150 shrink-0"
        >
          <BackArrow />
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canProceed || loading}
        className={[
          "flex-1 h-12 rounded-full font-semibold text-base transition-opacity duration-150",
          canProceed && !loading
            ? "bg-surface border border-border text-white hover:border-accent/40"
            : "bg-surface border border-border text-muted cursor-not-allowed opacity-50",
        ].join(" ")}
      >
        {loading ? "Finding your gems…" : step === 5 ? "Find my anime" : "Next"}
      </button>
    </div>
  );
}
