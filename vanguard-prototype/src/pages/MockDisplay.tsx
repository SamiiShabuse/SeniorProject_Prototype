import React from 'react'
import { mockControls, mockRequests } from '../mocks/mockData'
import type { Control, Request } from '../mocks/mockData'

const Card: React.FC<{ title: string; subtitle?: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 8 }}>
    <div style={{ fontWeight: 600 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 12, color: '#666' }}>{subtitle}</div>}
    <div style={{ marginTop: 8 }}>{children}</div>
  </div>
)

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—')

const MockDisplay: React.FC = () => {
  return (
    <div>
      <h2>Mock Controls</h2>
      <div>
        {mockControls.map((c: Control) => (
          <Card key={c.id} title={`${c.id} — ${c.title}`} subtitle={`${c.status} • owner: ${c.owner ?? '—'}`}>
            <div style={{ fontSize: 14 }}>{c.description}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>Last tested: {formatDate(c.lastTested)}</div>
            {c.relatedRequests && c.relatedRequests.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 12 }}>
                Related requests: {c.relatedRequests.join(', ')}
              </div>
            )}
          </Card>
        ))}
      </div>

      <h2 style={{ marginTop: 20 }}>Mock Requests</h2>
      <div>
        {mockRequests.map((r: Request) => (
          <Card key={r.id} title={`${r.id} — ${r.title}`} subtitle={`${r.status} • by ${r.createdBy ?? '—'}`}>
            <div style={{ fontSize: 14 }}>{r.description}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>Created: {formatDate(r.createdAt)}</div>
            {r.relatedControlId && <div style={{ marginTop: 6, fontSize: 12 }}>Related control: {r.relatedControlId}</div>}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MockDisplay
