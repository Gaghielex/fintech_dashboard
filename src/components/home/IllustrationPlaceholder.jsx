export function IllustrationPlaceholder() {
  return (
    <section
      className="mb-8 flex min-h-[9.5rem] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-4 py-6 text-center"
      aria-label="Illustration placeholder"
    >
      <p className="font-dm-sans text-sm font-medium text-ink-muted">
        Illustration zone
      </p>
      <p className="font-dm-mono mt-1 max-w-[16rem] text-xs text-ink-faint">
        PRD: custom hero art (character on globe, AU / JP / EC pins). Swap
        asset before launch.
      </p>
    </section>
  )
}
