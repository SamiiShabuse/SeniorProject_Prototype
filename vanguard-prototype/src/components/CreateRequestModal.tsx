import { useEffect, useState } from 'react'
import type { TestRequest } from '../lib/types'
import { mockControls, addMockRequest } from '../mocks/mockData'
import './ControlModal.css'

interface Props {
  onClose: () => void
  onCreated?: (r: TestRequest) => void
}

export default function CreateRequestModal({ onClose, onCreated }: Props) {
  const controls = mockControls
  const testers = Array.from(new Set(mockControls.map((c) => c.tester).filter(Boolean))) as string[]

  const [scope, setScope] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [requestedBy, setRequestedBy] = useState(testers[0] ?? '')
  const [controlId, setControlId] = useState<string>(controls[0]?.id ?? '')
  const [testersOpen, setTestersOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleCreate() {
    const newReq: TestRequest = {
      id: `r${Date.now()}`,
      controlId: controlId || (controls[0]?.id ?? ''),
      requestedBy: requestedBy || 'Unknown',
      scope: scope || description || 'New request',
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      status: 'Pending',
    }
    addMockRequest(newReq)
    onCreated?.(newReq)
  }

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
        <div className="cm-header">
          <h3 className="cm-title">Request Creation</h3>
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
                  Description:
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', marginTop: 6, padding: 10, minHeight: 80, borderRadius: 6 }} />
                </label>

                <label style={{ fontSize: 13 }}>
                  Delivery Date:
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: 220, marginTop: 6, padding: '8px 10px', borderRadius: 6 }} />
                </label>

                <label style={{ fontSize: 13 }}>
                  Related Control:
                  <select value={controlId} onChange={(e) => setControlId(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 6 }}>
                    {controls.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                    ))}
                  </select>
                </label>

                <div>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>Assign Tester:</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ color: '#222' }}>{requestedBy || 'Unassigned'}</div>
                          <button onClick={() => setTestersOpen((s) => !s)} style={{ background: '#eee', border: 'none', padding: '6px 8px', borderRadius: 6, cursor: 'pointer' }}>Select</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {testersOpen && (
                    <div style={{ marginTop: 8, border: '1px solid #e6e6e6', borderRadius: 6, maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                      {testers.length === 0 && <div style={{ color: '#666' }}>No testers found in mock data.</div>}
                      {testers.map((t, i) => (
                        <div key={t || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 6px', borderBottom: '1px solid #f3f3f3' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{t}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>ID: T-{String(i + 100)}</div>
                          </div>
                          <div>
                            <button onClick={() => { setRequestedBy(t); setTestersOpen(false) }} style={{ background: '#1a88ff', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Assign</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-panel">
              <h4 style={{ marginTop: 0 }}>Preview</h4>
              <div style={{ color: '#333' }}>
                <div><strong>Name:</strong> {scope || '—'}</div>
                <div style={{ marginTop: 8 }}><strong>Assigned Tester:</strong> {requestedBy || '—'}</div>
                <div style={{ marginTop: 8 }}><strong>Delivery:</strong> {dueDate || '—'}</div>
                <div style={{ marginTop: 8 }}><strong>Related Control:</strong> {controls.find((c) => c.id === controlId)?.name ?? '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '0 18px 18px' }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Cancel</button>
          <button onClick={handleCreate} style={{ padding: '8px 12px', borderRadius: 6, background: '#1a88ff', color: '#fff', border: 'none' }}>Create</button>
        </div>
      </div>
    </div>
  )
}
