import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigation } from '../context/useNavigation.js'
import { convertToAud } from '../utils/currencyConvert.js'
import { formatMoney } from '../utils/formatCurrency.js'

// ─── constants ───────────────────────────────────────────────────────────────

const COUNTRY_ORDER = ['AU', 'JP', 'EC']
const COUNTRY_META = {
  AU: { label: 'Australia', flag: '🇦🇺', native: 'AUD' },
  JP: { label: 'Japan', flag: '🇯🇵', native: 'JPY' },
  EC: { label: 'Ecuador', flag: '🇪🇨', native: 'USD' },
}

const TYPE_ORDER = ['transaction', 'savings', 'term_deposit', 'super', 'other']
const TYPE_LABEL = {
  transaction: 'Transaction',
  savings: 'Savings',
  term_deposit: 'Term deposit',
  super: 'Super',
  other: 'Other',
}

const OWNER_ORDER = ['gabriel', 'ana', 'joint']
const OWNER_LABEL = { gabriel: 'Gabriel', ana: 'Ana', joint: 'Joint' }
const OWNER_INITIAL = { gabriel: 'G', ana: 'A', joint: 'J' }

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'gabriel', label: 'Gabriel' },
  { id: 'ana', label: 'Ana' },
  { id: 'joint', label: 'Joint' },
]

const GROUP_OPTIONS = [
  { id: 'country', label: 'By Country' },
  { id: 'type', label: 'By Type' },
  { id: 'person', label: 'By Person' },
]

// ─── helpers ─────────────────────────────────────────────────────────────────

function norm(s) {
  return String(s ?? '').trim().toLowerCase()
}

function toAud(account, rates) {
  return convertToAud(Number(account.balance) || 0, String(account.currency), rates)
}

function sumToAud(accounts, rates) {
  return accounts.reduce((s, a) => s + toAud(a, rates), 0)
}

function daysAgo(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return Math.floor((Date.now() - d.getTime()) / 86_400_000)
}

function fmtDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── badges ──────────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const cls =
    type === 'savings'
      ? 'bg-primary/10 text-primary'
      : type === 'term_deposit' || type === 'super'
        ? 'bg-accent-gold/10 text-accent-gold'
        : 'bg-surface-1 text-ink-muted'
  return (
    <span
      className={`font-dm-sans inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {TYPE_LABEL[type] ?? type}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    matured: ['bg-positive/10 text-positive', 'Matured'],
    pending_renewal: ['bg-accent-gold/10 text-accent-gold', 'Pending renewal'],
    inactive: ['bg-surface-1 text-ink-faint', 'Inactive'],
  }
  const entry = map[status]
  if (!entry) return null
  return (
    <span
      className={`font-dm-sans inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${entry[0]}`}
    >
      {entry[1]}
    </span>
  )
}

function OwnerInitial({ owner }) {
  const cls =
    owner === 'gabriel'
      ? 'bg-primary/15 text-primary'
      : owner === 'ana'
        ? 'bg-accent-gold/15 text-accent-gold'
        : 'bg-surface-1 text-ink-muted'
  return (
    <span
      className={`font-syne inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${cls}`}
    >
      {OWNER_INITIAL[owner] ?? (owner?.[0] ?? '?').toUpperCase()}
    </span>
  )
}

// ─── account row ─────────────────────────────────────────────────────────────

function AccountRow({ account, rates, staleThresholdDays }) {
  const [open, setOpen] = useState(false)

  const t = norm(account.type)
  const st = norm(account.status)
  const owner = norm(account.owner)
  const days = daysAgo(account.last_updated)
  const isStale = days != null && days > staleThresholdDays
  const isInactive = st === 'inactive'
  const audAmt = toAud(account, rates)
  const showNativeAud = account.currency !== 'AUD' && rates?.JPY > 0 && rates?.USD > 0
  const showRate =
    (t === 'savings' || t === 'term_deposit') && account.interest_rate != null
  const hasDetail =
    showRate || account.maturity_date || account.last_updated || account.notes

  return (
    <div
      className={`border-t border-border/40 ${isInactive ? 'opacity-40' : isStale ? 'border-l-2 border-l-warning/60' : ''}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-1/50"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-dm-sans text-sm font-medium text-ink">
              {account.bank}
            </span>
            {account.account_name && account.account_name !== account.bank && (
              <span className="font-dm-sans truncate text-sm text-ink-muted">
                {account.account_name}
              </span>
            )}
            {isStale && (
              <span className="font-dm-mono animate-pulse shrink-0 text-[10px] text-warning">
                🕐 {days}d ago
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <TypeBadge type={t} />
            <StatusBadge status={st} />
            <OwnerInitial owner={owner} />
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-dm-mono text-sm font-medium tabular-nums text-ink">
            {formatMoney(account.balance, account.currency)}
          </p>
          {showNativeAud && (
            <p className="font-dm-mono text-xs tabular-nums text-ink-muted">
              ≈ {formatMoney(audAmt, 'AUD')}
            </p>
          )}
        </div>

        {hasDetail && (
          <span
            className="mt-0.5 shrink-0 font-dm-sans text-xs text-ink-faint"
            style={{
              transition: 'transform 0.15s',
              transform: open ? 'rotate(180deg)' : 'none',
            }}
            aria-hidden
          >
            ▾
          </span>
        )}
      </button>

      {open && hasDetail && (
        <div className="border-t border-border/30 bg-canvas px-4 pb-4 pt-3">
          <dl className="font-dm-mono space-y-1.5 text-xs">
            {showRate && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Interest rate</dt>
                <dd className="text-ink">{account.interest_rate}% p.a.</dd>
              </div>
            )}
            {account.maturity_date && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Maturity date</dt>
                <dd className="text-ink">{fmtDate(account.maturity_date)}</dd>
              </div>
            )}
            {account.last_updated && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Last updated</dt>
                <dd className={isStale ? 'text-warning' : 'text-ink'}>
                  {fmtDate(account.last_updated)}
                </dd>
              </div>
            )}
            {account.notes && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Notes</dt>
                <dd className="max-w-[65%] text-right text-ink">{account.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}

// ─── collapsible section ─────────────────────────────────────────────────────

function AccountSection({
  sectionKey,
  title,
  subtitle,
  totalAud,
  nativeTotal,
  nativeCcy,
  count,
  collapsed,
  onToggle,
  accounts,
  rates,
  staleThresholdDays,
  variant = 'default',
}) {
  const isRetirement = variant === 'retirement'

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-surface ${
        isRetirement ? 'border-accent-gold/40' : 'border-border'
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-1/30"
        aria-expanded={!collapsed}
      >
        <div className="min-w-0">
          <p className="font-syne text-sm font-bold text-ink">{title}</p>
          {subtitle && (
            <p className="font-dm-sans text-xs text-ink-muted">{subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            {nativeTotal != null && nativeCcy && nativeCcy !== 'AUD' && (
              <p className="font-dm-mono text-xs font-medium tabular-nums text-ink">
                {formatMoney(nativeTotal, nativeCcy)}
              </p>
            )}
            <p
              className={`font-dm-mono text-xs tabular-nums ${
                nativeCcy !== 'AUD' ? 'text-ink-muted' : 'font-medium text-ink'
              }`}
            >
              {formatMoney(totalAud, 'AUD')}
            </p>
            <p className="font-dm-sans text-[10px] text-ink-faint">
              {count} account{count === 1 ? '' : 's'}
            </p>
          </div>
          <span
            className="font-dm-sans text-xs text-ink-faint"
            style={{
              transition: 'transform 0.2s',
              transform: collapsed ? 'rotate(-90deg)' : 'none',
            }}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>

      {!collapsed && (
        <div>
          {accounts.map((a) => (
            <AccountRow
              key={a.id || `${a.bank}-${a.account_name}`}
              account={a}
              rates={rates}
              staleThresholdDays={staleThresholdDays}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── main ────────────────────────────────────────────────────────────────────

/**
 * @param {{
 *   accounts: import('../types/sheetTypes.js').AccountRow[],
 *   loading: boolean,
 *   error: string | null,
 *   latestRates: { JPY: number, USD: number } | null,
 *   settings: import('../types/sheetTypes.js').SettingsRow | null,
 * }} props
 */
export function AccountsTab({ accounts = [], loading, error, latestRates, settings }) {
  const { accountsEntry } = useNavigation()
  const rates = useMemo(
    () => latestRates ?? { JPY: 0, USD: 0 },
    [latestRates],
  )
  const staleThresholdDays = settings?.stale_threshold_days ?? 30

  const [activeFilter, setActiveFilter] = useState('all')
  const [groupMode, setGroupMode] = useState('country')
  const [collapsedSections, setCollapsedSections] = useState(() => new Set())

  /* eslint-disable react-hooks/set-state-in-effect -- reset filters when Home drill-down context changes */
  useEffect(() => {
    setGroupMode('country')
    if (accountsEntry.owner) {
      setActiveFilter(accountsEntry.owner)
      setCollapsedSections(new Set())
    } else if (accountsEntry.country) {
      setActiveFilter('all')
      const all = ['AU', 'JP', 'EC', 'retirement']
      setCollapsedSections(new Set(all.filter((s) => s !== accountsEntry.country)))
    } else if (accountsEntry.retirementOnly) {
      setActiveFilter('all')
      setCollapsedSections(new Set(['AU', 'JP', 'EC']))
    } else {
      setActiveFilter('all')
      setCollapsedSections(new Set())
    }
  }, [accountsEntry])
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleSection = useCallback((key) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleGroupChange = useCallback((mode) => {
    setGroupMode(mode)
    setCollapsedSections(new Set())
  }, [])

  // Gabriel/Ana filters include joint to match home screen ownership totals
  const filteredAccounts = useMemo(() => {
    let result = accounts
    if (accountsEntry.retirementOnly) {
      result = result.filter((a) => norm(a.type) === 'super')
    }
    if (activeFilter === 'gabriel') {
      result = result.filter(
        (a) => norm(a.owner) === 'gabriel' || norm(a.owner) === 'joint',
      )
    } else if (activeFilter === 'ana') {
      result = result.filter(
        (a) => norm(a.owner) === 'ana' || norm(a.owner) === 'joint',
      )
    } else if (activeFilter === 'joint') {
      result = result.filter((a) => norm(a.owner) === 'joint')
    }
    return result
  }, [accounts, activeFilter, accountsEntry.retirementOnly])

  const totalVisibleAud = useMemo(
    () => sumToAud(filteredAccounts, rates),
    [filteredAccounts, rates],
  )

  const sections = useMemo(() => {
    if (groupMode === 'country') {
      const result = []
      for (const cc of COUNTRY_ORDER) {
        const meta = COUNTRY_META[cc]
        const accs = filteredAccounts.filter(
          (a) => norm(a.country) === cc.toLowerCase() && norm(a.type) !== 'super',
        )
        if (!accs.length) continue
        const allSameCcy = accs.every(
          (a) => norm(a.currency) === meta.native.toLowerCase(),
        )
        result.push({
          key: cc,
          title: `${meta.flag} ${meta.label}`,
          totalAud: sumToAud(accs, rates),
          nativeTotal: allSameCcy
            ? accs.reduce((s, a) => s + (Number(a.balance) || 0), 0)
            : null,
          nativeCcy: meta.native,
          count: accs.length,
          accounts: accs,
          variant: 'default',
        })
      }
      const superAccs = filteredAccounts.filter((a) => norm(a.type) === 'super')
      if (superAccs.length) {
        result.push({
          key: 'retirement',
          title: 'Retirement',
          subtitle: 'Superannuation',
          totalAud: sumToAud(superAccs, rates),
          nativeTotal: null,
          nativeCcy: 'AUD',
          count: superAccs.length,
          accounts: superAccs,
          variant: 'retirement',
        })
      }
      return result
    }

    if (groupMode === 'type') {
      return TYPE_ORDER.flatMap((type) => {
        const accs = filteredAccounts.filter((a) => norm(a.type) === type)
        if (!accs.length) return []
        return [
          {
            key: type,
            title: TYPE_LABEL[type] ?? type,
            totalAud: sumToAud(accs, rates),
            nativeTotal: null,
            nativeCcy: 'AUD',
            count: accs.length,
            accounts: accs,
            variant: 'default',
          },
        ]
      })
    }

    if (groupMode === 'person') {
      return OWNER_ORDER.flatMap((owner) => {
        const accs = filteredAccounts.filter((a) => norm(a.owner) === owner)
        if (!accs.length) return []
        return [
          {
            key: owner,
            title: OWNER_LABEL[owner] ?? owner,
            totalAud: sumToAud(accs, rates),
            nativeTotal: null,
            nativeCcy: 'AUD',
            count: accs.length,
            accounts: accs,
            variant: 'default',
          },
        ]
      })
    }

    return []
  }, [filteredAccounts, groupMode, rates])

  return (
    <div className="space-y-4 pb-6">
      <header>
        <h1 className="font-syne text-2xl font-extrabold tracking-tight text-ink">
          Accounts
        </h1>
        <div className="mt-1 flex items-baseline gap-2">
          {loading ? (
            <p className="font-dm-sans text-sm text-ink-muted">Loading…</p>
          ) : (
            <>
              <span className="font-dm-mono text-sm font-medium tabular-nums text-ink">
                {formatMoney(totalVisibleAud, 'AUD', { maxFractionDigits: 0 })}
              </span>
              <span className="font-dm-sans text-xs text-ink-muted">
                · {filteredAccounts.length} account
                {filteredAccounts.length === 1 ? '' : 's'}
              </span>
            </>
          )}
        </div>
      </header>

      {error && (
        <p className="font-dm-sans rounded-lg border border-negative/40 bg-negative/10 px-3 py-2 text-sm text-negative">
          {error}
        </p>
      )}

      {!accountsEntry.retirementOnly && (
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveFilter(opt.id)}
              className={`font-dm-sans shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === opt.id
                  ? 'bg-primary text-canvas'
                  : 'border border-border bg-surface text-ink-muted hover:bg-surface-1'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
        {GROUP_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleGroupChange(opt.id)}
            className={`font-dm-sans flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
              groupMode === opt.id
                ? 'bg-surface-1 text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {!loading && sections.length === 0 ? (
        <p className="font-dm-sans py-10 text-center text-sm text-ink-muted">
          No accounts match this filter.
        </p>
      ) : (
        <div className="space-y-3">
          {sections.map((s) => (
            <AccountSection
              key={s.key}
              sectionKey={s.key}
              title={s.title}
              subtitle={s.subtitle}
              totalAud={s.totalAud}
              nativeTotal={s.nativeTotal}
              nativeCcy={s.nativeCcy}
              count={s.count}
              collapsed={collapsedSections.has(s.key)}
              onToggle={toggleSection}
              accounts={s.accounts}
              rates={rates}
              staleThresholdDays={staleThresholdDays}
              variant={s.variant}
            />
          ))}
        </div>
      )}
    </div>
  )
}
