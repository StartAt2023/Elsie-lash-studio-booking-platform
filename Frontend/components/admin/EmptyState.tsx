type EmptyStateProps = {
  message: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-borderSoft/60 bg-white p-8 text-center shadow-soft">
      <p className="text-muted">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
