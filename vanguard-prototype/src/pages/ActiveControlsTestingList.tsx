import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { mockControls } from '../mocks/mockData'
import type { Control } from '../lib/types'
import './ActiveControlsTestingList.css'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(true)

  // define what "currently working on" means: any non 'Not Started' DAT or OET
  // or an explicit testingNotes value that indicates progress/completion.
  const isActive = (c: Control) => {
    const dat = c.dat?.status ?? 'Not Started'
    const oet = c.oet?.status ?? 'Not Started'
    if (dat !== 'Not Started' || oet !== 'Not Started') return true
    if (c.testingNotes && !/not started/i.test(String(c.testingNotes))) return true
    return false
  }

  const filtered = useMemo(() => mockControls.filter((c) => isActive(c)), [mockControls])

  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    // expect ISO 'YYYY-MM-DD' — output 'DD/MM/YYYY'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
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
            {filtered.length > 0 && (
              <div className="expanded-card">
                <div className="expanded-left">
                  <h3 className="control-title">{filtered[0].name}</h3>
                  <p className="control-desc">{filtered[0].description ?? 'No description provided.'}</p>
                </div>
                <div className="expanded-right">
                  <div className="meta"><strong>Control Owner:</strong> {filtered[0].owner}</div>
                  <div className="meta"><strong>Control SME:</strong> {filtered[0].sme ?? '—'}</div>
                  <div className="meta"><strong>Control Escalation Required:</strong> {filtered[0].needsEscalation ? 'Yes' : 'No'}</div>
                  {filtered[0].testingNotes && <div className="status-badge">In Testing</div>}
                </div>
              </div>
            )}

            <ul className="control-list">
              {filtered.length === 0 && <li className="empty">No controls match the selected tester / active status</li>}
              {filtered.map((c) => (
                <li key={c.id} className="control-row">
                  <Link to={`/controls/${c.id}`} className="control-link">
                    <div className="row-left">
                      <div className="row-title">{c.name}</div>
                      <div className="row-sub">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
                    </div>
                    <div className="row-right">
                      <div className="badge">Last Testing on {formatBadgeDate(c.completedDate ?? c.dueDate)}</div>
                    </div>
                  </Link>
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
