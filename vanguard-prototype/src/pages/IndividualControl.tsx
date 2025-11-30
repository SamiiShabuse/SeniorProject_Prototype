import { Link, useParams } from 'react-router-dom'
import { mockControls, mockRequests } from '../mocks/mockData'
import type { Control, TestRequest } from '../lib/types'

export default function IndividualControl() {
  const { id } = useParams()

  const control: Control | undefined = mockControls.find((c) => c.id === id)

  if (!control) {
    return (
      <div>
        <h2>Control not found</h2>
        <p>No control with id {id} was found in mock data.</p>
        <p>
          <Link to="/controls">Back to Controls List</Link>
        </p>
      </div>
    )
  }

  const related: TestRequest[] = mockRequests.filter((r) => r.controlId === control.id)

  return (
    <div>
      <h2>{control.name}</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>ID:</strong> {control.id}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div><strong>Control SME:</strong> {control.owner ?? '—'}</div>
          <div><strong>Control Owner:</strong> {control.tester ?? '—'}</div>
          <div><strong>Needs escalation:</strong> {control.needsEscalation ? 'Yes' : 'No'}</div>
        </div>

        <div>
          <div><strong>DAT status:</strong> {control.dat?.status}{control.dat?.step ? ` — ${control.dat.step}` : ''}</div>
          <div><strong>OET status:</strong> {control.oet?.status}{control.oet?.step ? ` — ${control.oet.step}` : ''}</div>
          <div><strong>Start date:</strong> {control.startDate ?? '—'}</div>
          <div><strong>Due date:</strong> {control.dueDate ?? '—'}</div>
          <div><strong>ETA:</strong> {control.eta ?? '—'}</div>
          <div><strong>Completed:</strong> {control.completedDate ?? '—'}</div>
        </div>
      </div>

      {(control.sme || control.description) && (
        <div style={{ marginTop: 12 }}>
          <strong>Description</strong>
          <p>{control.sme ?? control.description}</p>
        </div>
      )}

      {control.testingNotes && (
        <div style={{ marginTop: 8 }}>
          <strong>Testing notes</strong>
          <p>{control.testingNotes}</p>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <h3>Related Requests</h3>
        {related.length === 0 ? (
          <div>No related requests</div>
        ) : (
          <ul>
            {related.map((r) => (
              <li key={r.id} style={{ marginBottom: 8 }}>
                <div><strong>{r.id}</strong> — {r.scope}</div>
                <div style={{ fontSize: 13, color: '#444' }}>Requested by: {r.requestedBy} • Due: {r.dueDate} • Status: {r.status}</div>
                <div style={{ marginTop: 4 }}><Link to={`/requests/${r.id}/update`}>Open</Link></div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p style={{ marginTop: 18 }}>
        <Link to={`/controls/${control.id}/update`}>Update</Link> |{' '}
        <Link to={`/controls/${control.id}/retire`}>Retire</Link> |{' '}
        <Link to="/controls">Back to Controls List</Link>
      </p>
    </div>
  )
}
