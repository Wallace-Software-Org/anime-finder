export default function QuizScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10 h-full grow w-full max-w-140 mx-auto md:pt-8">
      <div>
        <h2 className="text-2xl font-bold leading-tight md:text-center">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted md:text-center">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
