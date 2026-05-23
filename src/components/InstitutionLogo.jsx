import { useState } from 'react'

/** Deterministic colours seeded from the institution name. */
const AVATAR_COLORS = [
  { bg: 'rgba(0, 200, 150, 0.18)', color: '#00C896' },   // primary teal
  { bg: 'rgba(240, 196, 25, 0.18)', color: '#F0C419' },  // accent gold
  { bg: 'rgba(247, 37, 133, 0.18)', color: '#F72585' },  // accent pink
  { bg: 'rgba(100, 120, 150, 0.15)', color: '#8899AA' }, // neutral
]

/** djb2-style string hash — always returns a non-negative integer. */
function hashStr(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
  }
  return h >>> 0 // unsigned 32-bit → always positive
}

/** Up to 2 initials from a name string. */
function initials(name) {
  const words = String(name || '?').trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return String(name || '?').slice(0, 2).toUpperCase()
}

/**
 * Institution logo: shows icon_url when available; falls back to a
 * deterministically coloured initials avatar.
 *
 * @param {{
 *   name: string,
 *   iconUrl?: string | null,
 *   size?: number,
 * }} props
 */
export function InstitutionLogo({ name, iconUrl, size = 32 }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImg = Boolean(iconUrl) && !imgFailed

  const { bg, color } =
    AVATAR_COLORS[hashStr(name || '') % AVATAR_COLORS.length]
  const ini = initials(name)
  const fontSize = size <= 24 ? 9 : size <= 32 ? 11 : 13

  return (
    <div
      className="shrink-0 overflow-hidden rounded-lg"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {showImg ? (
        <img
          src={iconUrl}
          alt=""
          className="h-full w-full object-contain"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-dm-mono font-bold leading-none"
          style={{ backgroundColor: bg, color, fontSize }}
        >
          {ini}
        </div>
      )}
    </div>
  )
}
