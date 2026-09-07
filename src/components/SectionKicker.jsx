export default function SectionKicker({ children, className = "" }) {
  return (
    <p className={`font-mono-label flex items-center gap-2 text-xs uppercase text-ink-soft ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo" />
      {children}
    </p>
  );
}
