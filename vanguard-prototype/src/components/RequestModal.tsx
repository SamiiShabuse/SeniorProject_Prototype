import { useEffect } from 'react'
import type { TestRequest, Control } from '../lib/types'
import { mockControls } from '../mocks/mockData'
import './ControlModal.css'

interface Props {
  request: TestRequest
  onClose: () => void
}

export default function RequestModal({ request, onClose }: Props) {
  // find related controls for this request
  const controls: Control[] = mockControls.filter((c) => String(c.id) === String(request.controlId))

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

          <div className="cm-center">
            <div className="cm-panel">
              <div><strong>Related Controls</strong></div>
              {controls.length ? (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px 140px', gap: 8 }}>
                    {controls.map((c) => (
                      <div key={c.id} style={{ display: 'contents' }}>
                        <div style={{ padding: '8px 0' }}><a href={`#/controls/${c.id}`} style={{ color: '#1a88ff' }}>{c.name}</a></div>
                        <div style={{ padding: '8px 0', fontWeight: 600 }}>{c.tester ?? '—'}</div>
                        <div style={{ padding: '8px 0' }}>Started on {c.startDate ?? '—'}</div>
                        <div style={{ padding: '8px 0' }}>ETA {c.dueDate ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#666', marginTop: 8 }}>No related controls</div>
              )}
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-panel">
              <h4 style={{ marginTop: 0 }}>Notes</h4>
              <div style={{ color: '#333' }}>{request.scope ?? 'No notes provided.'}</div>
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
    </div>
  )
}
