import { useEffect, useState } from 'react'
import type { Control } from '../lib/types'
import { updateMockControl, mockRequests } from '../mocks/mockData'
import './ControlModal.css'

interface Props {
  control: Control
  onClose: () => void
  onSaved?: (c: Control) => void
}

export default function EditControlModal({ control, onClose, onSaved }: Props) {
  const [name] = useState(control.name ?? '')
  const [owner] = useState(control.owner ?? '')
  const [description, setDescription] = useState(control.description ?? '')
  const [tester] = useState(control.tester ?? '')
  const [sme] = useState(control.sme ?? '')
  const [needsEscalation] = useState(Boolean(control.needsEscalation))
  const [datStatus] = useState(control.dat?.status ?? 'Not Started')
  const [oetStatus] = useState(control.oet?.status ?? 'Not Started')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSave() {
    const patch: Partial<Control> = {
      name: name.trim(),
      owner: owner.trim(),
      description: description.trim() || undefined,
      tester: tester.trim() || undefined,
      sme: sme.trim() || undefined,
      needsEscalation,
      dat: { status: datStatus as any },
      oet: { status: oetStatus as any },
    }
    const updated = updateMockControl(control.id, patch)
    if (updated && onSaved) onSaved(updated)
    onClose()
  }

  // derive requests for this control
  const requests = mockRequests.filter((r) => r.controlId === control.id)

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 1100, width: '95%', borderRadius: 10 }}>
        {/* Header with centered title and top-right actions */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #e6e6e6' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h3 style={{ margin: 0 }}>{control.name || `Control ${control.id}`}</h3>
          </div>
          <div style={{ position: 'absolute', right: 18, top: 12, display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', borderRadius: 16, background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>Edit Control</button>
            <button style={{ padding: '6px 10px', borderRadius: 16, background: '#fff', border: '1px solid #ddd', cursor: 'pointer' }}>Historical Changes</button>
            <button className="cm-close" aria-label="Close" onClick={onClose} style={{ marginLeft: 8, background: 'transparent', border: 'none', fontSize: 18 }}>✕</button>
          </div>
        </div>

        {/* Body: three columns */}
        <div style={{ padding: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px 260px', gap: 16 }}>
            {/* Left: description panel */}
            <div style={{ background: '#f2f2f2', borderRadius: 8, padding: 16, minHeight: 220 }}>
              <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>Description</div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', minHeight: 150, borderRadius: 6, padding: 12, border: '1px solid #e0e0e0', resize: 'vertical' }} />
            </div>

            {/* Middle: metadata */}
            <div style={{ borderRadius: 8, padding: 12, background: '#fff', boxShadow: 'inset 0 0 0 1px #f3f3f3' }}>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Control Owner: <strong style={{ color: '#222' }}>{owner || '—'}</strong></div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Control SME: <strong style={{ color: '#222' }}>{sme || '—'}</strong></div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Control Escalation Required: <strong style={{ color: '#222' }}>{needsEscalation ? 'Yes' : 'No'}</strong></div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Control ID: <strong style={{ color: '#222' }}>{control.id}</strong></div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>VGCP ID: <strong style={{ color: '#222' }}>{control.id}</strong></div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Last Updated: <strong style={{ color: '#222' }}>{control.completedDate ?? '—'}</strong></div>
              <div style={{ fontSize: 13, color: '#666' }}>Date Created: <strong style={{ color: '#222' }}>{control.startDate ?? '—'}</strong></div>
            </div>

            {/* Right: Requests */}
            <div style={{ borderRadius: 8, padding: 12, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Requests</div>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: '#6fbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(control.owner || 'U').slice(0,1).toUpperCase()}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {requests.length === 0 && <div style={{ color: '#999' }}>No requests</div>}
                {requests.map((r) => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 6, background: '#f8f8f8' }}>
                    <div style={{ color: '#0077cc' }}>{r.id}</div>
                    <div style={{ color: r.status === 'Complete' ? '#4caf50' : '#f44336', fontSize: 12 }}>{r.status === 'Complete' ? 'Active' : 'Inactive'}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{r.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div style={{ marginTop: 16, background: '#f2f2f2', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Comments</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {control.testingNotes ? (
                <div style={{ padding: 10, borderRadius: 6, background: '#fff', display: 'flex', gap: 12 }}>
                  <div style={{ width: 120, color: '#666', fontSize: 12 }}>{control.completedDate ?? new Date().toLocaleDateString()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#444' }}><strong>{control.tester ?? 'Unknown'}</strong> — <span style={{ color: '#666', fontSize: 13 }}>{control.testingNotes}</span></div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#666' }}>No comments</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 18px', borderTop: '1px solid #e6e6e6' }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 12px', borderRadius: 6, background: '#1a88ff', color: '#fff', border: 'none' }}>Save</button>
        </div>
      </div>
    </div>
  )
}
