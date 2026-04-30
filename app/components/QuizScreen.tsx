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
    <div className="flex flex-col gap-16 items-center h-full grow">
      <div>
        <h2 className="text-2xl font-bold leading-tight text-center">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
      {nav && <div className="">{nav}</div>}
    </div>
  );
}
