import { Link } from 'react-router-dom'
import { useState } from 'react'
import { mockControls } from '../mocks/mockData'

export default function ControlsList() {
  const [showMock, setShowMock] = useState(false)

  return (
    <div>
      <h2>Controls List</h2>
      <p>List of controls. Click a control to view details or create a new control.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>Show mock data</a>
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
        <ul>
          <li><Link to="/controls/1">Control #1 (example)</Link></li>
          <li><Link to="/controls/2">Control #2 (example)</Link></li>
        </ul>
      )}

      <p><Link to="/controls/create">Create new control</Link></p>
    </div>
  )
}
