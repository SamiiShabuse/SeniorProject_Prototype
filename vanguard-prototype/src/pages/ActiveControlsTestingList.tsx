import { useMemo, useState } from 'react'
import { mockControls, mockRequests } from '../mocks/mockData'
import type { Control } from '../lib/types'
import './ActiveControlsTestingList.css'
import ControlModal from '../components/ControlModal'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(true)
  const [selectedControl, setSelectedControl] = useState<Control | null>(null)
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

  // Group controls by DAT status
  const controlsByStatus = useMemo(() => {
    const order = ['In Progress', 'Testing Completed', 'Addressing Comments', 'Not Started', 'Completed']
    const map: Record<string, Control[]> = {}
    
    for (const c of filtered) {
      // Get the DAT status, with fallback logic
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
        // Fallback: check testingNotes or description
        const notes = String(c.testingNotes ?? '') + ' ' + String(c.description ?? '')
        if (/completed/i.test(notes)) status = 'Completed'
        else status = 'Not Started'
      }
      
      if (!map[status]) map[status] = []
      map[status].push(c)
    }
    
    // produce ordered array of [status, controls]
    const ordered: Array<[string, Control[]]> = []
    for (const s of order) {
      if (map[s] && map[s].length > 0) ordered.push([s, map[s]])
    }
    // append any other statuses not in order
    for (const k of Object.keys(map)) {
      if (!order.includes(k) && map[k].length > 0) ordered.push([k, map[k]])
    }
    return ordered
  }, [filtered])

  // Group controls by assignee (tester) and sort assignees by name.
  // Use the full mockControls list (not filtered) so the Assignee tab shows all testers.
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
  }, [mockControls])

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
                {filtered.map((c: Control) => (
                  <li key={c.id} className="control-row">
                    <div
                      className="control-link"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedControl(c)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedControl(c) }}
                    >
                      <div className="row-left">
                        <div className="row-title">{c.name}</div>
                        <div className="row-sub">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
                      </div>
                      <div className="row-right">
                        <div className="badge">Last Testing on {formatBadgeDate(c.completedDate ?? c.dueDate)}</div>
                        <span className="chevron" style={{ marginLeft: 10 }}>▾</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'status' && (
              <div>
                {controlsByStatus.length === 0 && <div className="empty">No controls found</div>}
                {controlsByStatus.map(([status, controls]) => (
                  <div key={status} style={{ marginBottom: 14 }}>
                    <h4 style={{ margin: '6px 0' }}>{status}</h4>
                    <ul className="control-list">
                      {controls.map((c: Control) => (
                        <li key={c.id} className="control-row">
                          <div
                            className="control-link"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedControl(c)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedControl(c) }}
                          >
                            <div className="row-left">
                              <div className="row-title">{c.name}</div>
                              <div className="row-sub">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
                            </div>
                            <div className="row-right">
                              <div className="badge">{status}</div>
                              <span className="chevron" style={{ marginLeft: 10 }}>▾</span>
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
                    <div style={{ background: '#f6f6f6', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}><strong>{group.assignee}</strong></div>
                    <ul className="control-list">
                      {group.controls.map((c: Control) => (
                        <li key={c.id} className="control-row">
                          <div
                            className="control-link"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedControl(c)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedControl(c) }}
                          >
                            <div className="row-left">
                              <div className="row-title">{c.name}</div>
                              <div className="row-sub">Tester: {c.tester ?? '—'}</div>
                            </div>
                            <div className="row-right">
                              <div className="badge">{String(c.dat?.status ?? c.oet?.status ?? 'Not Started')}</div>
                              <span className="chevron" style={{ marginLeft: 10 }}>▾</span>
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

      {selectedControl && (
        <ControlModal control={selectedControl} onClose={() => setSelectedControl(null)} />
      )}
    </div>
  )
}
