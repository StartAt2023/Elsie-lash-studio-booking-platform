type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  className?: string;
  titleClassName?: string;
};

export function SectionTitle({
  kicker,
  title,
  lead,
  className = "",
  titleClassName = "",
}: Props) {
  return (
    <div className={className}>
      {kicker && (
        <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted sm:text-sm">
          {kicker}
        </p>
      )}
      <h2
        className={`mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl ${titleClassName}`}
      >
        {title}
      </h2>
      {lead && <p className="mt-4 max-w-xl leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}
