import { Link } from 'react-router-dom'
import { useState } from 'react'
import { mockControls } from '../mocks/mockData'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(false)

  const testing = mockControls.filter((c) => c.status === 'testing')

  return (
    <div>
      <h2>Active Controls Testing List</h2>
      <p>List of active controls under testing.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>Show mock testing controls</a>
      </p>

      {showMock ? (
        <ul>
          {testing.length === 0 && <li>No mock testing controls</li>}
          {testing.map((c) => (
            <li key={c.id}><Link to={`/corresponding/${c.id}`}>{c.id} — {c.title}</Link></li>
          ))}
        </ul>
      ) : (
        <ul>
          <li><Link to="/corresponding/101">Corresponding Control #101</Link></li>
        </ul>
      )}
    </div>
  )
}
