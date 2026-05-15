/** @typedef {'gabriel' | 'ana' | 'joint'} OwnerKey */

/**
 * @param {{ flag: string, label?: string }} props
 */
export function FlagBadge({ flag, label }) {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface-1 text-[0.85rem] leading-none"
      role="img"
      aria-label={label}
    >
      {flag}
    </span>
  )
}

const SINGLE_AVATAR_SIZES = {
  24: 'h-6 w-6 text-[0.65rem]',
  40: 'h-10 w-10 text-[0.8rem]',
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
  return (
    <span
      className={`font-syne flex shrink-0 items-center justify-center rounded-full border border-border font-bold ${dim} ${
        isGabriel
          ? 'bg-primary/15 text-primary'
          : 'bg-accent-pink/15 text-accent-pink'
      }`}
      aria-hidden
    >
      {isGabriel ? 'G' : 'A'}
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
    container: 'h-10 w-10',
    inner: 'top-[0.35rem] h-[1.45rem] w-[1.45rem] text-[0.75rem]',
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
      <span className={`${inner} left-0 bg-surface-1 text-primary ${s.inner}`}>
        G
      </span>
      <span className={`${inner} right-0 bg-surface text-accent-pink ${s.inner}`}>
        A
      </span>
    </div>
  )
}
