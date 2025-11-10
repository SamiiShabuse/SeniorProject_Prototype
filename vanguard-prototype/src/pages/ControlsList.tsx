import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { mockControls } from '../mocks/mockData'
import type { Control } from '../lib/types'
import './ActiveControlsTestingList.css'

export default function ControlsList() {
  const [showMock, setShowMock] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const controls = useMemo(() => mockControls, [mockControls])

  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
  }

  return (
    <div className="control-list-page">
      <h2>Controls List</h2>
      <p style={{ marginTop: 6, color: '#444' }}>List of controls. Click a control to open details.</p>

      <p style={{ marginTop: 8 }}>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Hide mock data' : 'Show mock data'}
        </a>
      </p>

      <div className="controls-container">
        {showMock ? (
          <>
            {controls.length > 0 && (
              <div className="expanded-card">
                <div className="expanded-left">
                  <h3 className="control-title">{controls[0].name}</h3>
                  <p className="control-desc">{controls[0].description ?? 'No description provided.'}</p>
                </div>
                <div className="expanded-right">
                  <div className="meta"><strong>Control Owner:</strong> {controls[0].owner}</div>
                  <div className="meta"><strong>Control SME:</strong> {controls[0].sme ?? '—'}</div>
                  <div className="meta"><strong>Control Escalation Required:</strong> {controls[0].needsEscalation ? 'Yes' : 'No'}</div>
                  {controls[0].testingNotes && <div className="status-badge">In Testing</div>}
                </div>
              </div>
            )}

            <ul className="control-list">
              {controls.map((c: Control) => (
                <li key={c.id} className="control-row">
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
                    </div>
                  </div>

                  {expandedId === c.id && (
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
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>

      <p style={{ marginTop: 14 }}><Link to="/controls/create">Create new control</Link></p>
    </div>
  )
}
