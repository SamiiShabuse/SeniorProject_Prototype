import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { mockControls, updateMockControl } from '../mocks/mockData'
import type { Control } from '../lib/types'

export default function UpdateControlDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const control = mockControls.find((c) => c.id === id)

  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [description, setDescription] = useState('')
  const [tester, setTester] = useState('')
  const [sme, setSme] = useState('')
  const [needsEscalation, setNeedsEscalation] = useState(false)
  const [datStatus, setDatStatus] = useState('Not Started')
  const [oetStatus, setOetStatus] = useState('Not Started')

  useEffect(() => {
    if (!control) return
    setName(control.name ?? '')
    setOwner(control.owner ?? '')
    // Treat the editable description textarea as the SME text (current SME content)
    setDescription(control.sme ?? control.description ?? '')
    setTester(control.tester ?? '')
    setSme(control.sme ?? '')
    setNeedsEscalation(Boolean(control.needsEscalation))
    setDatStatus(control.dat?.status ?? 'Not Started')
    setOetStatus(control.oet?.status ?? 'Not Started')
  }, [control])

  if (!control) {
    return (
      <div>
        <h2>Control not found</h2>
        <p>No control with id {id} was found.</p>
        <p><Link to="/controls">Back to Controls List</Link></p>
      </div>
    )
  }

  const controlId = control.id

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !owner.trim()) {
      alert('Please provide at least a name and owner for the control.')
      return
    }

    const patch: Partial<Control> = {
      name: name.trim(),
      // Persist the textarea as SME text (description shown in UI is the SME content)
      sme: (description.trim() || sme.trim()) || undefined,
      owner: owner.trim(),
      tester: tester.trim() || undefined,
      needsEscalation,
      dat: { status: datStatus as any },
      oet: { status: oetStatus as any },
    }

  updateMockControl(controlId, patch)
  navigate(`/controls/${controlId}`)
  }

  return (
    <div>
      <h2>Update Control — {control.id}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>Name (required)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>Owner (required)</label>
          <input value={owner} onChange={(e) => setOwner(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>Description (Control SME text)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Tester</label>
            <input value={tester} onChange={(e) => setTester(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>SME</label>
            <input value={sme} onChange={(e) => setSme(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={needsEscalation} onChange={(e) => setNeedsEscalation(e.target.checked)} /> Needs escalation
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label>DAT status</label>
            <select value={datStatus} onChange={(e) => setDatStatus(e.target.value)} style={{ width: '100%' }}>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Testing Completed</option>
              <option>Addressing Comments</option>
              <option>Completed</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>OET status</label>
            <select value={oetStatus} onChange={(e) => setOetStatus(e.target.value)} style={{ width: '100%' }}>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Testing Completed</option>
              <option>Addressing Comments</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button type="submit">Save changes</button>
          <Link to={`/controls/${control.id}`} style={{ marginLeft: 12 }}>Cancel</Link>
        </div>
      </form>

      <p><Link to={`/controls/${control.id}`}>Back to Control</Link></p>
    </div>
  )
}
