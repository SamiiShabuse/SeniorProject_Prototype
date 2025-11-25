import { Link } from 'react-router-dom'
import { useState, useContext, useMemo } from 'react'
import { mockRequests, mockControls } from '../mocks/mockData'
import CreateRequestModal from '../components/CreateRequestModal'
import RequestsKanban from '../components/RequestsKanban'
import type { TestRequest } from '../lib/types'
import RequestModal from '../components/RequestModal'
import './ActiveControlsTestingList.css'
import DevContext from '../contexts/DevContext'

export default function IndividualRequest() {
  const [showMock, setShowMock] = useState(true)
  const [viewMode, setViewMode] = useState<'Pop Up' | 'Compact' | 'Kanban'>('Pop Up')
  const [openRequest, setOpenRequest] = useState<Record<string, boolean>>({})
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editPreference, setEditPreference] = useState<'route' | 'modal'>('route')
  const [activeTab, setActiveTab] = useState<'request' | 'status' | 'assignee'>('request')
  const [statusSearch, setStatusSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All')
  const [assigneeFilter, setAssigneeFilter] = useState<'All' | string>('All')

  const isKanban = viewMode === 'Kanban'

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

  const requestsByStatus = useMemo(() => {
    const order = ['Pending', 'In Progress', 'Complete']
    const map: Record<string, TestRequest[]> = {}
    for (const r of mockRequests) {
      const status = String(r.status || 'Pending')
      if (!map[status]) map[status] = []
      map[status].push(r)
    }
    const ordered: Array<[string, TestRequest[]]> = []
    for (const s of order) {
      if (map[s] && map[s].length > 0) ordered.push([s, map[s]])
    }
    for (const k of Object.keys(map)) {
      if (!order.includes(k) && map[k].length > 0) ordered.push([k, map[k]])
    }
    return ordered
  }, [])

  const filteredStatusGroups = useMemo(() => {
    const q = String(statusSearch || '').trim().toLowerCase()
    const groups: Array<[string, TestRequest[]]> = []
    for (const [status, requests] of requestsByStatus) {
      if (statusFilter !== 'All' && status !== statusFilter) continue
      const matched = requests.filter((r) => {
        if (!q) return true
        const ctrl = mockControls.find((c) => String(c.id) === String(r.controlId))
        const hay = [r.scope, r.requestedBy, r.dueDate, r.id, ctrl?.name].filter(Boolean).join(' ').toLowerCase()
        return hay.includes(q)
      })
      if (matched.length > 0) groups.push([status, matched])
    }
    if (groups.length === 0 && q) {
      for (const [status, requests] of requestsByStatus) {
        const matched = requests.filter((r) => {
          const ctrl = mockControls.find((c) => String(c.id) === String(r.controlId))
          const hay = [r.scope, r.requestedBy, r.dueDate, r.id, ctrl?.name].filter(Boolean).join(' ').toLowerCase()
          return hay.includes(q)
        })
        if (matched.length > 0) groups.push([status, matched])
      }
    }
    return groups
  }, [requestsByStatus, statusSearch, statusFilter])

  const requestsByAssignee = useMemo(() => {
    const map: Record<string, TestRequest[]> = {}
    for (const r of mockRequests) {
      const ctrl = mockControls.find((c) => String(c.id) === String(r.controlId))
      const raw = ctrl?.tester ?? r.requestedBy ?? ''
      const key = String(raw).trim() !== '' ? String(raw).trim() : 'Unassigned'
      if (!map[key]) map[key] = []
      map[key].push(r)
    }
    const keys = Object.keys(map).sort((a, b) => a.localeCompare(b))
    return keys.map((k) => ({ assignee: k, requests: map[k] }))
  }, [])

  const assigneesList = useMemo(() => {
    const map: Record<string, boolean> = {}
    for (const r of mockRequests) {
      const ctrl = mockControls.find((c) => String(c.id) === String(r.controlId))
      const key = String(ctrl?.tester ?? r.requestedBy ?? '').trim() || 'Unassigned'
      map[key] = true
    }
    const list = Object.keys(map).sort((a, b) => a.localeCompare(b))
    return ['All', ...list]
  }, [])

  const filteredAssigneeGroups = useMemo(() => {
    if (assigneeFilter === 'All') return requestsByAssignee
    return requestsByAssignee.filter((g) => g.assignee === assigneeFilter)
  }, [requestsByAssignee, assigneeFilter])

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

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              backgroundColor: '#1a88ff',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Create New Request
          </button>
        </div>
      </div>

      <div className="controls-container">
        {devMode && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Selected view: <strong>{viewMode}</strong></div>
        )}
        {showMock ? (
          viewMode === 'Kanban' ? (
            <RequestsKanban requests={mockRequests} />
          ) : (
            <>
              <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
                <div role="button" tabIndex={0} onClick={() => setActiveTab('request')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('request') }} style={{ borderBottom: activeTab === 'request' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer' }}>Request</div>
                <div role="button" tabIndex={0} onClick={() => setActiveTab('status')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('status') }} style={{ borderBottom: activeTab === 'status' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'status' ? '#111' : '#888' }}>Status</div>
                <div role="button" tabIndex={0} onClick={() => setActiveTab('assignee')} onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('assignee') }} style={{ borderBottom: activeTab === 'assignee' ? '2px solid #222' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer', color: activeTab === 'assignee' ? '#111' : '#888' }}>Assignee</div>
              </div>

              {isKanban ? (
                <RequestsKanban requests={mockRequests} />
              ) : (
                <>
                  {activeTab === 'request' && (
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
                              onClick={() => {
                                if (viewMode === 'Compact') setOpenRequest((s) => ({ ...s, [key]: !s[key] }))
                                else setSelectedRequest(r)
                              }}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (viewMode === 'Compact') setOpenRequest((s) => ({ ...s, [key]: !s[key] })); else setSelectedRequest(r) } }}
                            >
                              <div className="row-left">
                                <div className="row-title">Request #{idx + 1}</div>
                                <div className="row-sub">{String(r.scope).slice(0, 100)}</div>
                                <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Requested by: {r.requestedBy}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <div className="badge" style={{ marginRight: 12 }}>{r.status ?? 'Pending'}</div>
                                  <span className={`chevron ${isOpen ? 'open' : ''}`}>{viewMode === 'Compact' ? (isOpen ? '▴' : '▾') : '▾'}</span>
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
                  )}

                  {activeTab === 'status' && (
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                        <input
                          placeholder="Search requests..."
                          value={statusSearch}
                          onChange={(e) => setStatusSearch(e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', flex: 1 }}
                        />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6 }}>
                          <option value="All">All</option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </div>

                      {filteredStatusGroups.length === 0 && <div className="empty">No requests found</div>}
                      {filteredStatusGroups.map(([status, requests]) => (
                        <div key={status} style={{ marginBottom: 14 }}>
                          <h4 style={{ margin: '6px 0' }}>{status}</h4>
                          <ul className="control-list">
                            {requests.map((r) => {
                              const idx = mockRequests.indexOf(r)
                              const key = String(r.id || `req-${idx}`)
                              const isOpen = Boolean(openRequest[key])
                              const rows = controlsForRequest(idx, r)
                              return (
                                <li key={key} className={`control-row ${isOpen ? 'expanded' : ''}`}>
                                  <div className="control-link" role="button" tabIndex={0} onClick={() => { if (viewMode === 'Compact') setOpenRequest((s) => ({ ...s, [key]: !s[key] })); else setSelectedRequest(r) }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (viewMode === 'Compact') setOpenRequest((s) => ({ ...s, [key]: !s[key] })); else setSelectedRequest(r) } }}>
                                    <div className="row-left">
                                      <div className="row-title">{r.id ? `Request ${r.id}` : `Request`}</div>
                                      <div className="row-sub">{String(r.scope).slice(0, 100)}</div>
                                      <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Requested by: {r.requestedBy}</div>
                                    </div>
                                    <div className="row-right">
                                      <div className="badge">{status}</div>
                                      <span className="chevron" style={{ marginLeft: 10 }}>{isOpen ? '▴' : '▾'}</span>
                                    </div>
                                  </div>
                                  {isOpen && (
                                    <div className={`expanded-panel open`}>
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
                          {assigneesList.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {filteredAssigneeGroups.length === 0 && <div className="empty">No requests found</div>}
                      {filteredAssigneeGroups.map((group) => (
                        <div key={group.assignee} style={{ marginBottom: 12 }}>
                          <div style={{ background: '#f6f6f6', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}><strong>{group.assignee}</strong></div>
                          <ul className="control-list">
                            {group.requests.map((r) => {
                              const idx = mockRequests.indexOf(r)
                              const key = String(r.id || `req-${idx}`)
                              const isOpen = Boolean(openRequest[key])
                              return (
                                <li key={key} className={`control-row ${isOpen ? 'expanded' : ''}`}>
                                  <div className="control-link" role="button" tabIndex={0} onClick={() => { if (viewMode === 'Compact') setOpenRequest((s) => ({ ...s, [key]: !s[key] })); else setSelectedRequest(r) }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (viewMode === 'Compact') setOpenRequest((s) => ({ ...s, [key]: !s[key] })); else setSelectedRequest(r) } }}>
                                    <div className="row-left">
                                      <div className="row-title">{r.id ? `Request ${r.id}` : `Request`}</div>
                                      <div className="row-sub">{String(r.scope).slice(0, 100)}</div>
                                    </div>
                                    <div className="row-right">
                                      <div className="badge">{String(r.status ?? 'Pending')}</div>
                                      <span className="chevron" style={{ marginLeft: 10 }}>{isOpen ? '▴' : '▾'}</span>
                                    </div>
                                  </div>
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
          )
        ) : (
          <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
        )}
      </div>
      {selectedRequest && (
        <RequestModal request={selectedRequest} onClose={() => setSelectedRequest(null)} editPreference={editPreference} />
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
