import { Link } from 'react-router-dom'
import { useState } from 'react'
import { mockRequests } from '../mocks/mockData'

export default function IndividualRequest() {
  const [showMock, setShowMock] = useState(true)

  return (
    <div>
      <h2>Requests</h2>
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
              <li key={r.id} style={{ marginBottom: 10 }}>
                <div><strong>{r.id}</strong> — <em>{r.requestedBy}</em> • Status: {r.status}</div>
                <div style={{ fontSize: 13 }}>{r.scope}</div>
                <div style={{ fontSize: 12, color: '#444', marginTop: 4 }}>Control: {r.controlId} • Due: {r.dueDate}</div>
                <div style={{ marginTop: 6 }}><Link to={`/requests/${r.id}/update`}>Open / Edit</Link></div>
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
