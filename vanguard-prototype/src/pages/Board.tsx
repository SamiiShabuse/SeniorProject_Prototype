import './Board.css'
import { useState } from 'react'
import { mockControls, mockRequests } from '../mocks/mockData'

type AnyObj = Record<string, any>


function formatBadgeDate(d?: string) {
  if (!d) return ''
  const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return d
  return `${m[3]}/${m[2]}/${m[1]}`
}

function RequestCard({ r }: { r: AnyObj }) {
  return (
    <div className="bp-card request-card" data-id={r.id}>
      <div className="bp-card-title">{r.requestedBy} — {formatBadgeDate(r.dueDate)}</div>
      <div className="bp-card-body">{String(r.scope)}</div>
      <div className="bp-card-meta">Status: {r.status}</div>
    </div>
  )
}

function ControlCard({ c }: { c: AnyObj }) {
  return (
    <div className="bp-card control-card" data-id={c.id}>
      <div className="bp-card-title">{c.id} — {c.name}</div>
      <div className="bp-card-body">Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
      <div className="bp-card-meta">Due: {formatBadgeDate(c.dueDate ?? c.eta)}</div>
    </div>
  )
}

export default function Board() {
  const [showMock, setShowMock] = useState(true)
  // maintain local, mutable copy of controls so drag/drop updates re-render
  const [controls, setControls] = useState(() => mockControls.slice())
  // local mutable requests so drops update status in-memory
  const [requests, setRequests] = useState(() => mockRequests.slice())
  // Determine a control's primary status: prefer DAT, then OET, then default to 'Not Started'
  function normalizePhase(s: string | undefined): string | null {
    if (!s) return null
    const t = String(s).trim().toLowerCase()
    if (t === '' || t === 'not started' || t === 'notstarted') return null
    if (/in progress|in-progress|progress|working/.test(t)) return 'In Progress'
    if (/testing complete|tested|testing completed|testing completed/i.test(t) || /tested/i.test(t)) return 'Testing Completed'
    if (/addressing|comments|addressing comments/.test(t)) return 'Addressing Comments'
    if (/complete|completed|closed/.test(t)) return 'Completed'
    // fallback: return original capitalized-ish string
    return String(s).trim()
  }

  function controlStatus(c: AnyObj) {
    // If there's an explicit completed date, treat as Completed
    if (c.completedDate) return 'Completed'

    // Try to normalize DAT/OET statuses
    const datNorm = normalizePhase(c.dat?.status)
    if (datNorm) return datNorm
    const oetNorm = normalizePhase(c.oet?.status)
    if (oetNorm) return oetNorm

    // Heuristics from notes/description
    const notes = String(c.testingNotes ?? '') + ' ' + String(c.description ?? '')
    if (/testing complete|tested|testing completed|completed/i.test(notes)) return 'Testing Completed'

    // Default
    return 'Not Started'
  }

  // canonical PhaseStatus ordering — keep this order but only render statuses present
  const canonicalOrder = ['Not Started', 'In Progress', 'Testing Completed', 'Addressing Comments', 'Completed']

  // collect unique statuses present in the controls data
  const statusSet = new Set<string>()
  for (const c of controls) statusSet.add(controlStatus(c))

  // Always show canonical statuses (in order). Append any additional statuses found in the data.
  const presentStatuses: string[] = [...canonicalOrder]
  for (const s of Array.from(statusSet)) {
    if (!presentStatuses.includes(s)) presentStatuses.push(s)
  }

  function requestsFor(controlId: string) {
    return requests.filter((r) => String(r.controlId) === String(controlId))
  }

  // Drag and drop handlers: move control into a different status column
  function handleDragStart(e: React.DragEvent, kind: 'control' | 'request', id: string) {
    e.dataTransfer.setData('text/plain', `${kind}:${id}`)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent, targetStatus: string) {
    e.preventDefault()
    const payload = e.dataTransfer.getData('text/plain')
    if (!payload) return

    const [kind, id] = payload.split(':')
    if (kind === 'control') {
      setControls((prev) => prev.map((c) => {
        if (String(c.id) !== String(id)) return c
        const updated = { ...c, dat: { ...(c.dat ?? {}), status: (targetStatus as any) } }
        if (targetStatus === 'Completed') {
          updated.completedDate = new Date().toISOString().slice(0, 10)
        } else if (updated.completedDate) {
          delete (updated as any).completedDate
        }
        return updated
      }))
    } else if (kind === 'request') {
      setRequests((prev) => prev.map((r) => (String(r.id) === String(id) ? { ...r, status: targetStatus } : r)))
    }
  }

  return (
    <div className="board-page">
      <h2>Board</h2>
      <p className="muted">Kanban columns are the control statuses found in the mock data; controls are grouped into their status column.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Hide mock data' : 'Show mock data on board'}
        </a>
      </p>

      {showMock ? (
        <div className="kanban-board bp-kanban" aria-label="Status-based kanban">
          {presentStatuses.length === 0 && <div className="empty">No statuses found in data</div>}

          {presentStatuses.map((status) => (
            <div key={status} className="control-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)}>
              <div className="control-column-header">
                <h3 className="control-title">{status}</h3>
                <div className="control-sub">{controls.filter((c) => controlStatus(c) === status).length} controls</div>
              </div>

              <div className="control-cards">
                {controls.filter((c) => controlStatus(c) === status).map((c) => (
                  <div key={c.id} draggable onDragStart={(e) => handleDragStart(e, 'control', c.id)}>
                    <ControlCard c={c} />
                    {requestsFor(c.id).map((r) => (
                      <div key={r.id} draggable onDragStart={(e) => handleDragStart(e, 'request', r.id)}>
                        <RequestCard r={r} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
      )}
    </div>
  )
}
