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
  const isLast = step === totalSteps;

  return (
    <div className="flex gap-3 w-full max-w-140 mx-auto md:justify-center">
      <button
        onClick={onBack}
        disabled={loading}
        className="flex-1 md:flex-none md:px-8 h-12 rounded-full bg-surface border border-border text-white font-semibold text-base hover:border-accent/40 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>

      <button
        onClick={onNext}
        disabled={!canProceed || loading}
        className={[
          "flex-1 md:flex-none md:px-8 h-12 rounded-full font-semibold text-base transition-colors duration-150",
          canProceed && !loading
            ? "bg-accent text-white hover:bg-accent/90"
            : "bg-surface border border-border text-muted cursor-not-allowed opacity-50",
        ].join(" ")}
      >
        {loading ? "Finding bangers…" : isLast ? "Find my anime" : "Next"}
      </button>
    </div>
  );
}
