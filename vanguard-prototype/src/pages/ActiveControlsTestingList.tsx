import { useState } from 'react'
import { mockControls } from '../mocks/mockData'
import './ActiveControlsTestingList.css'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)


  // (previously filtered list by 'active' status — not needed for requests view)

  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    // expect ISO 'YYYY-MM-DD' — output 'DD/MM/YYYY'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
  }

  // define what "currently working on" means: any non 'Not Started' DAT or OET
  // or an explicit testingNotes value that indicates progress/completion.
  function isActive(c: any) {
    const dat = c.dat?.status ?? 'Not Started'
    const oet = c.oet?.status ?? 'Not Started'
    if (dat !== 'Not Started' || oet !== 'Not Started') return true
    if (c.testingNotes && !/not started/i.test(String(c.testingNotes))) return true
    return false
  }

  const filtered = mockControls.filter(isActive)

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
              <div style={{ borderBottom: '2px solid #eee', paddingBottom: 8 }}>Request</div>
              <div style={{ color: '#888', paddingBottom: 8 }}>Status</div>
              <div style={{ color: '#888', paddingBottom: 8 }}>Assignee</div>
            </div>

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
          </>
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>
    </div>
  )
}
