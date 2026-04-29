export default function OptionPill({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "min-w-xs md:min-w-sm flex items-center gap-3 px-5 py-4 rounded-full text-left transition-colors duration-150",
        selected
          ? "bg-accent-dim border border-accent text-white"
          : "bg-surface border border-border text-muted hover:border-accent/40 hover:text-white/70",
      ].join(" ")}
    >
      <span className="text-xl leading-none">{emoji}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
