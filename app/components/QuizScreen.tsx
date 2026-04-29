export default function QuizScreen({
  title,
  subtitle,
  children,
  nav,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 items-center h-full jutify-between grow">
      <div>
        <h2 className="text-2xl font-bold leading-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
      {nav && <div className="pt-2">{nav}</div>}
    </div>
  );
}
