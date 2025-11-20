import { Link } from 'react-router-dom'
import { useState } from 'react'
import { mockRequests, mockControls } from '../mocks/mockData'
import './ActiveControlsTestingList.css'

export default function IndividualRequest() {
  const [showMock, setShowMock] = useState(true)
  const [viewMode, setViewMode] = useState<'List' | 'Compact' | 'Kanban'>('List')
  const [openRequest, setOpenRequest] = useState<Record<string, boolean>>({})

  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
  }

  // pick up to 3 controls related to a request: prefer exact id matches, then nearby controls
  function controlsForRequest(idx: number, r: any) {
    const found = mockControls.filter((c) => String(c.id) === String(r.controlId))
    if (found.length >= 3) return found.slice(0, 3)
    const extras: any[] = []
    if (mockControls.length > 0) {
      const base = Math.max(0, idx % mockControls.length)
      for (let i = 0; i < 5 && extras.length < 3; i++) {
        const pick = mockControls[(base + i) % mockControls.length]
        if (!found.find((f) => f.id === pick.id)) extras.push(pick)
      }
    }
    return [...found, ...extras].slice(0, 3)
  }

  return (
    <div className="control-list-page">
      <h2>Active Controls Testing List</h2>
      <p style={{ marginTop: 6, color: '#444' }}>Requests list / single request entry point.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
        <div>
          <label style={{ fontSize: 13, color: '#444', marginRight: 8 }}>View:</label>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value as any)} style={{ padding: '6px 8px', borderRadius: 6 }}>
            <option value="List">List</option>
            <option value="Compact">Compact</option>
            <option value="Kanban">Kanban</option>
          </select>
        </div>

        <p style={{ margin: 0 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
            {showMock ? 'Hide mock requests' : 'Show mock requests'}
          </a>
        </p>
      </div>

      <div className="controls-container">
        <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Selected view: <strong>{viewMode}</strong></div>
        {showMock ? (
          <>
            <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
              <div style={{ borderBottom: '2px solid #eee', paddingBottom: 8 }}>Request</div>
              <div style={{ color: '#888', paddingBottom: 8 }}>Status</div>
              <div style={{ color: '#888', paddingBottom: 8 }}>Assignee</div>
            </div>

            <ul className="control-list">
              {mockRequests.length === 0 && <li className="empty">No requests</li>}
              {mockRequests.map((r, idx) => {
                const key = String(r.id || `req-${idx}`)
                const isOpen = Boolean(openRequest[key])
                const rows = controlsForRequest(idx, r)
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
                        <div className="row-title">Request #{idx + 1}</div>
                        <div className="row-sub">{String(r.scope).slice(0, 100)}</div>
                        <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Requested by: {r.requestedBy}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="badge" style={{ marginRight: 12 }}>{r.status ?? 'In Progress'}</div>
                          <span className={`chevron ${isOpen ? 'open' : ''}`}>▾</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#444' }}>Due: {formatBadgeDate(r.dueDate)}</div>
                        <div style={{ marginTop: 6 }}><Link to={`/requests/${r.id}/update`}>Open / Edit</Link></div>
                      </div>
                    </div>

                    <div className={`expanded-panel ${isOpen ? 'open' : ''}`}>
                      <div style={{ marginTop: 8 }}>
                        <div className="expanded-card">
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 140px 140px 160px', gap: 8, alignItems: 'center' }}>
                              {rows.map((c: any) => (
                                <div key={`${key}-row-${c.id}`} style={{ display: 'contents' }}>
                                  <div style={{ padding: '8px 0' }}>
                                    <Link to={`/controls/${c.id}`} style={{ color: '#1a88ff' }}>{c.name}</Link>
                                  </div>
                                  <div style={{ padding: '8px 0', fontWeight: 600 }}>{c.tester ?? '—'}</div>
                                  <div style={{ padding: '8px 0' }}>Started on {formatBadgeDate(c.startDate)}</div>
                                  <div style={{ padding: '8px 0' }}>ETA {formatBadgeDate(c.dueDate)}</div>
                                  <div style={{ padding: '8px 0' }}>{c.testingNotes ? String(c.testingNotes) : (r.scope ? String(r.scope).slice(0, 40) : '—')}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>
    </div>
  )
}
