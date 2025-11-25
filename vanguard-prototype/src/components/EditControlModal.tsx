import { useEffect, useState } from 'react'
import type { Control } from '../lib/types'
import { updateMockControl } from '../mocks/mockData'
import './ControlModal.css'

interface Props {
  control: Control
  onClose: () => void
  onSaved?: (c: Control) => void
}

export default function EditControlModal({ control, onClose, onSaved }: Props) {
  const [name, setName] = useState(control.name ?? '')
  const [owner, setOwner] = useState(control.owner ?? '')
  const [description, setDescription] = useState(control.description ?? '')
  const [tester, setTester] = useState(control.tester ?? '')
  const [sme, setSme] = useState(control.sme ?? '')
  const [needsEscalation, setNeedsEscalation] = useState(Boolean(control.needsEscalation))
  const [datStatus, setDatStatus] = useState(control.dat?.status ?? 'Not Started')
  const [oetStatus, setOetStatus] = useState(control.oet?.status ?? 'Not Started')

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

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
        <div className="cm-header">
          <h3 className="cm-title">Edit Control — {control.id}</h3>
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
                  <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 6 }} />
                </label>

                <label style={{ fontSize: 13 }}>
                  Owner:
                  <input value={owner} onChange={(e) => setOwner(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 6 }} />
                </label>

                <label style={{ fontSize: 13 }}>
                  Description:
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', marginTop: 6, padding: 10, minHeight: 80, borderRadius: 6 }} />
                </label>

                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 13 }}>Tester</label>
                    <input value={tester} onChange={(e) => setTester(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 13 }}>SME</label>
                    <input value={sme} onChange={(e) => setSme(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6 }} />
                  </div>
                </div>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={needsEscalation} onChange={(e) => setNeedsEscalation(e.target.checked)} /> Needs escalation
                </label>
              </div>
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-panel">
              <h4 style={{ marginTop: 0 }}>Statuses</h4>
              <div style={{ marginBottom: 8 }}>
                <label>DAT status</label>
                <select value={datStatus} onChange={(e) => setDatStatus(e.target.value as any)} style={{ width: '100%', marginTop: 6 }}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Testing Completed</option>
                  <option>Addressing Comments</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label>OET status</label>
                <select value={oetStatus} onChange={(e) => setOetStatus(e.target.value as any)} style={{ width: '100%', marginTop: 6 }}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Testing Completed</option>
                  <option>Addressing Comments</option>
                  <option>Completed</option>
                </select>
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
