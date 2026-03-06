type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-borderSoft/60 bg-white p-6 shadow-soft">
      <p className="font-medium text-charcoal">{title}</p>
      <p className="mt-1 text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full bg-gold px-4 py-2 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
