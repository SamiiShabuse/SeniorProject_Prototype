import { useEffect, useState } from 'react'
import type { Control } from '../lib/types'
import { addMockControl, generateVGCPId } from '../mocks/mockData'
import './ControlModal.css'

interface Props {
  onClose: () => void
  onCreated?: (c: Control) => void
}

export default function CreateControlModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [description, setDescription] = useState('')
  const [tester, setTester] = useState('')
  const [sme, setSme] = useState('')
  const [needsEscalation, setNeedsEscalation] = useState(false)
  const [datStatus, setDatStatus] = useState('Not Started')
  const [oetStatus, setOetStatus] = useState('Not Started')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSave() {
    const id = generateVGCPId()
    const newControl: Control = {
      id,
      name: name.trim() || `New Control ${id}`,
      owner: owner.trim() || 'Unassigned',
      description: description.trim() || undefined,
      tester: tester.trim() || undefined,
      sme: sme.trim() || undefined,
      needsEscalation,
      dat: { status: datStatus as any },
      oet: { status: oetStatus as any },
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    }
    addMockControl(newControl)
    if (onCreated) onCreated(newControl)
    onClose()
  }

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
        <div className="cm-header">
          <h3 className="cm-title">Create New Control</h3>
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

                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 13 }}>Start date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 13 }}>Due date</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-panel">
              <h4 style={{ marginTop: 0 }}>Statuses</h4>
              <div style={{ marginBottom: 8 }}>
                <label>DAT status</label>
                <select value={datStatus} onChange={(e) => setDatStatus(e.target.value)} style={{ width: '100%', marginTop: 6 }}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Testing Completed</option>
                  <option>Addressing Comments</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label>OET status</label>
                <select value={oetStatus} onChange={(e) => setOetStatus(e.target.value)} style={{ width: '100%', marginTop: 6 }}>
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
          <button onClick={handleSave} style={{ padding: '8px 12px', borderRadius: 6, background: '#1a88ff', color: '#fff', border: 'none' }}>Create Control</button>
        </div>
      </div>
    </div>
  )
}
