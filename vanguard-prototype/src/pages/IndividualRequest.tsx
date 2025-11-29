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
  const [activeTab, setActiveTab] = useState<'tests' | 'requests' | 'kanban' | 'calendar'>('requests')
  
  const [assigneeFilter, setAssigneeFilter] = useState<'All' | string>('All')

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

  const controlsWithRequests = useMemo(() => {
    return mockControls.filter((c) => mockRequests.some((r) => String(r.controlId) === String(c.id)))
  }, [])

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
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: 12, padding: '8px 12px', alignItems: 'center', fontWeight: 700, color: '#222', borderBottom: '1px solid #e6e6e6' }}>
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
                    return (
                      <div key={r.id || `req-${idx}`} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: 12, padding: '12px', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
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
