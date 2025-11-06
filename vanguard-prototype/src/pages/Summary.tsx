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

      <div style={{ display: 'flex', gap: 24, marginTop: 12, alignItems: 'flex-start' }}>
        <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Controls (DAT status)</h3>
          <PieChart data={datSlices} />
          <div style={{ marginTop: 8 }}>
            {datSlices.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 3 }} />
                <div style={{ fontSize: 13 }}>{s.label}: <strong>{s.value}</strong></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 220 }}>
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
      </div>
    </div>
  )
}
