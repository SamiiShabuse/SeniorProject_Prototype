import { useEffect, useState } from 'react'
import type { TestRequest } from '../lib/types'
import { updateMockRequest } from '../mocks/mockData'
import './ControlModal.css'

interface Props {
  request: TestRequest
  onClose: () => void
  onSaved?: (r: TestRequest) => void
}

export default function EditRequestModal({ request, onClose, onSaved }: Props) {
  const [scope, setScope] = useState(request.scope ?? '')
  const [dueDate, setDueDate] = useState(request.dueDate ?? '')
  const [requestedBy, setRequestedBy] = useState(request.requestedBy ?? '')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSave() {
    const patch: Partial<TestRequest> = {
      scope,
      dueDate,
      requestedBy,
    }
    const updated = updateMockRequest(request.id, patch)
    if (updated && onSaved) onSaved(updated)
    onClose()
  }

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800 }}>
        <div className="cm-header">
          <h3 className="cm-title">Edit Request {request.id}</h3>
          <div className="cm-actions">
            <button className="cm-close" aria-label="Close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cm-body">
          <div className="cm-left">
            <div className="cm-panel">
              <div style={{ display: 'grid', gap: 10 }}>
                <label style={{ fontSize: 13 }}>
                  Name:
                  <input value={scope} onChange={(e) => setScope(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 6 }} />
                </label>

                <label style={{ fontSize: 13 }}>
                  Delivery Date:
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: 220, marginTop: 6, padding: '8px 10px', borderRadius: 6 }} />
                </label>

                <label style={{ fontSize: 13 }}>
                  Requested By:
                  <input value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 6 }} />
                </label>
              </div>
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-panel">
              <h4 style={{ marginTop: 0 }}>Preview</h4>
              <div style={{ color: '#333' }}>
                <div><strong>Name:</strong> {scope || '—'}</div>
                <div style={{ marginTop: 8 }}><strong>Requested By:</strong> {requestedBy || '—'}</div>
                <div style={{ marginTop: 8 }}><strong>Delivery:</strong> {dueDate || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '0 18px 18px' }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 12px', borderRadius: 6, background: '#1a88ff', color: '#fff', border: 'none' }}>Save</button>
        </div>
      </div>
    </div>
  )
}
