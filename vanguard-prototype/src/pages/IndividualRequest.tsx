import { useState, useContext, useMemo } from 'react'
import { mockRequests, mockControls } from '../mocks/mockData'
import CreateRequestModal from '../components/CreateRequestModal'
import RequestsKanban from '../components/RequestsKanban'
import type { TestRequest } from '../lib/types'
import RequestModal from '../components/RequestModal'
import './ActiveControlsTestingList.css'
import DevContext from '../contexts/DevContext'

function CalendarView({ requests, onDayClick }: { requests: TestRequest[], onDayClick?: (dateKey: string, d: Date) => void }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState<number>(today.getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth())

  function startOfMonthMatrix(year: number, month: number) {
    const first = new Date(year, month, 1)
    const startDay = first.getDay() // 0 (Sun) - 6
    const start = new Date(year, month, 1 - startDay)
    const weeks: Date[][] = []
    let cur = new Date(start)
    for (let wk = 0; wk < 6; wk++) {
      const week: Date[] = []
      for (let d = 0; d < 7; d++) {
        week.push(new Date(cur))
        cur.setDate(cur.getDate() + 1)
      }
      weeks.push(week)
    }
    return weeks
  }

  function formatKey(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  const requestsByDate = useMemo(() => {
    const map: Record<string, TestRequest[]> = {}
    for (const r of requests) {
      if (!r.dueDate) continue
      const k = String(r.dueDate)
      map[k] = map[k] || []
      map[k].push(r)
    }
    return map
  }, [requests])

  const weeks = useMemo(() => startOfMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth])

  const monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ]

  const years = useMemo(() => {
    const list: number[] = []
    const start = today.getFullYear() - 2
    for (let y = start; y <= today.getFullYear() + 2; y++) list.push(y)
    return list
  }, [])

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => { const nm = viewMonth - 1; if (nm < 0) { setViewMonth(11); setViewYear((y) => y - 1) } else setViewMonth(nm) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>&lt;</button>
        <select value={viewMonth} onChange={(e) => setViewMonth(Number(e.target.value))} style={{ padding: 6 }}>
          {monthNames.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select value={viewYear} onChange={(e) => setViewYear(Number(e.target.value))} style={{ padding: 6 }}>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <div style={{ marginLeft: 'auto' }} />
        <button onClick={() => { const nm = viewMonth + 1; if (nm > 11) { setViewMonth(0); setViewYear((y) => y + 1) } else setViewMonth(nm) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>&gt;</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', color: '#666', fontSize: 13, marginBottom: 8 }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((h) => <div key={h}>{h}</div>)}
      </div>

      <div style={{ display: 'grid', gridTemplateRows: 'repeat(6, 1fr)', gap: 8 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {week.map((d) => {
              const inMonth = d.getMonth() === viewMonth
              const key = formatKey(d)
              const items = requestsByDate[key] || []
              return (
                <div key={key} onClick={() => onDayClick?.(key, d)} style={{ minHeight: 56, padding: 8, borderRadius: 6, background: inMonth ? '#fff' : '#fafafa', border: '1px solid #f0f0f0', position: 'relative', cursor: onDayClick ? 'pointer' : 'default' }}>
                  <div style={{ position: 'absolute', top: 6, left: 8, fontSize: 13, color: inMonth ? '#222' : '#bbb' }}>{d.getDate()}</div>
                  <div style={{ marginTop: 18 }}>
                    {items.slice(0, 2).map((it) => (
                      <div key={String(it.id || it.scope)} style={{ background: '#222', color: '#fff', padding: '6px 8px', borderRadius: 6, fontSize: 12, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={String(it.scope ?? it.id)}>
                        {String(it.scope ?? `Req ${it.id}`).slice(0, 24)}
                      </div>
                    ))}
                    {items.length > 2 && <div style={{ fontSize: 12, color: '#666' }}>+{items.length - 2} more</div>}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function IndividualRequest() {
  const [showMock, setShowMock] = useState(true)
  const [viewMode, setViewMode] = useState<'Pop Up' | 'Compact' | 'Kanban'>('Pop Up')
  const [openRequest, setOpenRequest] = useState<Record<string, boolean>>({})
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})
  const [dayModalDate, setDayModalDate] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editPreference, setEditPreference] = useState<'route' | 'modal'>('route')
  const [activeTab, setActiveTab] = useState<'tests' | 'requests' | 'kanban' | 'calendar'>('requests')
  
  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
  }

  // subscribe to global devMode for immediate updates when header toggles
  const ctx = useContext(DevContext)
  const devMode = ctx?.devMode ?? (() => {
    try {
      const v = localStorage.getItem('devMode')
      return v === null ? true : v === 'true'
    } catch (e) { return true }
  })()

  // (status search/filter logic removed — not used in current layout)

  

  const controlsWithRequests = useMemo(() => {
    return mockControls.filter((c) => mockRequests.some((r) => String(r.controlId) === String(c.id)))
  }, [])

  const visibleRequestKeys = useMemo(() => mockRequests.map((r, i) => String(r.id ?? `req-${i}`)), [])
  const allVisibleSelected = visibleRequestKeys.length > 0 && visibleRequestKeys.every((k) => Boolean(selectedIds[k]))

  function requestsForControl(controlId: string | number) {
    return mockRequests.filter((r) => String(r.controlId) === String(controlId))
  }

  return (
    <div className="control-list-page">
      <h2>Active Testing List</h2>
      <p style={{ marginTop: 6, color: '#444' }}>Requests list / single request entry point.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
        {devMode && (
          <div>
            <label style={{ fontSize: 13, color: '#444', marginRight: 8 }}>View:</label>
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value as any)} style={{ padding: '6px 8px', borderRadius: 6 }}>
              <option value="Pop Up">Pop Up</option>
              <option value="Compact">Compact</option>
              <option value="Kanban">Kanban</option>
            </select>
          </div>
        )}

        {devMode && (
          <div>
            <label style={{ fontSize: 13, color: '#444', marginRight: 8 }}>Edit Mode:</label>
            <select value={editPreference} onChange={(e) => setEditPreference(e.target.value as any)} style={{ padding: '6px 8px', borderRadius: 6 }}>
              <option value="route">Route (open edit page)</option>
              <option value="modal">Inline Modal</option>
            </select>
          </div>
        )}

        {devMode ? (
          <p style={{ margin: 0 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
              {showMock ? 'Hide mock requests' : 'Show mock requests'}
            </a>
          </p>
        ) : null}

        
      </div>

      <div className="controls-container">
        {devMode && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Selected view: <strong>{viewMode}</strong></div>
        )}

        {showMock ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 18 }}>
                <div role="button" tabIndex={0} onClick={() => setActiveTab('tests')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('tests') }} style={{ borderBottom: activeTab === 'tests' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer' }}>Tests</div>
                <div role="button" tabIndex={0} onClick={() => setActiveTab('requests')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('requests') }} style={{ borderBottom: activeTab === 'requests' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'requests' ? '#111' : '#888' }}>Requests</div>
                <div role="button" tabIndex={0} onClick={() => setActiveTab('kanban')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('kanban') }} style={{ borderBottom: activeTab === 'kanban' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'kanban' ? '#111' : '#888' }}>Kanban</div>
                <div role="button" tabIndex={0} onClick={() => setActiveTab('calendar')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('calendar') }} style={{ borderBottom: activeTab === 'calendar' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'calendar' ? '#111' : '#888' }}>Calendar</div>
              </div>
              <div>
                <button onClick={() => setShowCreate(true)} style={{ padding: '8px 12px', borderRadius: 6, background: '#444', color: '#fff', border: 'none' }}>+ New Request</button>
              </div>
            </div>

            {activeTab === 'kanban' ? (
              <RequestsKanban requests={mockRequests} />
            ) : activeTab === 'tests' ? (
              <div style={{ borderTop: '1px solid #e6e6e6', paddingTop: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '48px 3fr 1fr 1fr 1fr 1fr 1fr', gap: 12, padding: '8px 12px', alignItems: 'center', fontWeight: 700, color: '#222', borderBottom: '1px solid #e6e6e6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input
                      type="checkbox"
                      aria-label="Select all requests"
                      checked={allVisibleSelected}
                      onChange={() => {
                        if (allVisibleSelected) {
                          setSelectedIds({})
                        } else {
                          const map: Record<string, boolean> = {}
                          visibleRequestKeys.forEach((k) => { map[k] = true })
                          setSelectedIds(map)
                        }
                      }}
                    />
                  </div>
                  <div>Control</div>
                  <div>Tester</div>
                  <div>Test Type</div>
                  <div>Status</div>
                  <div>In-Progress Step</div>
                  <div>Date Updated</div>
                </div>

                <div>
                  {mockRequests.map((r, idx) => {
                    const ctrl = mockControls.find((c) => String(c.id) === String(r.controlId))
                    const rowKey = String(r.id ?? `req-${idx}`)
                    return (
                      <div key={rowKey} style={{ display: 'grid', gridTemplateColumns: '48px 3fr 1fr 1fr 1fr 1fr 1fr', gap: 12, padding: '12px', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <input
                            type="checkbox"
                            aria-label={`Select request ${rowKey}`}
                            checked={Boolean(selectedIds[rowKey])}
                            onChange={(e) => setSelectedIds((s) => ({ ...s, [rowKey]: e.target.checked }))}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 12, height: 12, background: '#e0e0e0', borderRadius: 2 }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{ctrl?.name ?? `Request ${r.id ?? idx + 1}`}</div>
                            <div style={{ color: '#666', fontSize: 13 }}>{String(r.scope || '').slice(0, 80)}</div>
                          </div>
                        </div>
                        <div style={{ color: '#444' }}>{ctrl?.tester ?? r.requestedBy ?? '—'}</div>
                        <div style={{ color: '#444' }}>{String(r.scope ?? '').slice(0, 40)}</div>
                        <div style={{ color: '#444' }}>{r.status ?? 'Pending'}</div>
                        <div style={{ color: '#444' }}>{(r as any).step ?? '—'}</div>
                        <div style={{ color: '#666' }}>{formatBadgeDate(r.dueDate)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : activeTab === 'requests' ? (
              <ul className="control-list">
                {controlsWithRequests.length === 0 && <li className="empty">No controls with requests</li>}
                {controlsWithRequests.map((c) => {
                  const key = `ctrl-${c.id}`
                  const isOpen = Boolean(openRequest[key])
                  const related = requestsForControl(c.id)
                  return (
                    <li key={key} className={`control-row ${isOpen ? 'expanded' : ''}`}>
                      <div
                        className="control-link"
                        role="button"
                        tabIndex={0}
                        onClick={() => setOpenRequest((s) => ({ ...s, [key]: !s[key] }))}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenRequest((s) => ({ ...s, [key]: !s[key] })) }}
                      >
                        <div className="row-left">
                          <div className="row-title">{c.name}</div>
                          <div className="row-sub">{String(c.description ?? c.testingNotes ?? '').slice(0, 100)}</div>
                          <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Tester: {c.tester ?? '—'}</div>
                        </div>
                        <div className="row-right">
                          <div className="badge">{String(related.length)} request{related.length !== 1 ? 's' : ''}</div>
                          <span className="chevron" style={{ marginLeft: 10 }}>{isOpen ? '▴' : '▾'}</span>
                        </div>
                      </div>

                      <div className={`expanded-panel ${isOpen ? 'open' : ''}`}>
                        <div style={{ marginTop: 8 }}>
                          <div className="expanded-card">
                            <div style={{ padding: 8 }}>
                              <strong>Associated Requests</strong>
                              <ul style={{ marginTop: 8 }}>
                                {related.map((r) => (
                                  <li key={`req-${r.id || r.scope}`} style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                      <div style={{ color: '#222' }}>{String(r.scope ?? r.id ?? 'Request')}</div>
                                      <div style={{ color: '#666' }}>{r.status ?? 'Pending'}</div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div>
                {/* Calendar view: month selector, year selector, prev/next, and month grid */}
                <CalendarView
                  requests={mockRequests}
                  onDayClick={(k) => setDayModalDate(k)}
                />
              </div>
            )}
          </>
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>

      {selectedRequest && (
        <RequestModal request={selectedRequest} onClose={() => setSelectedRequest(null)} editPreference={editPreference} />
      )}
          {dayModalDate && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setDayModalDate(null)}>
              <div style={{ width: 620, maxHeight: '80vh', overflow: 'auto', background: '#fff', borderRadius: 8, padding: 16 }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <strong style={{ fontSize: 16 }}>{dayModalDate}</strong>
                  <button onClick={() => setDayModalDate(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Close</button>
                </div>
                <div>
                  {(mockRequests.filter((r) => String(r.dueDate) === dayModalDate) || []).map((r) => (
                    <div key={String(r.id || r.scope)} style={{ padding: 10, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{String(r.scope ?? `Request ${r.id}`)}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>{r.status ?? 'Pending'}</div>
                      </div>
                      <div>
                        <button onClick={() => { setSelectedRequest(r); setDayModalDate(null) }} style={{ padding: '6px 10px', borderRadius: 6, background: '#1a88ff', color: '#fff', border: 'none', cursor: 'pointer' }}>Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      {showCreate && (
        <CreateRequestModal
          onClose={() => setShowCreate(false)}
          onCreated={(r: TestRequest) => {
            setShowCreate(false)
            // ensure mock is visible and open the new request
            setShowMock(true)
            setSelectedRequest(r)
          }}
        />
      )}
    </div>
  )
}
