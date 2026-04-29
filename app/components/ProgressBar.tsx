export default function ProgressBar({
  step,
  onGoToStep,
}: {
  step: number;
  onGoToStep: (s: number) => void;
}) {
  return (
    <div className="flex gap-1.5 px-6 mt-4">
      {Array.from({ length: 5 }, (_, i) => {
        const seg = i + 1;
        const done = seg <= step;
        const clickable = seg < step;
        return (
          <button
            key={seg}
            onClick={() => clickable && onGoToStep(seg)}
            className={[
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              done ? "bg-accent" : "bg-accent/20",
              clickable ? "cursor-pointer" : "cursor-default",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
