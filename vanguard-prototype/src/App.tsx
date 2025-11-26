import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

import Summary from './pages/Summary'
// ControlsList replaced by ActiveControlsTestingList (converted to be the main Controls list)
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
  const holdTarget = useRef<'button' | 'title' | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const HOLD_MS = 3000
  const [hotspotHover, setHotspotHover] = useState(false)

  function startHold(onComplete: () => void, target: 'button' | 'title' = 'button') {
    longPressTriggered.current = false
    holdTarget.current = target
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
        holdTarget.current = null
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
    holdTarget.current = null
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

            {/* title no longer shows a separate progress ring; fill animation is applied to the button/hotspot */}
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {devButtonHidden ? (
              // invisible hotspot where the button used to be — allows holding same spot to reveal
              <button
                aria-label="Reveal Dev Button"
                onPointerDown={(e) => { try { (e.target as HTMLElement).setPointerCapture?.(e.pointerId) } catch {} startHold(() => setDevButtonHidden(false), 'button') }}
                onPointerUp={(e) => { try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId) } catch {} clearHold() }}
                onPointerCancel={(e) => { try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId) } catch {} clearHold() }}
                onClick={() => { /* prevent accidental clicks while hidden */ }}
                onMouseEnter={() => setHotspotHover(true)}
                onMouseLeave={() => { setHotspotHover(false) }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: hotspotHover ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
                  background: hotspotHover ? 'rgba(0,0,0,0.04)' : 'transparent',
                  cursor: 'pointer',
                  opacity: 1,
                  // match the visible Dev button size/appearance when hidden
                  display: 'inline-block',
                  minWidth: 80,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                title="Hold 3s to reveal Dev button"
                >
                  {/* fill overlay for hidden hotspot (lighter -> darker gray as holdProgress increases) */}
                  {holdTarget.current === 'button' && holdProgress > 0 && (
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.round(holdProgress * 100)}%`, background: `rgba(0,0,0,${0.04 + holdProgress * 0.16})`, pointerEvents: 'none', transition: 'width 0s' }} />
                  )}
                </button>
            ) : (
              <button
                onPointerDown={(e) => { try { (e.target as HTMLElement).setPointerCapture?.(e.pointerId) } catch {} startHold(() => setDevButtonHidden((v) => !v), 'button') }}
                onPointerUp={(e) => { try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId) } catch {} clearHold() }}
                onPointerCancel={(e) => { try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId) } catch {} clearHold() }}
                onClick={() => { if (longPressTriggered.current) { longPressTriggered.current = false; return } setDevMode((s) => !s) }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: devMode ? '#f0f8ff' : '#fff',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                title="Toggle Dev Mode (short click) — Hold 3s to hide button"
              >
                {/* fill overlay for visible button (fixed shade) */}
                {holdTarget.current === 'button' && holdProgress > 0 && (
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.round(holdProgress * 100)}%`, background: 'rgba(0,0,0,0.08)', pointerEvents: 'none', transition: 'width 0s' }} />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{devMode ? 'Dev: On' : 'Dev: Off'}</span>
              </button>
            )}
            {/* fill overlay replaces the separate progress ring */}
          </div>
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
          <Link to="/controls">Controls</Link>
          <Link to="/requests">Tests</Link>
          {devMode && <Link to="/mock">Mock Data</Link>}
          {/* top navigation only; left-sidebar and bottom/nav-position controls removed per stakeholder request */}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/home" element={<Summary />} />
          <Route path="/controls" element={<ActiveControlsTestingList />} />
          <Route path="/controls/create" element={<CreateState />} />
          <Route path="/controls/:id" element={<IndividualControl />} />
          <Route path="/controls/:id/update" element={<UpdateControlDetail />} />
          <Route path="/controls/:id/retire" element={<RetireIndividualControl />} />

          {/* /active-testing route removed; Active Controls now served at /controls */}
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
