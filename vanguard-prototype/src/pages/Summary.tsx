import { useEffect, useState } from 'react'
import { mockControls } from '../mocks/mockData'
import { mockRequests } from '../mocks/mockData'
import { exportDashboardSummary } from '../utils/exportData'

// Minimal helper: simple count-up hook
function useCountUp(to: number, duration = 600, play = true) {
  const [val, setVal] = useState<number>(play ? 0 : to)
  useEffect(() => {
    if (!play) return setVal(to)
    let start: number | null = null
    let raf = 0
    const step = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min(1, (ts - (start as number)) / duration)
      setVal(Math.round(p * to))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration, play])
  return val
}

// Very small inline chart placeholders to avoid extra dependencies
function SmallDonut({ value, size = 80 }: { value: number; size?: number }) {
  const radius = size / 2 - 4
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(100, value))
  const dash = (pct / 100) * circumference
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="#f3f6fb" />
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#4caf50" strokeWidth={8} strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" fill="none" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={12} fontWeight={700} fill="#172b4d">{pct}%</text>
    </svg>
  )
}

export default function Summary() {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [playAnim, setPlayAnim] = useState(true)

  // Basic metrics
  const totalControls = mockControls.length
  const completed = mockControls.filter((c) => String(c.dat?.status ?? '').toLowerCase() === 'completed' || /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? ''))).length
  const completionPct = totalControls === 0 ? 0 : Math.round((completed / totalControls) * 100)
  const openRequests = mockRequests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length
  const activeControls = mockControls.filter((c) => (c.dat?.status ?? '').toLowerCase() !== 'completed').length

  const animatedTotal = useCountUp(totalControls, 800, playAnim)
  const animatedActive = useCountUp(activeControls, 800, playAnim)
  const animatedOpen = useCountUp(openRequests, 800, playAnim)
  const animatedCompletion = useCountUp(completionPct, 800, playAnim)

  useEffect(() => {
    if (!playAnim) return
    const t = setTimeout(() => setPlayAnim(false), 1200)
    return () => clearTimeout(t)
  }, [playAnim])

  function formatBadgeDate(d?: string) {
    if (!d) return '—'
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return String(d)
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <div className="panel" style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0 }}>Overview Dashboard</h2>
          <div style={{ color: '#666', marginTop: 6 }}>Live dashboard of controls and requests — actionable insights at a glance.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowExportMenu(!showExportMenu)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
              Export ▾
            </button>
            {showExportMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', padding: 6 }}>
                <button onClick={() => { exportDashboardSummary(mockControls, mockRequests, 'csv'); setShowExportMenu(false) }} style={{ display: 'block', width: 180, padding: 8, textAlign: 'left', background: 'transparent', border: 'none' }}>Export as CSV</button>
                <button onClick={() => { exportDashboardSummary(mockControls, mockRequests, 'json'); setShowExportMenu(false) }} style={{ display: 'block', width: 180, padding: 8, textAlign: 'left', background: 'transparent', border: 'none' }}>Export as JSON</button>
                <button onClick={() => { exportDashboardSummary(mockControls, mockRequests, 'excel'); setShowExportMenu(false) }} style={{ display: 'block', width: 180, padding: 8, textAlign: 'left', background: 'transparent', border: 'none' }}>Export as Excel</button>
              </div>
            )}
          </div>
          <button onClick={() => { setIsRefreshing(true); window.location.reload() }} disabled={isRefreshing} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: isRefreshing ? '#ccc' : '#1a88ff', color: '#fff' }}>{isRefreshing ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>

      {/* Top tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 18 }}>
        <div style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Total</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedTotal}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Active</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedActive}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Open Requests</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedOpen}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Completion</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedCompletion}%</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Owners</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{Object.keys(mockControls.reduce<Record<string, number>>((acc, c) => { acc[c.owner || 'Unassigned'] = (acc[c.owner || 'Unassigned'] || 0) + 1; return acc }, {})).length}</div>
        </div>
      </div>

      {/* Main area: left large + right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <div style={{ padding: 16, borderRadius: 10, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginTop: 0 }}>Overview</h3>
          <div style={{ height: 320, borderRadius: 8, background: '#f6f6f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            {/* Placeholder for Gantt / main visualization */}
            <div>Schedule visualization (Gantt) placeholder</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, color: '#666' }}>Completion</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SmallDonut value={completionPct} size={90} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{completionPct}%</div>
                <div style={{ color: '#666', fontSize: 13 }}>{completed} of {totalControls} completed</div>
              </div>
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Upcoming Due</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockControls.filter((c) => c.dueDate).sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate))).slice(0, 4).map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <div>{c.name.length > 40 ? c.name.substring(0, 40) + '...' : c.name}</div>
                  <div style={{ color: '#666' }}>{formatBadgeDate(c.dueDate)}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: 13 }}>Small widget</div>
          </div>
        </div>
      </div>

      {/* Bottom: simple lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div style={{ padding: 12, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <h4 style={{ marginTop: 0 }}>Ratings</h4>
          <div style={{ color: '#666' }}>Summary of DAT/testing ratings.</div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <h4 style={{ marginTop: 0 }}>Top owners</h4>
          <div>
            {(() => {
              const ownerCounts = mockControls.reduce<Record<string, number>>((acc, c) => { const k = (c.owner || 'Unassigned') as string; acc[k] = (acc[k] ?? 0) + 1; return acc }, {})
              return Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                  <div>{k}</div>
                  <div style={{ fontWeight: 700 }}>{v}</div>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
