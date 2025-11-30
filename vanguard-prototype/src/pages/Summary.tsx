import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockControls } from '../mocks/mockData'
import { mockRequests } from '../mocks/mockData'
import { exportDashboardSummary, exportSelectedComponents } from '../utils/exportData'

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
  
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [playAnim, setPlayAnim] = useState(true)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [compModalOpen, setCompModalOpen] = useState(false)
  const [compSelected, setCompSelected] = useState<string[]>(['summary', 'controls', 'requests'])
  const [compFormat, setCompFormat] = useState<'json' | 'excel'>('json')

  // Basic metrics
  const totalTests = mockRequests.length
  const notStartedRequests = mockRequests.filter((r) => String(r.status ?? '').toLowerCase() === 'pending').length
  const openRequests = mockRequests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length
  const totalControls = mockControls.length
  const completed = mockControls.filter((c) => String(c.dat?.status ?? '').toLowerCase() === 'completed' || /completed/i.test(String(c.testingNotes ?? '') + String(c.sme ?? ''))).length
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
      <style>{`
        .clickable { cursor: pointer; }
        .clickable:hover, .clickable:focus { text-decoration: underline; }
        .clickable:focus { outline: 2px solid rgba(26,136,255,0.12); outline-offset: 2px; }
        button.clickable { text-decoration: none; }
        button.clickable:hover, button.clickable:focus { text-decoration: underline; }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0 }}>Overview Dashboard</h2>
          <div style={{ color: '#666', marginTop: 6 }}>Live dashboard of controls and requests — actionable insights at a glance.</div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <button className="clickable" onClick={() => setExportMenuOpen((s) => !s)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e6eefc', background: '#fff' }}>Export ▾</button>
            {exportMenuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid #eee', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', borderRadius: 8, zIndex: 40, minWidth: 220 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className="clickable" onClick={() => { exportDashboardSummary(mockControls, mockRequests, 'json'); setExportMenuOpen(false) }} style={{ padding: 10, textAlign: 'left', border: 'none', background: 'transparent' }}>Export JSON</button>
                  <button className="clickable" onClick={() => { exportDashboardSummary(mockControls, mockRequests, 'excel'); setExportMenuOpen(false) }} style={{ padding: 10, textAlign: 'left', border: 'none', background: 'transparent' }}>Export Excel</button>
                  <button className="clickable" onClick={() => { setCompModalOpen(true); setExportMenuOpen(false) }} style={{ padding: 10, textAlign: 'left', border: 'none', background: 'transparent' }}>Export Components...</button>
                </div>
              </div>
            )}
          </div>

          <button className="clickable" onClick={() => { setIsRefreshing(true); window.location.reload() }} disabled={isRefreshing} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: isRefreshing ? '#ccc' : '#1a88ff', color: '#fff' }}>{isRefreshing ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>

      {/* Top tiles */}

      {/* Components export modal */}
      {compModalOpen && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
          <div style={{ width: 560, background: '#fff', borderRadius: 8, padding: 18, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>Export Components</h3>
            <div style={{ color: '#666', marginBottom: 12 }}>Choose which parts of the dashboard to include in the export.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { key: 'summary', label: 'Summary Metrics' },
                { key: 'controls', label: 'Controls' },
                { key: 'requests', label: 'Requests' },
                { key: 'upcoming', label: 'Upcoming Due' },
                { key: 'teamBandwidth', label: 'Team Bandwidth' },
              ].map((opt) => (
                <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6, border: '1px solid #f4f4f4' }}>
                  <input type="checkbox" checked={compSelected.includes(opt.key)} onChange={(e) => {
                    if (e.target.checked) setCompSelected((s) => Array.from(new Set([...s, opt.key])))
                    else setCompSelected((s) => s.filter((x) => x !== opt.key))
                  }} />
                  <div>{opt.label}</div>
                </label>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 8, fontSize: 13 }}>Format</div>
              <label style={{ marginRight: 12 }}><input type="radio" name="compFormat" value="json" checked={compFormat === 'json'} onChange={() => setCompFormat('json')} /> JSON</label>
              <label><input type="radio" name="compFormat" value="excel" checked={compFormat === 'excel'} onChange={() => setCompFormat('excel')} /> Excel</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button className="clickable" onClick={() => setCompModalOpen(false)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}>Cancel</button>
              <button className="clickable" onClick={() => {
                exportSelectedComponents(mockControls, mockRequests, compSelected, compFormat)
                setCompModalOpen(false)
              }} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#1a88ff', color: '#fff' }}>Export</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 18 }}>
        <div className="clickable" role="button" onClick={() => navigate('/requests')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Total Tests</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedTotal}</div>
        </div>
        <div className="clickable" role="button" onClick={() => navigate('/requests?status=pending')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Not Started</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedNotStarted}</div>
        </div>
        <div className="clickable" role="button" onClick={() => navigate('/requests?status=open')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Open Requests</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedOpen}</div>
        </div>
        <div className="clickable" role="button" onClick={() => navigate('/controls?status=completed')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#666', fontSize: 12 }}>Completion</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{animatedCompletion}%</div>
        </div>
        <div className="clickable" role="button" onClick={() => navigate('/controls?metric=avgDays')} style={{ padding: 14, borderRadius: 10, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
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
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/controls/${c.id}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/controls/${c.id}`) }}
                  title={`Open control ${c.id}`}
                  style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid #f4f4f4', cursor: 'pointer' }}
                >
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
          <h4 style={{ marginTop: 0 }}>Team Member Bandwidth (In Progress Tests / Total Tests Assigned)</h4>
          <div>
            {(() => {
              // Build tester -> { inProgress, total }
              const map: Record<string, { inProgress: number; total: number }> = {}
              for (const r of mockRequests) {
                const ctrl = mockControls.find((c) => String(c.id) === String(r.controlId))
                const tester = String(ctrl?.tester ?? 'Unassigned')
                if (!map[tester]) map[tester] = { inProgress: 0, total: 0 }
                map[tester].total += 1
                if (String(r.status ?? '').toLowerCase() === 'in progress') map[tester].inProgress += 1
              }
              const list = Object.entries(map).sort((a, b) => b[1].total - a[1].total)
              if (list.length === 0) return <div className="empty">No assigned tests</div>
              return list.slice(0, 12).map(([name, counts]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                  <div>{name}</div>
                  <div style={{ fontWeight: 700 }}>{counts.inProgress}/{counts.total}</div>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
