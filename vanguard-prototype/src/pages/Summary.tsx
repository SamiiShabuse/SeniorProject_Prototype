import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mockControls } from '../mocks/mockData'
import { mockRequests } from '../mocks/mockData'
import { exportDashboardSummary } from '../utils/exportData'

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

function DonutChart({ data, size = 180 }: { data: Slice[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let angle = -Math.PI / 2
  const center = size / 2
  const outerRadius = size / 2 - 8
  const innerRadius = size / 3

  function arcPath(startAngle: number, endAngle: number, isOuter: boolean) {
    const r = isOuter ? outerRadius : innerRadius
    const x1 = center + r * Math.cos(startAngle)
    const y1 = center + r * Math.sin(startAngle)
    const x2 = center + r * Math.cos(endAngle)
    const y2 = center + r * Math.sin(endAngle)
    const large = endAngle - startAngle > Math.PI ? 1 : 0
    if (isOuter) {
      return `M ${center + innerRadius * Math.cos(startAngle)} ${center + innerRadius * Math.sin(startAngle)} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${large} 1 ${x2} ${y2} L ${center + innerRadius * Math.cos(endAngle)} ${center + innerRadius * Math.sin(endAngle)} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${center + innerRadius * Math.cos(startAngle)} ${center + innerRadius * Math.sin(startAngle)} Z`
    }
    return ''
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {data.map((d, i) => {
        const frac = total === 0 ? 0 : d.value / total
        const nextAngle = angle + frac * Math.PI * 2
        const path = arcPath(angle, nextAngle, true)
        angle = nextAngle
        return <path key={i} d={path} fill={d.color} stroke="#fff" strokeWidth={1} />
      })}
    </svg>
  )
}

function HorizontalBarChart({ data, height = 40 }: { data: { label: string; segments: Slice[] }[]; height?: number }) {
  const maxValue = Math.max(...data.flatMap(d => d.segments.reduce((sum, s) => sum + s.value, 0)))
  const barHeight = height / data.length

  return (
    <svg width="100%" height={height} viewBox={`0 0 400 ${height}`} preserveAspectRatio="none" aria-hidden>
      {data.map((row, rowIdx) => {
        let x = 0
        const y = rowIdx * barHeight
        return (
          <g key={rowIdx}>
            {row.segments.map((seg, segIdx) => {
              const width = (seg.value / maxValue) * 400
              const rect = <rect key={segIdx} x={x} y={y} width={width} height={barHeight - 2} fill={seg.color} />
              x += width
              return rect
            })}
          </g>
        )
      })}
    </svg>
  )
}

function GanttChart({ controls, months }: { controls: Array<{ id: string; name: string; startDate?: string; dueDate?: string }>; months: string[] }) {
  const rowHeight = 24
  const monthWidth = 80
  const chartHeight = controls.length * rowHeight + 30

  function getDatePosition(dateStr: string | undefined, isStart: boolean) {
    if (!dateStr) return 0
    const date = new Date(dateStr)
    const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
    const monthIdx = months.indexOf(month)
    if (monthIdx === -1) return 0
    const dayInMonth = date.getDate()
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const offset = (dayInMonth / daysInMonth) * monthWidth
    return monthIdx * monthWidth + (isStart ? offset : 0)
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={Math.max(400, months.length * monthWidth)} height={chartHeight} viewBox={`0 0 ${Math.max(400, months.length * monthWidth)} ${chartHeight}`} aria-hidden>
        {/* Month labels */}
        <g>
          {months.map((month, i) => (
            <text key={month} x={i * monthWidth + monthWidth / 2} y={16} textAnchor="middle" style={{ fontSize: 11, fill: '#666' }}>
              {month}
            </text>
          ))}
        </g>
        {/* Timeline bars */}
        <g transform="translate(0, 30)">
          {controls.slice(0, 6).map((control, i) => {
            const startX = getDatePosition(control.startDate, true)
            const endX = getDatePosition(control.dueDate, false)
            const width = Math.max(20, endX - startX || monthWidth)
            const y = i * rowHeight
            const opacity = control.startDate && control.dueDate ? 0.7 : 0.2
            const color = i % 3 === 0 ? '#1a88ff' : i % 3 === 1 ? '#4caf50' : '#9aa4b2'
            return (
              <rect
                key={control.id}
                x={startX}
                y={y + 2}
                width={width}
                height={rowHeight - 4}
                fill={color}
                opacity={opacity}
                rx={2}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default function Summary() {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Play animation whenever the route navigates to this page
  const location = useLocation()
  const [playAnim, setPlayAnim] = useState<boolean>(false)

  useEffect(() => {
    if (location.pathname === '/home') {
      setPlayAnim(true)
      const t = setTimeout(() => setPlayAnim(false), 1200)
      return () => clearTimeout(t)
    }
    return
  }, [location.key, location.pathname])

  // simple count-up hook using requestAnimationFrame
  function useCountUp(target: number, duration = 800, enabled = true) {
    const [val, setVal] = useState<number>(enabled ? 0 : target)
    useEffect(() => {
      if (!enabled) {
        setVal(target)
        return
      }
      let start: number | null = null
      let raf = 0
      const step = (ts: number) => {
        if (start === null) start = ts
        const progress = Math.min(1, (ts - start) / duration)
        setVal(Math.round(progress * target))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
      return () => { cancelAnimationFrame(raf) }
    }, [target, duration, enabled])
    return val
  }
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

  // Compute ratings distribution (based on status)
  const ratingsLabels = ['IN PROGRESS', 'SATISFACTORY', 'NEEDS IMPROVEMENT', 'COMPLETE']
  const ratingsCounts: Record<string, number> = {
    'IN PROGRESS': datCounts['In Progress'] ?? 0,
    'SATISFACTORY': datCounts['Testing Completed'] ?? 0,
    'NEEDS IMPROVEMENT': datCounts['Addressing Comments'] ?? 0,
    'COMPLETE': datCounts['Completed'] ?? 0,
  }
  const ratingsColors: Record<string, string> = {
    'IN PROGRESS': '#1a88ff',
    'SATISFACTORY': '#4caf50',
    'NEEDS IMPROVEMENT': '#f6a623',
    'COMPLETE': '#4caf50',
  }
  const ratingsSlices: Slice[] = ratingsLabels.map((label) => ({ label, value: ratingsCounts[label] ?? 0, color: ratingsColors[label] ?? '#ccc' }))

  // Compute testing status (Under Review vs Reviewed)
  const underReview = mockControls.filter((c) => {
    const status = String(c.dat?.status ?? '').toLowerCase()
    return status.includes('review') || status.includes('address') || status === 'in progress'
  }).length
  const reviewed = mockControls.filter((c) => {
    const status = String(c.dat?.status ?? '').toLowerCase()
    return status.includes('complete') || status.includes('testing completed')
  }).length
  const notStarted = mockControls.length - underReview - reviewed

  // Testing status bar chart data
  const testingStatusData = [
    {
      label: 'Q1 2025',
      segments: [
        { label: 'Under Review', value: underReview, color: '#ff7043' },
        { label: 'Reviewed', value: reviewed, color: '#f6a623' },
        { label: 'Not Started', value: notStarted, color: '#9aa4b2' },
      ],
    },
    {
      label: 'Q2 2025',
      segments: [
        { label: 'Under Review', value: Math.floor(underReview * 0.7), color: '#ff7043' },
        { label: 'Reviewed', value: Math.floor(reviewed * 1.2), color: '#f6a623' },
        { label: 'Not Started', value: Math.floor(notStarted * 0.5), color: '#9aa4b2' },
      ],
    },
  ]

  // Control effectiveness (donut chart)
  const effectivenessLabels = ['Effective', 'Needs Improvement', 'Under Review', 'Not Assessed']
  const effectivenessCounts: Record<string, number> = {
    Effective: datCounts['Completed'] ?? 0,
    'Needs Improvement': datCounts['Addressing Comments'] ?? 0,
    'Under Review': datCounts['In Progress'] ?? 0,
    'Not Assessed': datCounts['Not Started'] ?? 0,
  }
  const effectivenessColors: Record<string, string> = {
    Effective: '#1a88ff',
    'Needs Improvement': '#f6a623',
    'Under Review': '#ff7043',
    'Not Assessed': '#9aa4b2',
  }
  const effectivenessSlices: Slice[] = effectivenessLabels.map((label) => ({
    label,
    value: effectivenessCounts[label] ?? 0,
    color: effectivenessColors[label] ?? '#ccc',
  }))

  // Schedule/Gantt chart data - get months from actual control dates
  const allDates = mockControls
    .filter((c) => c.startDate || c.dueDate)
    .flatMap((c) => [c.startDate, c.dueDate])
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d.getTime()))

  const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : new Date()
  const maxDate = allDates.length > 0 ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : new Date()
  
  // Generate months array covering the date range
  const months: string[] = []
  const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1)
  
  for (let d = new Date(startMonth); d < endMonth; d.setMonth(d.getMonth() + 1)) {
    months.push(d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase())
  }
  
  // Ensure we have at least 5 months for display
  if (months.length < 5) {
    const currentDate = new Date()
    months.length = 0
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      months.push(date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase())
    }
  }

  // Get controls with dates for Gantt chart
  const controlsWithDates = mockControls
    .filter((c) => c.startDate || c.dueDate)
    .sort((a, b) => {
      const aDate = a.startDate || a.dueDate || ''
      const bDate = b.startDate || b.dueDate || ''
      return aDate.localeCompare(bDate)
    })
    .slice(0, 6)

  function formatBadgeDate(d?: string) {
    if (!d) return '—'
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return String(d)
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const totalControls = mockControls.length
  const activeControls = mockControls.filter(
    (c) =>
      (c.dat?.status ?? '').toLowerCase() !== 'completed' &&
      !(String(c.dat?.status ?? '').trim() === '' && /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? '')))
  ).length
  const openRequests = mockRequests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length
  const completed = mockControls.filter(
    (c) => String(c.dat?.status ?? '').toLowerCase() === 'completed' || /completed/i.test(String(c.testingNotes ?? '') + String(c.description ?? ''))
  ).length
  const completionPct = totalControls === 0 ? 0 : Math.round((completed / totalControls) * 100)

  // Animated values (play only if playAnim is true)
  const animatedTotal = useCountUp(totalControls, 900, playAnim)
  const animatedActive = useCountUp(activeControls, 900, playAnim)
  const animatedOpen = useCountUp(openRequests, 900, playAnim)
  const animatedCompletion = useCountUp(completionPct, 900, playAnim)

  // For charts, produce animated slices
  // (For performance and to avoid hook-in-loop issues, only animate the top summary numbers and completion percent.)

  // stop playing anim after some time so subsequent re-renders behave normally
  useEffect(() => {
    if (!playAnim) return
    const t = setTimeout(() => setPlayAnim(false), 1200)
    return () => clearTimeout(t)
  }, [playAnim])

  return (
    <div className="panel" style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Overview Dashboard</h2>
          <p className="muted" style={{ marginTop: 6 }}>Live dashboard of controls and requests — actionable insights at a glance.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Export
              <span style={{ fontSize: 12 }}>▾</span>
            </button>
            {showExportMenu && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 4,
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: 160,
                    padding: 4,
                  }}
                >
                  <button
                    onClick={() => {
                      exportDashboardSummary(mockControls, mockRequests, 'csv')
                      setShowExportMenu(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderRadius: 4,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f5f5f5'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      exportDashboardSummary(mockControls, mockRequests, 'json')
                      setShowExportMenu(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderRadius: 4,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f5f5f5'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => {
                      exportDashboardSummary(mockControls, mockRequests, 'excel')
                      setShowExportMenu(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderRadius: 4,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f5f5f5'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Export as Excel
                  </button>
                </div>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                  }}
                  onClick={() => setShowExportMenu(false)}
                />
              </>
            )}
          </div>
          <button
            onClick={() => {
              setIsRefreshing(true)
              // Reload the page to get fresh data
              window.location.reload()
            }}
            disabled={isRefreshing}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: isRefreshing ? '#ccc' : '#1a88ff',
              color: '#fff',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isRefreshing ? (
              <>
                <span style={{ fontSize: 12 }}>⟳</span>
                Refreshing...
              </>
            ) : (
              <>
                <span style={{ fontSize: 12 }}>⟳</span>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 20, borderRadius: 12, background: 'linear-gradient(180deg,#fff,#fbfcff)', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Total</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#172b4d' }}>{animatedTotal}</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>All controls imported</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Active</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#172b4d' }}>{animatedActive}</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>Based on DAT status</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Open Requests</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#172b4d' }}>{animatedOpen}</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>Requests needing attention</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Completion</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#172b4d' }}>{animatedCompletion}%</div>
          <div style={{ height: 8, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ width: `${animatedCompletion}%`, height: '100%', background: '#4caf50', transition: 'width 600ms ease' }} />
          </div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>{completed} of {totalControls} completed</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Ratings Pie Chart */}
        <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 8px 28px rgba(20,20,20,0.04)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Ratings</h3>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <PieChart data={ratingsSlices.filter((s) => s.value > 0)} size={180} />
            <div style={{ flex: 1 }}>
              {ratingsSlices
                .filter((s) => s.value > 0)
                .map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 2 }} />
                    <div style={{ fontSize: 13, flex: 1 }}>{s.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.value}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Control Effectiveness Donut Chart */}
        <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 8px 28px rgba(20,20,20,0.04)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Control Effectiveness</h3>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <DonutChart data={effectivenessSlices.filter((s) => s.value > 0)} size={180} />
            <div style={{ flex: 1 }}>
              {effectivenessSlices
                .filter((s) => s.value > 0)
                .map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 2 }} />
                    <div style={{ fontSize: 13, flex: 1 }}>{s.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.value}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testing Status Bar Charts */}
      <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 8px 28px rgba(20,20,20,0.04)', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Testing Status</h3>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff7043' }} />
            <span style={{ fontSize: 13 }}>UNDER REVIEW</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f6a623' }} />
            <span style={{ fontSize: 13 }}>REVIEWED</span>
          </div>
        </div>
        <div style={{ height: 80 }}>
          <HorizontalBarChart data={testingStatusData} height={80} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#666' }}>
          <span>{testingStatusData[0].label}</span>
          <span>{testingStatusData[1].label}</span>
        </div>
      </div>

      {/* Schedule Gantt Chart */}
      <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 8px 28px rgba(20,20,20,0.04)', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Schedule</h3>
        <GanttChart controls={controlsWithDates} months={months} />
      </div>

      {/* Bottom Section: Controls Distribution and Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#fff', boxShadow: '0 8px 28px rgba(20,20,20,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>Controls (DAT)</h3>
            <div style={{ fontSize: 13, color: '#666' }}>Distribution by DAT status</div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <PieChart data={datSlices.filter((s) => s.value > 0)} size={160} />
            <div style={{ flex: 1 }}>
              {datSlices
                .filter((s) => s.value > 0)
                .map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 4 }} />
                    <div style={{ fontSize: 14, flex: 1 }}>{s.label}</div>
                    <div style={{ marginLeft: 'auto', fontWeight: 700 }}>{s.value}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 8px 18px rgba(20,20,20,0.04)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Upcoming due controls</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockControls
                .filter((c) => c.dueDate)
                .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
                .slice(0, 6)
                .map((c) => (
                  <div key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: '#f3f6fb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {(c.owner || '—')
                          .split(' ')
                          .map((p: any) => p[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div style={{ fontSize: 13 }}>
                        <Link to={`/controls/${c.id}`}>{c.name.length > 40 ? c.name.substring(0, 40) + '...' : c.name}</Link>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#444' }}>{formatBadgeDate(c.dueDate)}</div>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, background: '#fff', boxShadow: '0 8px 18px rgba(20,20,20,0.04)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Top owners</h4>
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
                      <div style={{ flex: 1, fontSize: 13 }}>{k}</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{v}</div>
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
