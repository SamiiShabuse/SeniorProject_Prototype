import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { mockControls } from '../mocks/mockData'
import type { Control } from '../lib/types'

export default function ActiveControlsTestingList() {
  const [showMock, setShowMock] = useState(true)
  const [selectedTester, setSelectedTester] = useState<'All' | 'Unassigned' | string>('All')

  // collect unique testers from mock controls
  const testers = useMemo(() => {
    const t = Array.from(new Set(mockControls.map((c) => c.tester).filter(Boolean) as string[]))
    t.sort()
    return t
  }, [])

  // define what "currently working on" means: any non 'Not Started' DAT or OET
  const isActive = (c: Control) => {
    const dat = c.dat?.status ?? 'Not Started'
    const oet = c.oet?.status ?? 'Not Started'
    return dat !== 'Not Started' || oet !== 'Not Started'
  }

  const filtered = useMemo(() => {
    return mockControls.filter((c) => {
      if (!isActive(c)) return false
      if (selectedTester === 'All') return true
      if (selectedTester === 'Unassigned') return !c.tester
      return c.tester === selectedTester
    })
  }, [selectedTester])

  return (
    <div>
      <h2>Active Controls Testing List</h2>
      <p>List of active controls under testing.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Hide mock testing controls' : 'Show mock testing controls'}
        </a>
      </p>

      {showMock ? (
        <div>
          <div style={{ marginBottom: 12 }}>
            <strong>Filter by tester:</strong>
              <div style={{ marginTop: 8 }}>
                <label htmlFor="tester-select" style={{ display: 'block', marginBottom: 6 }}>Choose tester</label>
                <select
                  id="tester-select"
                  value={selectedTester}
                  onChange={(e) => setSelectedTester(e.target.value)}
                  style={{ padding: '6px 8px', minWidth: 240 }}
                >
                  <option value="All">All</option>
                  <option value="Unassigned">Unassigned</option>
                  {testers.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
          </div>

          <ul>
            {filtered.length === 0 && <li>No controls match the selected tester / active status</li>}
            {filtered.map((c) => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                <Link to={`/controls/${c.id}`}>{c.id} — {c.name}</Link>
                <div style={{ fontSize: 13, color: '#444' }}>Owner: {c.owner} • Tester: {c.tester ?? '—'}</div>
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
