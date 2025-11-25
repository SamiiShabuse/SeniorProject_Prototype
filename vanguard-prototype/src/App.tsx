import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
          <h1 style={{ margin: 0 }}>Vanguard Control System (Prototype)</h1>
          <button
            onClick={() => setDevMode((s) => !s)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid rgba(0,0,0,0.12)',
              background: devMode ? '#f0f8ff' : '#fff',
              cursor: 'pointer',
            }}
            title="Toggle Dev Mode"
          >
            {devMode ? 'Dev: On' : 'Dev: Off'}
          </button>
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
