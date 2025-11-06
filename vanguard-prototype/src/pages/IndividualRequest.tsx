import { Link } from 'react-router-dom'
import { useState } from 'react'
import { mockRequests } from '../mocks/mockData'

export default function IndividualRequest() {
  const [showMock, setShowMock] = useState(true)

  return (
    <div>
      <h2>Individual Request</h2>
      <p>Requests list / single request entry point.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Hide mock requests' : 'Show mock requests'}
        </a>
      </p>

      {showMock ? (
        <div>
          <ul>
            {mockRequests.map((r) => (
              <li key={r.id}>
                <strong>{r.id}</strong> — {r.title} ({r.status})
                <div style={{ fontSize: 12, color: '#444' }}>{r.description}</div>
                <div style={{ marginTop: 4 }}><Link to={`/requests/${r.id}/update`}>Open</Link></div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ color: '#666' }}><em>Mock data hidden</em></div>
      )}
    </div>
  )
}
