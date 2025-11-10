import { Link } from 'react-router-dom'
import { useState } from 'react'
import { mockControls, mockRequests } from '../mocks/mockData'
import './ActiveControlsTestingList.css'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(true)
  const [openRequests, setOpenRequests] = useState<Record<string, boolean>>({})


  // (previously filtered list by 'active' status — not needed for requests view)

  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    // expect ISO 'YYYY-MM-DD' — output 'DD/MM/YYYY'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
  }

  // derive a small set of controls to show for a request.
  // Prefer controls that match the request.controlId; then fill with nearby controls.
  function controlsForRequest(reqIndex: number, req: any) {
    const found = mockControls.filter((c) => String(c.id) === String(req.controlId))
    if (found.length >= 3) return found.slice(0, 3)
    // pick the control that matches and then a couple more nearby
    const extras: any[] = []
    if (mockControls.length > 0) {
      const baseIndex = Math.max(0, reqIndex % mockControls.length)
      for (let i = 0; i < 3 && extras.length < 3; i++) {
        const pick = mockControls[(baseIndex + i) % mockControls.length]
        if (!found.find((f) => f.id === pick.id)) extras.push(pick)
      }
    }
    return [...found, ...extras].slice(0, 3)
  }

  return (
    <div className="control-list-page">
      <h2>Control List</h2>

      <p style={{ marginTop: 6, color: '#444' }}>A list of active controls and testing status.</p>

      <p style={{ marginTop: 8 }}>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Hide mock testing controls' : 'Show mock testing controls'}
        </a>
      </p>

      <div className="controls-container">
        {showMock ? (
          <>
            {/* Tabs area (visual only) */}
            <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
              <div style={{ borderBottom: '2px solid #eee', paddingBottom: 8 }}>Request</div>
              <div style={{ color: '#888', paddingBottom: 8 }}>Status</div>
              <div style={{ color: '#888', paddingBottom: 8 }}>Assignee</div>
            </div>

            <ul className="control-list">
              {mockRequests.length === 0 && <li className="empty">No requests available</li>}

              {mockRequests.map((r, idx) => {
                const key = String(r.id || `req-${idx}`)
                const isOpen = Boolean(openRequests[key])
                const rows = controlsForRequest(idx, r)
                return (
                  <li key={key} className={`control-row ${isOpen ? 'expanded' : ''}`}>
                    <div
                      className="control-link"
                      role="button"
                      tabIndex={0}
                      onClick={() => setOpenRequests((s) => ({ ...s, [key]: !s[key] }))}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenRequests((s) => ({ ...s, [key]: !s[key] })) }}
                    >
                            <div className="row-left">
                              <div className="row-title">Request #{idx + 1}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div className="badge" style={{ marginRight: 12 }}>{r.status ?? 'In Progress'}</div>
                              <span className={`chevron ${isOpen ? 'open' : ''}`}>▾</span>
                            </div>
                    </div>

                    <div className={`expanded-panel ${isOpen ? 'open' : ''}`}>
                      <div style={{ marginTop: 8 }}>
                        <div className="expanded-card">
                          <div style={{ flex: 1 }}>
                            {/* Render a simple table-like list of controls */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 140px 140px 160px', gap: 8, alignItems: 'center' }}>
                              {rows.map((c: any) => (
                                <div key={`${key}-row-${c.id}`} style={{ display: 'contents' }}>
                                  <div style={{ padding: '8px 0' }}>
                                    <Link to={`/controls/${c.id}`} style={{ color: '#1a88ff' }}>{c.name}</Link>
                                  </div>
                                  <div style={{ padding: '8px 0', fontWeight: 600 }}>{c.tester ?? c.tester ?? '—'}</div>
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
