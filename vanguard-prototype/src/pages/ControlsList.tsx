import { Link } from 'react-router-dom'
import { useState, useMemo, useContext } from 'react'
import DevContext from '../contexts/DevContext'
import { mockControls } from '../mocks/mockData'
import type { Control } from '../lib/types'
import './ActiveControlsTestingList.css'
import ControlModal from '../components/ControlModal'
import CreateControlModal from '../components/CreateControlModal'

export default function ControlsList() {
  const [showMock, setShowMock] = useState(true)
  const [viewMode, setViewMode] = useState<'Pop Up' | 'Compact' | 'Kanban'>('Pop Up')
  const [selectedControl, setSelectedControl] = useState<Control | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editPreference, setEditPreference] = useState<'route' | 'modal'>('route')
  const [creating, setCreating] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const controls = useMemo(() => mockControls, [refreshKey])

  function formatBadgeDate(d?: string) {
    if (!d) return '01/01/2025'
    const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
    if (!m) return d
    return `${m[3]}/${m[2]}/${m[1]}`
  }

  // Subscribe to global devMode so toggles hide/show immediately
  const ctx = useContext(DevContext)
  const devMode = ctx?.devMode ?? (() => {
    try {
      const v = localStorage.getItem('devMode')
      return v === null ? true : v === 'true'
    } catch (e) {
      return true
    }
  })()

  return (
    <div className="control-list-page">
      <h2>Controls List</h2>
      <p style={{ marginTop: 6, color: '#444' }}>List of controls. Click a control to open details.</p>

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

        {devMode ? (
          <p style={{ margin: 0 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
              {showMock ? 'Hide mock data' : 'Show mock data'}
            </a>
          </p>
        ) : null}

        {devMode && (
          <div>
            <label style={{ fontSize: 13, color: '#444', marginRight: 8 }}>Edit Mode:</label>
            <select value={editPreference} onChange={(e) => setEditPreference(e.target.value as any)} style={{ padding: '6px 8px', borderRadius: 6 }}>
              <option value="route">Route (open edit page)</option>
              <option value="modal">Inline Modal</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button onClick={() => setCreating(true)} style={{ padding: '8px 12px', borderRadius: 6, background: '#1a88ff', color: '#fff', border: 'none' }}>Create New Control</button>
      </div>

      <div className="controls-container">
        {/* placeholder: viewMode currently controls only the dropdown selection. We'll wire different renderings next. */}
        {devMode && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Selected view: <strong>{viewMode}</strong></div>
        )}
        {showMock ? (
          <>
            {/* top example removed per design — list rows will show expandable details */}

            <ul className="control-list">
              {controls.map((c: Control) => {
                const isExpanded = viewMode === 'Compact' && expandedId === c.id
                return (
                  <li key={c.id} className={`control-row ${isExpanded ? 'expanded' : ''}`}>
                    <div
                      className="control-link"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id))
                        else setSelectedControl(c)
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id)); else setSelectedControl(c) } }}
                    >
                      <div className="row-left">
                        <div className="row-title">{c.name}</div>
                        <div className="row-sub">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
                      </div>
                      <div className="row-right">
                        <div className="badge">Last Testing on {formatBadgeDate(c.completedDate ?? c.dueDate)}</div>
                        <span className={`chevron`} style={{ marginLeft: 10 }}>{isExpanded ? '▴' : '▾'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={`expanded-panel open`}>
                        <div style={{ marginTop: 8 }}>
                          <div className="expanded-card">
                            <div style={{ display: 'flex', gap: 16 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, color: '#333', marginBottom: 8 }}>{c.description}</div>
                              </div>
                              <div style={{ width: 260 }}>
                                <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Control Owner:</strong> {c.owner}</div>
                                <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Control SME:</strong> {c.sme ?? '—'}</div>
                                <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Escalation Required:</strong> {c.needsEscalation ? 'Yes' : 'No'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>

      <p style={{ marginTop: 14 }}><Link to="/controls/create">Create new control</Link></p>
      {creating && (
        <CreateControlModal
          onClose={() => setCreating(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
        />
      )}
      {selectedControl && (
        <ControlModal control={selectedControl} onClose={() => setSelectedControl(null)} editPreference={editPreference} />
      )}
    </div>
  )
}
