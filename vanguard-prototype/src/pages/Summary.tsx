import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

// (Removed SmallDonut — not required after layout changes)

export default function Summary() {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [playAnim, setPlayAnim] = useState(true)

  // Basic metrics
  const totalTests = mockRequests.length
  const notStartedRequests = mockRequests.filter((r) => String(r.status ?? '').toLowerCase() === 'pending').length
  const openRequests = mockRequests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length
  const totalControls = mockControls.length
  const completed = mockControls.filter((c) => String(c.dat?.status ?? '').toLowerCase() === 'completed' || /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? ''))).length
  const completionPct = totalControls === 0 ? 0 : Math.round((completed / totalControls) * 100)

  const animatedTotal = useCountUp(totalTests, 800, playAnim)
  const animatedNotStarted = useCountUp(notStartedRequests, 800, playAnim)
  const animatedOpen = useCountUp(openRequests, 800, playAnim)
  const animatedCompletion = useCountUp(completionPct, 800, playAnim)

  // Average time to complete controls (days) using startDate -> completedDate on controls
  const avgDaysToComplete = (() => {
    const diffs: number[] = []
    for (const c of mockControls) {
      if (!c.startDate || !c.completedDate) continue
      const s = new Date(c.startDate)
      const e = new Date(c.completedDate)
      if (isNaN(s.getTime()) || isNaN(e.getTime())) continue
      const days = Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)))
      diffs.push(days)
    }
    if (diffs.length === 0) return 0
    const sum = diffs.reduce((a, b) => a + b, 0)
    return Math.round(sum / diffs.length)
  })()
  const animatedAvgDays = useCountUp(avgDaysToComplete, 800, playAnim)

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
        <div role="button" onClick={() => navigate('/requests')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Total Tests</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedTotal}</div>
        </div>
        <div role="button" onClick={() => navigate('/requests?status=pending')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Not Started</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedNotStarted}</div>
        </div>
        <div role="button" onClick={() => navigate('/requests?status=open')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Open Requests</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedOpen}</div>
        </div>
        <div role="button" onClick={() => navigate('/controls?status=completed')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Completion</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedCompletion}%</div>
        </div>
        <div role="button" onClick={() => navigate('/controls?metric=avgDays')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Avg Days to Complete</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedAvgDays}</div>
        </div>
      </div>

      {/* Main area: left large + right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <div style={{ padding: 20, borderRadius: 10, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginTop: 0 }}>Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* DAT Distribution (stacked) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>DAT Distribution</strong>
                <div style={{ color: '#666', fontSize: 12 }}>{totalControls} controls</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(() => {
                  const map: Record<string, number> = {}
                  for (const c of mockControls) {
                    const k = String(c.dat?.status ?? 'Unspecified')
                    map[k] = (map[k] || 0) + 1
                  }
                  const list = Object.entries(map).sort((a, b) => b[1] - a[1])
                  return list.map(([k, v]) => {
                    const pct = Math.round((v / Math.max(1, totalControls)) * 100)
                    return (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 32, background: '#e6eefc', borderRadius: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <div style={{ color: '#222' }}>{k}</div>
                            <div style={{ color: '#666' }}>{v} ({pct}%)</div>
                          </div>
                          <div style={{ height: 8, background: '#f0f4ff', borderRadius: 6, marginTop: 6 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#4f7ef8', borderRadius: 6 }} />
                          </div>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>

            {/* OET Distribution (stacked) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>OET Distribution</strong>
                <div style={{ color: '#666', fontSize: 12 }}>{totalControls} controls</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(() => {
                  const map: Record<string, number> = {}
                  for (const c of mockControls) {
                    const k = String(c.oet?.status ?? 'Unspecified')
                    map[k] = (map[k] || 0) + 1
                  }
                  const list = Object.entries(map).sort((a, b) => b[1] - a[1])
                  return list.map(([k, v]) => {
                    const pct = Math.round((v / Math.max(1, totalControls)) * 100)
                    return (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 32, background: '#fff3e6', borderRadius: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <div style={{ color: '#222' }}>{k}</div>
                            <div style={{ color: '#666' }}>{v} ({pct}%)</div>
                          </div>
                          <div style={{ height: 8, background: '#fff7f0', borderRadius: 6, marginTop: 6 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#ff9a3c', borderRadius: 6 }} />
                          </div>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: 18, borderRadius: 10, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', flex: 1, minHeight: 260 }}>
            <h4 style={{ margin: '0 0 12px 0' }}>Upcoming Due</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mockControls.filter((c) => c.dueDate).sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate))).slice(0, 8).map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid #f4f4f4' }}>
                  <div style={{ fontWeight: 600 }}>{c.name.length > 60 ? c.name.substring(0, 60) + '...' : c.name}</div>
                  <div style={{ color: '#666' }}>{formatBadgeDate(c.dueDate)}</div>
                </div>
              ))}
              {mockControls.filter((c) => c.dueDate).length === 0 && <div className="empty">No upcoming due dates</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: simple lists (Ratings removed; Top owners full width) */}
      <div style={{ marginTop: 14 }}>
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
