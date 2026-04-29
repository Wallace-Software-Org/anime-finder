export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center gap-6 py-12">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent text-white font-bold text-2xl select-none">
        HP
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Anime you have never heard of.
          <br />
          You will love it.
        </h1>
        <p className="text-muted text-base max-w-xs mx-auto">
          Answer five questions. Get five hidden gems matched to your taste.
        </p>
      </div>
      <button
        onClick={onStart}
        className="mt-4 w-full max-w-xs h-12 rounded-full bg-surface border border-border text-white font-semibold hover:border-accent/40 transition-colors duration-150"
      >
        Find my anime
      </button>
    </div>
  );
}
