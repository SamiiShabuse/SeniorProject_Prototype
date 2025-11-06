import React from 'react'
import { mockControls, mockRequests } from '../mocks/mockData'
import type { Control, TestRequest } from '../lib/types'

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
          <Card key={c.id} title={`${c.id} — ${c.name}`} subtitle={`Owner: ${c.owner ?? '—'}`}>
            <div style={{ fontSize: 14 }}>{c.description}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>DAT: {c.dat?.status} • OET: {c.oet?.status}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>Start: {formatDate(c.startDate)} • Due: {formatDate(c.dueDate)}</div>
          </Card>
        ))}
      </div>

      <h2 style={{ marginTop: 20 }}>Mock Requests</h2>
      <div>
        {mockRequests.map((r: TestRequest) => (
          <Card key={r.id} title={`${r.id} — ${r.requestedBy}`} subtitle={`${r.status} • control: ${r.controlId}`}>
            <div style={{ fontSize: 14 }}>{r.scope}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>Due: {formatDate(r.dueDate)}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MockDisplay
