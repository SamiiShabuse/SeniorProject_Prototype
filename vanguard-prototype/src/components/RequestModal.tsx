import { useEffect } from 'react'
import type { TestRequest, Control } from '../lib/types'
import { mockControls } from '../mocks/mockData'
import './ControlModal.css'

interface Props {
  request: TestRequest
  onClose: () => void
}

export default function RequestModal({ request, onClose }: Props) {
  // find related controls for this request — support single id, comma-separated ids, or an array
  const parseControlIds = (raw: any): string[] => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw.map(String)
    if (typeof raw === 'string') {
      // comma-separated list?
      if (raw.includes(',')) return raw.split(',').map((s) => s.trim())
      return [raw]
    }
    return [String(raw)]
  }

  const controlIds = parseControlIds((request as any).controlId)
  const controls: Control[] = mockControls.filter((c) => controlIds.includes(String(c.id)))

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
          <h3 className="cm-title">Request {request.id}</h3>
          <div className="cm-actions">
            <button className="cm-btn">Edit Request</button>
            <button className="cm-close" aria-label="Close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cm-body">
          <div className="cm-left">
            <div className="cm-panel">
              <p className="cm-desc">{request.scope ?? 'No scope provided.'}</p>
              <div style={{ marginTop: 8 }}><strong>Requested By:</strong> {request.requestedBy ?? '—'}</div>
              <div style={{ marginTop: 4 }}><strong>Due Date:</strong> {request.dueDate ?? '—'}</div>
              <div style={{ marginTop: 4 }}><strong>Status:</strong> {request.status ?? 'In Progress'}</div>
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-panel">
              <h4 style={{ marginTop: 0 }}>Notes</h4>
              <div style={{ color: '#333' }}>{request.scope ?? 'No notes provided.'}</div>
            </div>
          </div>
        </div>

        {/* Related controls go below the main panels as a full-width section */}
        <div style={{ padding: '0 18px 18px' }}>
          <div className="cm-panel">
            <div><strong>Related Controls</strong></div>
            {controls.length ? (
              <ul className="cm-requests" style={{ marginTop: 8 }}>
                {controls.map((c) => (
                  <li key={c.id} className="cm-request-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <a href={`#/controls/${c.id}`} style={{ color: '#1a88ff', fontWeight: 600 }}>{c.name}</a>
                        <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>{c.description ? String(c.description).slice(0, 160) : ''}</div>
                      </div>
                      <div style={{ width: 220, textAlign: 'right', fontSize: 13 }}>
                        <div><strong>Tester:</strong> {c.tester ?? '—'}</div>
                        <div style={{ marginTop: 6 }}><small>Start: {c.startDate ?? '—'}</small></div>
                        <div style={{ marginTop: 4 }}><small>ETA: {c.dueDate ?? '—'}</small></div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: '#666', marginTop: 8 }}>No related controls</div>
            )}
          </div>
        </div>

        <div className="cm-comments">
          <h4>Comments</h4>
          <div className="cm-comment-list">
            <div className="cm-comment">No comments in mock data.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
