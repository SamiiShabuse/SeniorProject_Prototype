import { Link } from 'react-router-dom'
import { mockControls } from '../mocks/mockData'
import { mockRequests } from '../mocks/mockData'

type Slice = { label: string; value: number; color: string }

function PieChart({ data, size = 160 }: { data: Slice[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let angle = -Math.PI / 2 // start at top

  const center = size / 2
  const radius = size / 2 - 2

  function arcPath(startAngle: number, endAngle: number) {
    const x1 = center + radius * Math.cos(startAngle)
    const y1 = center + radius * Math.sin(startAngle)
    const x2 = center + radius * Math.cos(endAngle)
    const y2 = center + radius * Math.sin(endAngle)
    const large = endAngle - startAngle > Math.PI ? 1 : 0
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {data.map((d, i) => {
        const frac = total === 0 ? 0 : d.value / total
        const nextAngle = angle + frac * Math.PI * 2
        const path = arcPath(angle, nextAngle)
        angle = nextAngle
        return <path key={i} d={path} fill={d.color} stroke="#fff" strokeWidth={1} />
      })}
      {/* center label */}
      <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 12, fontWeight: 600 }}>
        {total}
      </text>
    </svg>
  )
}

export default function Summary() {
  // compute DAT status distribution
  const datBuckets = new Map<string, number>()
  const datLabels = ['Not Started', 'In Progress', 'Testing Completed', 'Addressing Comments', 'Completed']
  datLabels.forEach((l) => datBuckets.set(l, 0))

  mockControls.forEach((c) => {
    const s = c.dat?.status ?? 'Not Started'
    datBuckets.set(s, (datBuckets.get(s) ?? 0) + 1)
  })

  const palette = ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#607d8b']

  const datSlices: Slice[] = datLabels.map((label, i) => ({ label, value: datBuckets.get(label) ?? 0, color: palette[i % palette.length] }))

  // requests by status
  const reqCounts = mockRequests.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="panel">
      <h2>Summary</h2>
      <p className="muted">Overview of controls and requests. Click through to view details.</p>
      {/* Top-level KPI row */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ padding: 14, border: '1px solid #eee', borderRadius: 8, minWidth: 180 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Total Controls</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{mockControls.length}</div>
        </div>

        <div style={{ padding: 14, border: '1px solid #eee', borderRadius: 8, minWidth: 180 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Active Controls</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{mockControls.filter((c) => (c.dat?.status ?? '').toLowerCase() !== 'completed' && !(String(c.dat?.status ?? '').trim() === '' && /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? '')))).length}</div>
        </div>

        <div style={{ padding: 14, border: '1px solid #eee', borderRadius: 8, minWidth: 260, flex: '1 1 320px' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Overall completion</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              {(() => {
                const total = mockControls.length
                const completed = mockControls.filter((c) => String(c.dat?.status ?? '').toLowerCase() === 'completed' || /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? ''))).length
                const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
                return (
                  <>
                    <div style={{ height: 10, background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#4caf50', transition: 'width 400ms ease' }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{completed} completed — {pct}%</div>
                  </>
                )
              })()}
            </div>
            <div style={{ width: 60, textAlign: 'right', fontWeight: 700 }}>{mockRequests.length}</div>
          </div>
        </div>

        {/* DAT pie + legend */}
        <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0' }}>Controls (DAT)</h3>
            <PieChart data={datSlices} />
          </div>
          <div style={{ minWidth: 160 }}>
            {datSlices.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 3 }} />
                <div style={{ fontSize: 13 }}>{s.label}: <strong>{s.value}</strong></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row: requests breakdown + upcoming + top owners */}
      <div style={{ display: 'flex', gap: 16, marginTop: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 260 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Requests</h3>
          <div style={{ fontSize: 14 }}>
            {Object.keys(reqCounts).length === 0 && <div>No requests</div>}
            {Object.entries(reqCounts).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 6 }}>{k}: <strong>{v}</strong></div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/controls">View Controls</Link> | <Link to="/requests">View Requests</Link>
          </div>
        </div>

        <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 320, flex: '1 1 420px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Upcoming due controls</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockControls
              .filter((c) => c.dueDate)
              .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
              .slice(0, 6)
              .map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontSize: 13 }}><Link to={`/controls/${c.id}`}>{c.name}</Link></div>
                  <div style={{ fontSize: 13, color: '#444' }}>{String(c.dueDate)}</div>
                </div>
              ))}
          </div>
        </div>

        <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 220 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Top owners</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(() => {
              const ownerCounts = mockControls.reduce<Record<string, number>>((acc, c) => {
                const k = c.owner ?? 'Unassigned'
                acc[k] = (acc[k] ?? 0) + 1
                return acc
              }, {})
              return Object.entries(ownerCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([k, v]) => (
                  <div key={k} style={{ fontSize: 13 }}>{k}: <strong>{v}</strong></div>
                ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
