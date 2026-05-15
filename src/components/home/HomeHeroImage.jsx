import { motion, useScroll, useTransform } from 'framer-motion'
import heroImg from '../../assets/hero.png'

const HERO_HEIGHT = 'min(52vh, 22rem)'

/** Extra room below the hero before the glass sheet overlaps. */
export const HOME_HERO_SPACER = `calc(${HERO_HEIGHT} + 2rem)`

export function HomeHeroImage() {
  const { scrollY } = useScroll()

  const imageY = useTransform(scrollY, [0, 360], [0, 48])
  const imageScale = useTransform(scrollY, [0, 360], [1, 1.05])
  const noiseY = useTransform(scrollY, [0, 360], [0, 24])
  const heroOpacity = useTransform(scrollY, [0, 80, 200, 360], [1, 1, 0.3, 0])

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-0 lg:left-56"
      style={{ opacity: heroOpacity }}
      aria-hidden
    >
      <div
        className="mx-auto w-full max-w-lg lg:max-w-2xl"
        style={{ height: HERO_HEIGHT }}
      >
        <div className="relative h-full overflow-hidden rounded-2xl">
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ y: imageY, scale: imageScale }}
          >
            <img
              src={heroImg}
              alt=""
              className="h-full w-full object-cover object-[center_38%]"
              draggable={false}
            />
          </motion.div>

          <motion.div
            className="hero-noise absolute inset-0"
            style={{ y: noiseY }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Frosted sheet that scrolls over the hero; opacity increases until fully solid.
 * @param {{ children: import('react').ReactNode }} props
 */
export function HomeHeroGlassLayer({ children }) {
  const { scrollY } = useScroll()

  const sheetBg = useTransform(
    scrollY,
    [0, 40, 120, 240],
    [
      'rgba(13, 17, 23, 0.12)',
      'rgba(13, 17, 23, 0.38)',
      'rgba(13, 17, 23, 0.78)',
      'rgba(13, 17, 23, 1)',
    ],
  )

  return (
    <motion.div
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[1.35rem] border-t border-white/[0.08] shadow-[0_-10px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl backdrop-saturate-150"
      style={{ backgroundColor: sheetBg }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent" />
      <div className="relative px-5 pb-3 pt-12 sm:px-6">{children}</div>
    </motion.div>
  )
}
