import { useMemo, useState } from 'react'
import { mockControls, mockRequests } from '../mocks/mockData'
import './ActiveControlsTestingList.css'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'request' | 'status' | 'assignee'>('request')


  // (previously filtered list by 'active' status — not needed for requests view)

  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    // expect ISO 'YYYY-MM-DD' — output 'DD/MM/YYYY'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
  }

  // define what "currently working on" means: any non 'Not Started' DAT or OET
  // For the Active Controls page we consider a control active unless
  // its DAT status is explicitly 'Completed' (case-insensitive).
  // If DAT is missing, treat the control as active.
  function isActive(c: any) {
    // Prefer DAT.status when present. If DAT.status exists, only exclude when it's 'Completed'.
    const datRaw = String(c.dat?.status ?? '').trim()
    if (datRaw) return datRaw.toLowerCase() !== 'completed'

    // If DAT.status is missing, fall back to testingNotes or description which sometimes contain 'Completed'.
    const notes = String(c.testingNotes ?? '') + ' ' + String(c.description ?? '')
    if (/completed/i.test(notes)) return false

    // Default to active when no explicit 'Completed' marker is found.
    return true
  }

  const filtered = mockControls.filter(isActive)

  // Group requests by status (use order: In Progress, Pending, Complete, then others)
  const requestsByStatus = useMemo(() => {
    const order = ['In Progress', 'Pending', 'Complete']
    const map: Record<string, any[]> = {}
    for (const r of mockRequests) {
      const key = r.status || 'Pending'
      if (!map[key]) map[key] = []
      const control = mockControls.find((c) => c.id === r.controlId)
      map[key].push({ request: r, control })
    }
    // produce ordered array of [status, items]
    const ordered: Array<[string, any[]]> = []
    for (const s of order) {
      if (map[s]) ordered.push([s, map[s]])
    }
    // append any other statuses not in order
    for (const k of Object.keys(map)) {
      if (!order.includes(k)) ordered.push([k, map[k]])
    }
    return ordered
  }, [mockRequests, mockControls])

  // Group controls by assignee (tester) and sort assignees by name
  const controlsByAssignee = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const c of filtered) {
      const key = c.tester && String(c.tester).trim() !== '' ? String(c.tester) : 'Unassigned'
      if (!map[key]) map[key] = []
      map[key].push(c)
    }
    const keys = Object.keys(map).sort((a, b) => a.localeCompare(b))
    return keys.map((k) => ({ assignee: k, controls: map[k] }))
  }, [filtered])

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
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('request')}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('request') }}
                style={{ borderBottom: activeTab === 'request' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer' }}
              >
                Request
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('status')}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('status') }}
                style={{ borderBottom: activeTab === 'status' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'status' ? '#111' : '#888' }}
              >
                Status
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('assignee')}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('assignee') }}
                style={{ borderBottom: activeTab === 'assignee' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'assignee' ? '#111' : '#888' }}
              >
                Assignee
              </div>
            </div>

            {/* Content for each tab */}
            {activeTab === 'request' && (
              <ul className="control-list">
                {filtered.length === 0 && <li className="empty">No active controls found</li>}
                {filtered.map((c: any) => (
                  <li key={c.id} className={`control-row ${expandedId === c.id ? 'expanded' : ''}`}>
                    <div
                      className="control-link"
                      role="button"
                      tabIndex={0}
                      onClick={() => setExpandedId((s) => (s === c.id ? null : c.id))}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedId((s) => (s === c.id ? null : c.id)) }}
                    >
                      <div className="row-left">
                        <div className="row-title">{c.name}</div>
                        <div className="row-sub">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
                      </div>
                      <div className="row-right">
                        <div className="badge">Last Testing on {formatBadgeDate(c.completedDate ?? c.dueDate)}</div>
                        <span className={`chevron ${expandedId === c.id ? 'open' : ''}`} style={{ marginLeft: 10 }}>▾</span>
                      </div>
                    </div>

                    <div className={`expanded-panel ${expandedId === c.id ? 'open' : ''}`}>
                      <div style={{ marginTop: 8, marginLeft: 4 }}>
                        <div className="expanded-card" style={{ padding: 12 }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ marginTop: 0 }}>{c.name}</h4>
                            <p style={{ margin: 0 }}>{c.description ?? 'No additional details.'}</p>
                          </div>
                          <div style={{ width: 260, marginLeft: 16 }}>
                            <div className="meta"><strong>Owner:</strong> {c.owner}</div>
                            <div className="meta"><strong>SME:</strong> {c.sme ?? '—'}</div>
                            <div className="meta"><strong>Escalation:</strong> {c.needsEscalation ? 'Yes' : 'No'}</div>
                            {c.testingNotes && <div style={{ marginTop: 8 }}><strong>Notes:</strong><div style={{ marginTop: 6 }}>{c.testingNotes}</div></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'status' && (
              <div>
                {requestsByStatus.length === 0 && <div className="empty">No requests found</div>}
                {requestsByStatus.map(([status, items]) => (
                  <div key={status} style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: '6px 0' }}>{status}</h4>
                    <ul className="control-list">
                      {items.map((it: any) => (
                        <li key={it.request.id} className="control-row">
                          <div className="control-link">
                            <div className="row-left">
                              <div className="row-title">{it.control ? it.control.name : it.request.id}</div>
                              <div className="row-sub">Requested by: {it.request.requestedBy} • Due: {formatBadgeDate(it.request.dueDate)}</div>
                            </div>
                            <div className="row-right">
                              <div className="badge">{it.request.status}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assignee' && (
              <div>
                {controlsByAssignee.length === 0 && <div className="empty">No controls found</div>}
                {controlsByAssignee.map((group) => (
                  <div key={group.assignee} style={{ marginBottom: 12 }}>
                    <div style={{ background: '#f6f6f6', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}>{group.assignee}</div>
                    <ul className="control-list">
                      {group.controls.map((c: any) => (
                        <li key={c.id} className="control-row">
                          <div className="control-link">
                            <div className="row-left">
                              <div className="row-title">{c.name}</div>
                              <div className="row-sub">Tester: {c.tester ?? '—'}</div>
                            </div>
                            <div className="row-right">
                              <div className="badge">{String(c.dat?.status ?? c.oet?.status ?? 'Not Started')}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>
    </div>
  )
}
