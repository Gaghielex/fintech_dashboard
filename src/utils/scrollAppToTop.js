/**
 * Scroll the main document to the top after tab / route context changes.
 * Double rAF waits for layout after React commit.
 */
export function scrollAppToTop() {
  if (typeof window === 'undefined') return

  const run = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(run)
  })
}
