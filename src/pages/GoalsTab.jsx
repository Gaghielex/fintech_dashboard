import { useMemo, useState, useCallback, useRef } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { computeGoalsLiquidAud } from '../utils/financeAggregate.js'
import { computeGoalsLiquidAllocation } from '../utils/goalProgress.js'
import { getGoalsSheetEditUrl } from '../utils/goalsSheetUrl.js'
import { GoalsLiquidStrip } from '../components/goals/GoalsLiquidStrip.jsx'
import { GoalCard } from '../components/goals/GoalCard.jsx'

const GOAL_ORDER_KEY = 'goal_order'

function goalKey(g) {
  return g.id ? String(g.id) : (g.goal_name ?? '')
}

function applyStoredOrder(goals, storedIds) {
  if (!storedIds) return goals
  const idToGoal = new Map(goals.map((g) => [goalKey(g), g]))
  const ordered = storedIds.filter((id) => idToGoal.has(id)).map((id) => idToGoal.get(id))
  const storedSet = new Set(storedIds)
  const newGoals = goals.filter((g) => !storedSet.has(goalKey(g)))
  return [...ordered, ...newGoals]
}

function DraggableGoalCard({ goal, allocatedAud, ratesReady, onReorderStart, onReorderEnd }) {
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)
  const timerRef = useRef(null)
  const savedEvent = useRef(null)
  const startPos = useRef(null)

  const cancelTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const activate = () => {
    setIsDragging(true)
    onReorderStart()
    controls.start(savedEvent.current)
  }

  const deactivate = () => {
    setIsDragging(false)
    onReorderEnd()
  }

  const handlePointerDown = (e) => {
    savedEvent.current = e
    startPos.current = { x: e.clientX, y: e.clientY }
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      activate()
    }, 2000)
  }

  const handlePointerMove = (e) => {
    if (!timerRef.current || !startPos.current) return
    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y
    if (Math.sqrt(dx * dx + dy * dy) > 8) cancelTimer()
  }

  const handlePointerUp = () => {
    cancelTimer()
    deactivate()
  }

  const handleDragEnd = () => deactivate()

  return (
    <Reorder.Item
      as="div"
      value={goal}
      dragListener={false}
      dragControls={controls}
      onDragEnd={handleDragEnd}
      style={{
        opacity: isDragging ? 0.55 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <GoalCard
        goal={goal}
        allocatedAud={allocatedAud}
        ratesReady={ratesReady}
        dragHandle={
          <button
            type="button"
            aria-label="Drag to reorder"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="absolute inset-x-0 top-0 flex cursor-grab justify-center pt-2.5 touch-none active:cursor-grabbing"
          >
            <div className="h-[3px] w-10 rounded-full bg-ink-faint/50" />
          </button>
        }
      />
    </Reorder.Item>
  )
}

/**
 * @param {{
 *   goals: import('../types/sheetTypes.js').GoalRow[],
 *   accounts: import('../types/sheetTypes.js').AccountRow[],
 *   settings: import('../types/sheetTypes.js').SettingsRow | null,
 *   latestRates: { JPY: number, USD: number } | null,
 *   spreadsheetId: string | undefined,
 *   sheetGids: Record<string, number> | undefined,
 * }} props
 */
export function GoalsTab({
  goals,
  accounts,
  settings,
  latestRates,
  spreadsheetId,
  sheetGids,
}) {
  const [upSaversOnly, setUpSaversOnly] = useState(true)

  const liquidAud = useMemo(
    () => computeGoalsLiquidAud(accounts, latestRates, { upSaversOnly }),
    [accounts, latestRates, upSaversOnly],
  )

  const ratesReady = Boolean(
    latestRates && latestRates.JPY > 0 && latestRates.USD > 0,
  )

  const [anyReordering, setAnyReordering] = useState(false)

  const [customOrder, setCustomOrder] = useState(() => {
    try {
      const stored = localStorage.getItem(GOAL_ORDER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const orderedGoals = useMemo(
    () => applyStoredOrder(goals, customOrder),
    [goals, customOrder],
  )

  const goalAllocations = useMemo(
    () => computeGoalsLiquidAllocation(orderedGoals, liquidAud),
    [orderedGoals, liquidAud],
  )

  const handleReorder = useCallback((newGoals) => {
    const ids = newGoals.map(goalKey)
    setCustomOrder(ids)
    localStorage.setItem(GOAL_ORDER_KEY, JSON.stringify(ids))
  }, [])

  const goalsUrl = useMemo(
    () =>
      spreadsheetId
        ? getGoalsSheetEditUrl(spreadsheetId, sheetGids)
        : null,
    [spreadsheetId, sheetGids],
  )

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col space-y-5 pb-6 pt-8">
      <header>
        <h1 className="font-syne text-2xl font-extrabold tracking-tight text-ink">
          Goals
        </h1>
      </header>

      <GoalsLiquidStrip
        liquidAud={liquidAud}
        ratesReady={ratesReady}
        goals={goals}
        upSaversOnly={upSaversOnly}
        onUpSaversOnlyChange={setUpSaversOnly}
      />

      <section>
        <div className="mb-4">
          <h2 className="font-syne text-base font-bold text-ink">Your goals</h2>
          {anyReordering && (
            <p className="font-dm-sans mt-1 flex items-center gap-1 text-xs text-ink-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Prioritize your goals by reordering them
            </p>
          )}
        </div>
        {!goals.length ? (
          <p className="font-dm-sans rounded-xl border border-dashed border-border bg-surface/60 px-4 py-6 text-center text-sm text-ink-muted">
            No rows on the <span className="font-dm-mono">Goals</span> tab yet.
            Use <span className="font-semibold text-ink">Add a goal</span> below.
          </p>
        ) : (
          <Reorder.Group
            as="div"
            axis="y"
            values={orderedGoals}
            onReorder={handleReorder}
            className="space-y-4"
          >
            {orderedGoals.map((g, idx) => (
              <DraggableGoalCard
                key={goalKey(g) || `goal-${idx}`}
                goal={g}
                allocatedAud={goalAllocations[idx] ?? 0}
                ratesReady={ratesReady}
                onReorderStart={() => setAnyReordering(true)}
                onReorderEnd={() => setAnyReordering(false)}
              />
            ))}
          </Reorder.Group>
        )}
      </section>

      <div className="mt-auto pt-2">
        {goalsUrl ? (
          <a
            href={goalsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm-sans flex w-full items-center justify-center rounded-xl bg-primary py-3 text-center text-sm font-semibold text-canvas transition hover:opacity-90"
          >
            Add a goal in Google Sheets
          </a>
        ) : (
          <p className="font-dm-sans text-center text-xs text-ink-faint">
            Set VITE_SHEET_ID to enable the sheet link.
          </p>
        )}
      </div>
    </div>
  )
}
