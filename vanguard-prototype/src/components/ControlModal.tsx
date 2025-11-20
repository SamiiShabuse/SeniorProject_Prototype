import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Control, TestRequest } from '../lib/types'
import { mockRequests } from '../mocks/mockData'
import './ControlModal.css'
import EditControlModal from './EditControlModal'

interface Props {
  control: Control
  onClose: () => void
  editPreference?: 'route' | 'modal'
}

export default function ControlModal({ control, onClose, editPreference }: Props) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  // filter requests for this control
  const requests: TestRequest[] = mockRequests.filter((r) => r.controlId === control.id)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-container" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <h3 className="cm-title">{control.name}</h3>
          <div className="cm-actions">
            <button
              className="cm-btn"
              onClick={() => {
                if (editPreference === 'modal') {
                  setEditing(true)
                  return
                }
                onClose()
                navigate(`/controls/${control.id}/update`)
              }}
            >Edit Control</button>
            <button className="cm-btn">Historical Changes</button>
            <button className="cm-close" aria-label="Close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cm-body">
          <div className="cm-left">
            <div className="cm-panel">
              <p className="cm-desc">{control.description ?? 'No description available.'}</p>
            </div>
          </div>

          <div className="cm-center">
            <div className="cm-panel">
              <div><strong>Control Owner:</strong> {control.owner || '—'}</div>
              <div><strong>Control SME:</strong> {control.sme || '—'}</div>
              <div><strong>Escalation Required:</strong> {control.needsEscalation ? 'Yes' : 'No'}</div>
              <div><strong>Control ID:</strong> {control.id}</div>
              <div style={{ marginTop: 8 }}><strong>Dates</strong></div>
              <div><small>Start: {control.startDate ?? '—'}</small></div>
              <div><small>Due: {control.dueDate ?? '—'}</small></div>
              <div><small>Last Completed: {control.completedDate ?? '—'}</small></div>
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-panel">
              <h4 style={{ marginTop: 0 }}>Requests</h4>
              {requests.length ? (
                <ul className="cm-requests">
                  {requests.map((r) => (
                    <li key={r.id} className="cm-request-item">
                      <div className="cm-req-title">{r.id}</div>
                      <div className="cm-req-sub" style={{ color: r.status === 'Complete' ? 'green' : (r.status === 'In Progress' ? 'orange' : 'red') }}>{r.status} • {r.dueDate}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#666' }}>No requests</div>
              )}
            </div>
          </div>
        </div>

        <div className="cm-comments">
          <h4>Comments</h4>
          <div className="cm-comment-list">
            <div className="cm-comment">No comments in mock data.</div>
          </div>
        </div>
      </div>
      {editing && (
        <EditControlModal
          control={control}
          onClose={() => setEditing(false)}
          onSaved={() => {
            // close the parent modal after save
            onClose()
          }}
        />
      )}
    </div>
  )
}
