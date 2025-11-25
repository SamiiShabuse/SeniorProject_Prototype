import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

import Summary from './pages/Summary'
import ControlsList from './pages/ControlsList'
import IndividualControl from './pages/IndividualControl'
import CreateState from './pages/CreateState'
import UpdateControlDetail from './pages/UpdateControlDetail'
import RetireIndividualControl from './pages/RetireIndividualControl'
import ActiveControlsTestingList from './pages/ActiveControlsTestingList'
import IndividualRequest from './pages/IndividualRequest'
import CreateRequest from './pages/CreateRequest'
import RetireIndividualRequest from './pages/RetireIndividualRequest'
import UpdateIndividualRequest from './pages/UpdateIndividualRequest'
import CommentOnIndividualRequest from './pages/CommentOnIndividualRequest'
import IndividualCorrespondingControl from './pages/IndividualCorrespondingControl'
import UpdateIndividualControlTestingDetails from './pages/UpdateIndividualControlTestingDetails'
import AssignTesterToCorrespondingControl from './pages/AssignTesterToCorrespondingControl'
import MockDisplay from './pages/MockDisplay'
import DevContext from './contexts/DevContext'

function AuthenticatedApp() {
  const [devMode, setDevMode] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('devMode')
      return v === null ? true : v === 'true'
    } catch (e) {
      return true
    }
  })

  // Always show the Dev button on initial app open. Hiding only applies after user action
  // during the session (we still persist the choice but we won't read it as the initial default).
  const [devButtonHidden, setDevButtonHidden] = useState<boolean>(false)

  useEffect(() => {
    try { localStorage.setItem('devButtonHidden', devButtonHidden ? 'true' : 'false') } catch {}
  }, [devButtonHidden])

  // long-press handling for hiding/showing the dev button with visual progress
  const holdRAF = useRef<number | null>(null)
  const longPressTriggered = useRef(false)
  const holdStart = useRef<number | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const HOLD_MS = 3000

  function startHold(onComplete: () => void) {
    longPressTriggered.current = false
    holdStart.current = performance.now()
    setHoldProgress(0)

    const step = (now: number) => {
      if (!holdStart.current) return
      const elapsed = now - holdStart.current
      const p = Math.min(1, elapsed / HOLD_MS)
      setHoldProgress(p)
      if (p >= 1) {
        longPressTriggered.current = true
        onComplete()
        holdStart.current = null
        setHoldProgress(0)
        holdRAF.current = null
        return
      }
      holdRAF.current = requestAnimationFrame(step)
    }

    holdRAF.current = requestAnimationFrame(step)
  }

  function clearHold() {
    if (holdRAF.current) {
      cancelAnimationFrame(holdRAF.current)
      holdRAF.current = null
    }
    holdStart.current = null
    setHoldProgress(0)
  }

  useEffect(() => {
    try { localStorage.setItem('devMode', devMode ? 'true' : 'false') } catch {}
  }, [devMode])

  type DevSettings = { compact: boolean; grid: boolean; contrast: boolean }
  const [devSettings, setDevSettings] = useState<DevSettings>(() => {
    try {
      const raw = localStorage.getItem('devSettings')
      return raw ? JSON.parse(raw) : { compact: false, grid: false, contrast: false }
    } catch (e) { return { compact: false, grid: false, contrast: false } }
  })

  useEffect(() => {
    try { localStorage.setItem('devSettings', JSON.stringify(devSettings)) } catch {}
  }, [devSettings])

  const rootClass = `app-shell with-topbar${devSettings.compact ? ' dev-compact' : ''}${devSettings.grid ? ' dev-grid' : ''}${devSettings.contrast ? ' dev-contrast' : ''}`

  return (
    <DevContext.Provider value={{ devMode, setDevMode, devSettings, setDevSettings }}>
      <div className={rootClass}>
  <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1
              style={{ margin: 0, userSelect: 'none' }}
              onMouseDown={() => { if (devButtonHidden) startHold(() => setDevButtonHidden(false)) }}
              onMouseUp={() => { if (devButtonHidden) clearHold() }}
              onMouseLeave={() => { if (devButtonHidden) clearHold() }}
              onTouchStart={() => { if (devButtonHidden) startHold(() => setDevButtonHidden(false)) }}
              onTouchEnd={() => { if (devButtonHidden) clearHold() }}
              title={devButtonHidden ? 'Hold 3s to show Dev button' : undefined}
            >Vanguard Control System (Prototype)</h1>

            {/* show progress ring next to title when holding to reveal the hidden dev button */}
            {devButtonHidden && holdProgress > 0 && (
              <svg width={22} height={22} viewBox="0 0 36 36" style={{ marginLeft: -6 }}>
                <defs>
                  <linearGradient id="g2" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#1a88ff" />
                    <stop offset="100%" stopColor="#5fb0ff" />
                  </linearGradient>
                </defs>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="url(#g2)" strokeWidth="4"
                  strokeDasharray={Math.PI * 2 * 16}
                  strokeDashoffset={((1 - holdProgress) * Math.PI * 2 * 16).toString()}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            )}
          </div>
          {!devButtonHidden && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onMouseDown={() => startHold(() => setDevButtonHidden((v) => !v))}
                onMouseUp={() => clearHold()}
                onMouseLeave={() => clearHold()}
                onTouchStart={() => startHold(() => setDevButtonHidden((v) => !v))}
                onTouchEnd={() => clearHold()}
                onClick={() => { if (longPressTriggered.current) { longPressTriggered.current = false; return } setDevMode((s) => !s) }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: devMode ? '#f0f8ff' : '#fff',
                  cursor: 'pointer',
                }}
                title="Toggle Dev Mode (short click) — Hold 3s to hide button"
              >
                {devMode ? 'Dev: On' : 'Dev: Off'}
              </button>

              {/* progress ring */}
              {holdProgress > 0 && (
                <svg width={22} height={22} viewBox="0 0 36 36" style={{ position: 'absolute', right: -12, top: -6 }}>
                  <defs>
                    <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#1a88ff" />
                      <stop offset="100%" stopColor="#5fb0ff" />
                    </linearGradient>
                  </defs>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="4" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="url(#g1)" strokeWidth="4"
                    strokeDasharray={Math.PI * 2 * 16}
                    strokeDashoffset={((1 - holdProgress) * Math.PI * 2 * 16).toString()}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
              )}
            </div>
          )}
          {devMode && (
            <div style={{ marginLeft: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="checkbox" checked={devSettings.compact} onChange={(e) => setDevSettings((s: DevSettings) => ({ ...s, compact: e.target.checked }))} /> Compact
              </label>
              <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="checkbox" checked={devSettings.grid} onChange={(e) => setDevSettings((s: DevSettings) => ({ ...s, grid: e.target.checked }))} /> Grid
              </label>
              <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="checkbox" checked={devSettings.contrast} onChange={(e) => setDevSettings((s: DevSettings) => ({ ...s, contrast: e.target.checked }))} /> High contrast
              </label>
            </div>
          )}
        </div>
        <nav className="app-nav">
          <Link to="/home">Summary</Link>
          <Link to="/controls">Controls List</Link>
          <Link to="/active-testing">Active Controls</Link>
          <Link to="/requests">Requests</Link>
          {devMode && <Link to="/mock">Mock Data</Link>}
          {/* top navigation only; left-sidebar and bottom/nav-position controls removed per stakeholder request */}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/home" element={<Summary />} />
          <Route path="/controls" element={<ControlsList />} />
          <Route path="/controls/create" element={<CreateState />} />
          <Route path="/controls/:id" element={<IndividualControl />} />
          <Route path="/controls/:id/update" element={<UpdateControlDetail />} />
          <Route path="/controls/:id/retire" element={<RetireIndividualControl />} />

          <Route path="/active-testing" element={<ActiveControlsTestingList />} />
          <Route path="/corresponding/:id" element={<IndividualCorrespondingControl />} />
          <Route path="/corresponding/:id/update" element={<UpdateIndividualControlTestingDetails />} />
          <Route path="/corresponding/:id/assign" element={<AssignTesterToCorrespondingControl />} />

          <Route path="/requests" element={<IndividualRequest />} />
          <Route path="/requests/create" element={<CreateRequest />} />
          <Route path="/requests/:id/retire" element={<RetireIndividualRequest />} />
          <Route path="/requests/:id/update" element={<UpdateIndividualRequest />} />
          <Route path="/requests/:id/comment" element={<CommentOnIndividualRequest />} />

              {devMode && <Route path="/mock" element={<MockDisplay />} />}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </div>
    </DevContext.Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthenticatedApp />
    </BrowserRouter>
  )
}

export default App
