/**
 * @param {{ message: string, onRetry: () => void }} props
 */
export function SheetLoadError({ message, onRetry }) {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4 py-10">
      <div className="rounded-xl border border-warning/50 bg-warning/10 px-4 py-3">
        <p className="font-dm-sans text-sm font-semibold text-warning">
          Could not load account data
        </p>
        <p className="font-dm-mono mt-2 text-xs leading-relaxed text-ink-muted">
          {message}
        </p>
      </div>
      <p className="font-dm-sans text-xs text-ink-faint">
        Use Try again to refetch from Google Sheets.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="font-dm-sans rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-canvas transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
