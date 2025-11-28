import { useMemo, useState, useContext } from 'react'
import { mockControls } from '../mocks/mockData'
import type { Control } from '../lib/types'
import './ActiveControlsTestingList.css'
import ControlModal from '../components/ControlModal'
import CreateControlModal from '../components/CreateControlModal'
import EditControlModal from '../components/EditControlModal'
import ControlsKanban from '../components/ControlsKanban'
import DevContext from '../contexts/DevContext'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(true)
  const [viewMode, setViewMode] = useState<'Pop Up' | 'Compact' | 'Kanban'>('Compact')
  const [selectedControl, setSelectedControl] = useState<Control | null>(null)
  const [editingControl, setEditingControl] = useState<Control | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'request' | 'status' | 'assignee'>('request')
  const [editPreference, setEditPreference] = useState<'route' | 'modal'>('route')
  const [statusSearch, setStatusSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All')
  const [assigneeFilter, setAssigneeFilter] = useState<'All' | string>('All')
  const [creating, setCreating] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

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

  function isActive(c: any) {
    const datRaw = String(c.dat?.status ?? '').trim()
    if (datRaw) return datRaw.toLowerCase() !== 'completed'
    const notes = String(c.testingNotes ?? '') + ' ' + String(c.description ?? '')
    if (/completed/i.test(notes)) return false
    return true
  }

  const filtered = mockControls.filter(isActive)

  const controlsByStatus = useMemo(() => {
    const order = ['In Progress', 'Testing Completed', 'Addressing Comments', 'Not Started', 'Completed']
    const map: Record<string, Control[]> = {}
    for (const c of filtered) {
      let status = 'Not Started'
      const datRaw = String(c.dat?.status ?? '').trim()
      if (datRaw) {
        const s = datRaw.toLowerCase()
        if (s.includes('not')) status = 'Not Started'
        else if (s.includes('progress') || s.includes('in progress')) status = 'In Progress'
        else if (s.includes('testing')) status = 'Testing Completed'
        else if (s.includes('address') || s.includes('comments')) status = 'Addressing Comments'
        else if (s.includes('complete')) status = 'Completed'
        else status = 'In Progress'
      } else {
        const notes = String(c.testingNotes ?? '') + ' ' + String(c.description ?? '')
        if (/completed/i.test(notes)) status = 'Completed'
        else status = 'Not Started'
      }
      if (!map[status]) map[status] = []
      map[status].push(c)
    }
    const ordered: Array<[string, Control[]]> = []
    for (const s of order) {
      if (map[s] && map[s].length > 0) ordered.push([s, map[s]])
    }
    for (const k of Object.keys(map)) {
      if (!order.includes(k) && map[k].length > 0) ordered.push([k, map[k]])
    }
    return ordered
  }, [filtered])

  const filteredStatusGroups = useMemo(() => {
    const q = String(statusSearch || '').trim().toLowerCase()
    const groups: Array<[string, Control[]]> = []
    for (const [status, controls] of controlsByStatus) {
      // apply status filter if selected
      if (statusFilter !== 'All' && status !== statusFilter) continue
      const matched = controls.filter((c) => {
        if (!q) return true
        const hay = [c.name, c.description, c.owner, c.tester, c.sme, c.testingNotes, c.startDate, c.dueDate].filter(Boolean).join(' ').toLowerCase()
        return hay.includes(q)
      })
      if (matched.length > 0) groups.push([status, matched])
    }
    // if no groups matched but a search exists, try across non-ordered statuses too
    if (groups.length === 0 && q) {
      for (const [status, controls] of controlsByStatus) {
        const matched = controls.filter((c) => {
          const hay = [c.name, c.description, c.owner, c.tester, c.sme, c.testingNotes, c.startDate, c.dueDate].filter(Boolean).join(' ').toLowerCase()
          return hay.includes(q)
        })
        if (matched.length > 0) groups.push([status, matched])
      }
    }
    return groups
  }, [controlsByStatus, statusSearch, statusFilter])

  const controlsByAssignee = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const c of mockControls) {
      const raw = c.tester ?? ''
      const key = String(raw).trim() !== '' ? String(raw).trim() : 'Unassigned'
      if (!map[key]) map[key] = []
      map[key].push(c)
    }
    const keys = Object.keys(map).sort((a, b) => a.localeCompare(b))
    return keys.map((k) => ({ assignee: k, controls: map[k] }))
  }, [refreshKey])

  const testersList = useMemo(() => {
    const map: Record<string, boolean> = {}
    for (const c of mockControls) {
      const key = String(c.tester ?? '').trim() || 'Unassigned'
      map[key] = true
    }
    const list = Object.keys(map).sort((a, b) => a.localeCompare(b))
    return ['All', ...list]
  }, [])

  const filteredAssigneeGroups = useMemo(() => {
    if (assigneeFilter === 'All') return controlsByAssignee
    return controlsByAssignee.filter((g) => g.assignee === assigneeFilter)
  }, [controlsByAssignee, assigneeFilter])

  return (
    <div className="control-list-page">
      <h2>Control List</h2>
      <p style={{ marginTop: 6, color: '#444' }}>A list of active controls and testing status.</p>

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
              {showMock ? 'Hide mock testing controls' : 'Show mock testing controls'}
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
        {devMode && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Selected view: <strong>{viewMode}</strong></div>
        )}

        {showMock ? (
          <>
            <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
              <div role="button" tabIndex={0} onClick={() => setActiveTab('request')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('request') }} style={{ borderBottom: activeTab === 'request' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer' }}>Control</div>
              <div role="button" tabIndex={0} onClick={() => setActiveTab('status')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('status') }} style={{ borderBottom: activeTab === 'status' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'status' ? '#111' : '#888' }}>Status</div>
              <div role="button" tabIndex={0} onClick={() => setActiveTab('assignee')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('assignee') }} style={{ borderBottom: activeTab === 'assignee' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'assignee' ? '#111' : '#888' }}>Assignee</div>
            </div>

            {viewMode === 'Kanban' ? (
              <ControlsKanban controls={filtered} />
            ) : (
              <>
                {activeTab === 'request' && (
                  <ul className="control-list">
                    {filtered.length === 0 && <li className="empty">No active controls found</li>}
                    {filtered.map((c: Control) => {
                      const isExpanded = viewMode === 'Compact' && expandedId === c.id
                      return (
                        <li key={c.id} className={`control-row ${isExpanded ? 'expanded' : ''}`}>
                          <div className="control-link" role="button" tabIndex={0} onClick={() => { if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id)); else setSelectedControl(c) }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id)); else setSelectedControl(c) } }}>
                            <div className="row-left">
                              <div className="row-title">{c.name}</div>
                              <div className="row-sub">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
                            </div>
                            <div className="row-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="badge">Last Testing on {formatBadgeDate(c.completedDate ?? c.dueDate)}</div>
                              <button aria-label={`Edit ${c.name}`} onClick={(e) => { e.stopPropagation(); setEditingControl(c) }} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Edit</button>
                              <span className="chevron" style={{ marginLeft: 4 }}>{isExpanded ? '▴' : '▾'}</span>
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
                )}

                {activeTab === 'status' && (
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                      <input
                        placeholder="Search controls..."
                        value={statusSearch}
                        onChange={(e) => setStatusSearch(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', flex: 1 }}
                      />
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6 }}>
                        <option value="All">All</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Testing Completed">Testing Completed</option>
                        <option value="Addressing Comments">Addressing Comments</option>
                        <option value="Not Started">Not Started</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {filteredStatusGroups.length === 0 && <div className="empty">No controls found</div>}
                    {filteredStatusGroups.map(([status, controls]) => (
                      <div key={status} style={{ marginBottom: 14 }}>
                        <h4 style={{ margin: '6px 0' }}>{status}</h4>
                        <ul className="control-list">
                          {controls.map((c: Control) => {
                            const isExpanded = viewMode === 'Compact' && expandedId === c.id
                            return (
                              <li key={c.id} className={`control-row ${isExpanded ? 'expanded' : ''}`}>
                                <div className="control-link" role="button" tabIndex={0} onClick={() => { if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id)); else setSelectedControl(c) }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id)); else setSelectedControl(c) } }}>
                                  <div className="row-left">
                                    <div className="row-title">{c.name}</div>
                                    <div className="row-sub">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
                                  </div>
                                  <div className="row-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className="badge">{status}</div>
                                    <button aria-label={`Edit ${c.name}`} onClick={(e) => { e.stopPropagation(); setEditingControl(c) }} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Edit</button>
                                    <span className="chevron" style={{ marginLeft: 4 }}>{isExpanded ? '▴' : '▾'}</span>
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
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'assignee' && (
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                      <label style={{ fontSize: 13, color: '#444', marginRight: 8 }}>Assignee:</label>
                      <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6 }}>
                        {testersList.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {filteredAssigneeGroups.length === 0 && <div className="empty">No controls found</div>}
                    {filteredAssigneeGroups.map((group) => (
                      <div key={group.assignee} style={{ marginBottom: 12 }}>
                        <div style={{ background: '#f6f6f6', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}><strong>{group.assignee}</strong></div>
                        <ul className="control-list">
                          {group.controls.map((c: Control) => {
                            const isExpanded = viewMode === 'Compact' && expandedId === c.id
                            return (
                              <li key={c.id} className={`control-row ${isExpanded ? 'expanded' : ''}`}>
                                <div className="control-link" role="button" tabIndex={0} onClick={() => { if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id)); else setSelectedControl(c) }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (viewMode === 'Compact') setExpandedId((s) => (s === c.id ? null : c.id)); else setSelectedControl(c) } }}>
                                  <div className="row-left">
                                    <div className="row-title">{c.name}</div>
                                    <div className="row-sub">Tester: {c.tester ?? '—'}</div>
                                  </div>
                                  <div className="row-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className="badge">{String(c.dat?.status ?? c.oet?.status ?? 'Not Started')}</div>
                                    <button aria-label={`Edit ${c.name}`} onClick={(e) => { e.stopPropagation(); setEditingControl(c) }} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Edit</button>
                                    <span className="chevron" style={{ marginLeft: 4 }}>{isExpanded ? '▴' : '▾'}</span>
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
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>

      {selectedControl && (
        <ControlModal control={selectedControl} onClose={() => setSelectedControl(null)} editPreference={editPreference} />
      )}
      {creating && (
        <CreateControlModal onClose={() => setCreating(false)} onCreated={() => setRefreshKey((k) => k + 1)} />
      )}
      {editingControl && (
        <EditControlModal control={editingControl} onClose={() => setEditingControl(null)} onSaved={() => { setRefreshKey((k) => k + 1); setEditingControl(null) }} />
      )}
    </div>
  )
}
