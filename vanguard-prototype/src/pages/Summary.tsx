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
  // compute DAT status distribution and helper fns
  const datLabels = ['Not Started', 'In Progress', 'Testing Completed', 'Addressing Comments', 'Completed']
  const datCounts: Record<string, number> = {}
  datLabels.forEach((l) => (datCounts[l] = 0))

  // categorize each control into a DAT label
  mockControls.forEach((c) => {
    const raw = String(c.dat?.status ?? '').trim()
    let label = 'Not Started'
    if (!raw) {
      // fallback: some sheets put 'Completed' into notes/description
      if (/completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? ''))) label = 'Completed'
      else label = 'Not Started'
    } else {
      const s = raw.toLowerCase()
      if (s.includes('not')) label = 'Not Started'
      else if (s.includes('progress') || s.includes('in progress')) label = 'In Progress'
      else if (s.includes('testing')) label = 'Testing Completed'
      else if (s.includes('address') || s.includes('comments')) label = 'Addressing Comments'
      else if (s.includes('complete')) label = 'Completed'
      else label = 'In Progress'
    }
    datCounts[label] = (datCounts[label] ?? 0) + 1
  })

  const statusColors: Record<string, string> = {
    'Not Started': '#9aa4b2',
    'In Progress': '#1a88ff',
    'Testing Completed': '#f6a623',
    'Addressing Comments': '#ff7043',
    Completed: '#4caf50',
  }

  const datSlices: Slice[] = datLabels.map((label) => ({ label, value: datCounts[label] ?? 0, color: statusColors[label] ?? '#ccc' }))

  function formatBadgeDate(d?: string) {
    if (!d) return '—'
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return String(d)
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <div className="panel" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Overview</h2>
          <p className="muted" style={{ marginTop: 6 }}>Live dashboard of controls and requests — actionable insights at a glance.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}>Export</button>
          <button style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#1a88ff', color: '#fff' }}>Refresh</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 16 }}>
        <div style={{ padding: 16, borderRadius: 12, background: 'linear-gradient(180deg,#fff,#fbfcff)', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Total Controls</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{mockControls.length}</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>All controls imported from tracker</div>
        </div>

        <div style={{ padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Active Controls</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{mockControls.filter((c) => (c.dat?.status ?? '').toLowerCase() !== 'completed' && !(String(c.dat?.status ?? '').trim() === '' && /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? '')))).length}</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>Based on DAT status (and notes)</div>
        </div>

        <div style={{ padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Open Requests</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{mockRequests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length}</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>Requests needing attention</div>
        </div>

        <div style={{ padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Completion</div>
          {(() => {
            const total = mockControls.length
            const completed = mockControls.filter((c) => String(c.dat?.status ?? '').toLowerCase() === 'completed' || /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? ''))).length
            const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
            return (
              <>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{pct}%</div>
                <div style={{ height: 8, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden', marginTop: 8 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#4caf50', transition: 'width 600ms ease' }} />
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>{completed} of {total} completed</div>
              </>
            )
          })()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 18 }}>
        <div style={{ padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 8px 28px rgba(20,20,20,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Controls (DAT)</h3>
            <div style={{ fontSize: 13, color: '#666' }}>Distribution by DAT status</div>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 12, alignItems: 'center' }}>
            <PieChart data={datSlices} size={160} />
            <div>
              {datSlices.map((s) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 4 }} />
                  <div style={{ fontSize: 14 }}>{s.label}</div>
                  <div style={{ marginLeft: 'auto', fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ padding: 12, borderRadius: 12, background: '#fff', boxShadow: '0 8px 18px rgba(20,20,20,0.04)' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Upcoming due controls</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockControls
                .filter((c) => c.dueDate)
                .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
                .slice(0, 6)
                .map((c) => (
                  <div key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f3f6fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{(c.owner || '—').split(' ').map((p:any)=>p[0]).slice(0,2).join('')}</div>
                      <div style={{ fontSize: 13 }}><Link to={`/controls/${c.id}`}>{c.name}</Link></div>
                    </div>
                    <div style={{ fontSize: 13, color: '#444' }}>{formatBadgeDate(c.dueDate)}</div>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 12, background: '#fff', boxShadow: '0 8px 18px rgba(20,20,20,0.04)' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Top owners</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(() => {
                const ownerCounts = mockControls.reduce<Record<string, number>>((acc, c) => {
                  const k = (c.owner || 'Unassigned') as string
                  acc[k] = (acc[k] ?? 0) + 1
                  return acc
                }, {})
                return Object.entries(ownerCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: '#1a88ff' }} />
                      <div style={{ flex: 1 }}>{k}</div>
                      <div style={{ fontWeight: 700 }}>{v}</div>
                    </div>
                  ))
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
