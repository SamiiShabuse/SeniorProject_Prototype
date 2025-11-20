import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { TestRequest } from '../lib/types'
import { mockRequests, mockControls, updateMockRequest } from '../mocks/mockData'

export default function UpdateIndividualRequest() {
  const { id } = useParams()
  const navigate = useNavigate()

  const req = id ? mockRequests.find((r) => String(r.id) === String(id)) : undefined

  const [scope, setScope] = useState(req?.scope ?? '')
  const [dueDate, setDueDate] = useState(req?.dueDate ?? '')
  const [requestedBy, setRequestedBy] = useState(req?.requestedBy ?? '')
  const [controlId, setControlId] = useState(req?.controlId ?? (mockControls[0]?.id ?? ''))

  useEffect(() => {
    if (req) {
      setScope(req.scope ?? '')
      setDueDate(req.dueDate ?? '')
      setRequestedBy(req.requestedBy ?? '')
      setControlId(req.controlId ?? (mockControls[0]?.id ?? ''))
    }
  }, [id])

  if (!id || !req) {
    return (
      <div>
        <h2>Update Individual Request</h2>
        <p>Request not found: {id}</p>
        <p><Link to="/requests">Back to Requests</Link></p>
      </div>
    )
  }

  function handleSave() {
    if (!req) return
    const patch: Partial<TestRequest> = {
      scope,
      dueDate,
      requestedBy,
      controlId,
    }
    updateMockRequest(req.id, patch)
    navigate('/requests')
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>Update Request {req.id}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
        <div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13 }}>Name</label>
            <input value={scope} onChange={(e) => setScope(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13 }}>Requested By</label>
            <input value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13 }}>Delivery Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ padding: '8px 10px', borderRadius: 6 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13 }}>Related Control</label>
            <select value={controlId} onChange={(e) => setControlId(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6 }}>
              {mockControls.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => navigate('/requests')} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: '8px 12px', borderRadius: 6, background: '#1a88ff', color: '#fff', border: 'none' }}>Save</button>
          </div>
        </div>

        <div>
          <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Preview</h4>
            <div><strong>Name:</strong> {scope || '—'}</div>
            <div style={{ marginTop: 8 }}><strong>Requested By:</strong> {requestedBy || '—'}</div>
            <div style={{ marginTop: 8 }}><strong>Delivery:</strong> {dueDate || '—'}</div>
            <div style={{ marginTop: 8 }}><strong>Related Control:</strong> {mockControls.find((c) => c.id === controlId)?.name ?? '—'}</div>
          </div>
        </div>
      </div>
      <p style={{ marginTop: 12 }}><Link to="/requests">Back to Requests</Link></p>
    </div>
  )
}
