import { Link } from 'react-router-dom'
import { useState } from 'react'
import { mockControls } from '../mocks/mockData'

export default function ControlsList() {
  const [showMock, setShowMock] = useState(true)

  return (
    <div>
      <h2>Controls List</h2>
      <p>List of controls. Click a control to view details or create a new control.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Hide mock data' : 'Show mock data'}
        </a>
      </p>

      {showMock ? (
        <ul>
          {mockControls.map((c) => (
            <li key={c.id}>
              <Link to={`/controls/${c.id}`}>{c.id} — {c.title} ({c.status})</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
      )}

      <p><Link to="/controls/create">Create new control</Link></p>
    </div>
  )
}
