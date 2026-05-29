/** @typedef {'gabriel' | 'ana' | 'joint'} OwnerKey */

const AVATAR_G_URL = `${import.meta.env.BASE_URL}Avatar-G.png`
const AVATAR_A_URL = `${import.meta.env.BASE_URL}Avatar-A.png`

/**
 * Renders a circular flag. When `flag` is a 2-char lowercase ISO country code
 * (e.g. "au", "jp") it loads a crisp image from flagcdn.com that fills the
 * circle. Any other string (emoji, symbol) falls back to centred text.
 *
 * @param {{ flag: string, label?: string }} props
 */
export function FlagBadge({ flag, label }) {
  const imgSrc =
    flag == null ? null
    : /^[a-z]{2}$/.test(flag) ? `https://flagcdn.com/w40/${flag}.png`
    : flag.startsWith('http') || flag.startsWith('/') ? flag
    : null

  return (
    <span
      className="flex h-6 w-6 shrink-0 overflow-hidden rounded-full border border-border bg-surface-1"
      role="img"
      aria-label={label}
    >
      {imgSrc ? (
        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[0.85rem] leading-none">
          {flag}
        </span>
      )}
    </span>
  )
}

const SINGLE_AVATAR_SIZES = {
  24: 'h-6 w-6',
  40: 'h-10 w-10',
}

/**
 * @param {{ owner: OwnerKey, size?: '24' | '40' }} props
 */
export function OwnerAvatar({ owner, size = '24' }) {
  if (owner === 'joint') {
    return <JointAvatars size={size === '40' ? '40' : '24'} />
  }

  const isGabriel = owner === 'gabriel'
  const dim = SINGLE_AVATAR_SIZES[size] ?? SINGLE_AVATAR_SIZES[24]
  const src = isGabriel ? AVATAR_G_URL : AVATAR_A_URL
  const name = isGabriel ? 'Gabriel' : 'Ana'
  return (
    <span className={`flex shrink-0 overflow-hidden rounded-full border border-border ${dim}`} aria-label={name}>
      <img src={src} alt="" className="h-full w-full object-cover" />
    </span>
  )
}

const JOINT_AVATAR_SIZES = {
  24: {
    container: 'h-6 w-6',
    inner: 'top-[0.25rem] h-[0.9rem] w-[0.9rem] text-[0.55rem]',
  },
  32: {
    container: 'h-8 w-8',
    inner: 'top-[0.3rem] h-[1.15rem] w-[1.15rem] text-[0.65rem]',
  },
  40: {
    container: 'h-12 w-12',
    inner: 'top-[0.25rem] h-[1.85rem] w-[1.85rem] text-[0.85rem]',
  },
  56: {
    container: 'h-14 w-14',
    inner: 'top-[0.3rem] h-[2.2rem] w-[2.2rem] text-[1rem]',
  },
}

/**
 * @param {{ size?: '24' | '32' | '40' }} props
 */
export function JointAvatars({ size = '24' }) {
  const s = JOINT_AVATAR_SIZES[size] ?? JOINT_AVATAR_SIZES[24]
  const inner =
    'font-syne absolute flex items-center justify-center rounded-full border border-border font-bold'

  return (
    <div className={`relative shrink-0 ${s.container}`} aria-hidden>
      <span className={`${inner} left-0 overflow-hidden ${s.inner}`}>
        <img src={AVATAR_G_URL} alt="Gabriel" className="h-full w-full object-cover" />
      </span>
      <span className={`${inner} right-0 overflow-hidden ${s.inner}`}>
        <img src={AVATAR_A_URL} alt="Ana" className="h-full w-full object-cover" />
      </span>
    </div>
  )
}
