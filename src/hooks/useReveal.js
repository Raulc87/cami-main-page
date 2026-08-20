import { useState, useEffect } from 'react'

/**
 * useReveal — scroll-reveal hook
 *
 * Returns a helper `r(id, delayMs)` that, when spread onto a JSX element,
 * fades + slides it in when it enters the viewport.
 *
 * Usage:
 *   const r = useReveal()
 *   <div {...r('hero-title', 100)}>...</div>
 *
 * IDs must be unique across the full page.
 */
export function useReveal() {
  const [vis, setVis] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.rid
            setVis((prev) => ({ ...prev, [id]: true }))
          }
        })
      },
      { threshold: 0.12 },
    )

    const elements = document.querySelectorAll('[data-rid]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  /**
   * @param {string} id    Unique element identifier
   * @param {number} delay Transition delay in milliseconds
   */
  const r = (id, delay = 0) => ({
    'data-rid': id,
    style: {
      opacity: vis[id] ? 1 : 0,
      transform: vis[id] ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    },
  })

  return r
}
