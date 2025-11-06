import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { Control } from '../lib/types'
import { generateVGCPId, addMockControl } from '../mocks/mockData'

export default function CreateState() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [description, setDescription] = useState('')
  const [tester, setTester] = useState('')
  const [sme, setSme] = useState('')
  const [needsEscalation, setNeedsEscalation] = useState(false)
  const [datStatus, setDatStatus] = useState('Not Started')
  const [oetStatus, setOetStatus] = useState('Not Started')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !owner.trim()) {
      alert('Please provide at least a name and owner for the control.')
      return
    }

    const newControl: Control = {
      id: generateVGCPId(),
      name: name.trim(),
      description: description.trim() || undefined,
      owner: owner.trim(),
      sme: sme.trim() || undefined,
      tester: tester.trim() || undefined,
      needsEscalation,
      dat: { status: datStatus as any },
      oet: { status: oetStatus as any },
    }

    addMockControl(newControl)

    // navigate back to controls list so the new control is visible
    navigate('/controls')
  }

  return (
    <div>
      <h2>Create Control</h2>
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
          <label style={{ display: 'block' }}>Description</label>
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
          <button type="submit">Create control</button>
          <Link to="/controls" style={{ marginLeft: 12 }}>Cancel</Link>
        </div>
      </form>

      <p><Link to="/controls">Back to Controls List</Link></p>
    </div>
  )
}
