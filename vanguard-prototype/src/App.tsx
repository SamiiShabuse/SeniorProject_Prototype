import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Summary from './pages/Summary'
import Login from './pages/Login'
import Board from './pages/Board'
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

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const [layout, setLayout] = useState<'top' | 'left'>(() => {
    try { return (localStorage.getItem('vg_layout') as 'top' | 'left') || 'top' } catch { return 'top' }
  })

  function toggleLayout() {
    const next = layout === 'top' ? 'left' : 'top'
    setLayout(next)
    try { localStorage.setItem('vg_layout', next) } catch {}
  }

  return (
    <div className={`app-shell ${layout === 'left' ? 'with-left-sidebar' : ''}`}>
      <header className="app-header">
        <h1>Vanguard Control System (Prototype)</h1>
        <nav className="app-nav">
          <Link to="/home">Summary</Link>
          <Link to="/controls">Controls List</Link>
          <Link to="/active-testing">Active Controls</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/board">Board</Link>
          <Link to="/mock">Mock Data</Link>
          <button style={{ marginLeft: 12 }} onClick={onLogout}>Logout</button>
          {/* layout toggle */}
          <button style={{ marginLeft: 8 }} onClick={toggleLayout} aria-pressed={layout === 'left'}>
            {layout === 'left' ? 'Use Top Bar' : 'Use Left Sidebar'}
          </button>
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

          <Route path="/board" element={<Board />} />
          <Route path="/mock" element={<MockDisplay />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  const [logged, setLogged] = useState<boolean>(() => typeof window !== 'undefined' && localStorage.getItem('vg_logged_in') === 'true')

  function logout() {
    localStorage.removeItem('vg_logged_in')
    setLogged(false)
    // reload to get the router back to login page
    window.location.href = '/'
  }

  return (
    <BrowserRouter>
      {logged ? (
        <AuthenticatedApp onLogout={logout} />
      ) : (
        <Routes>
          <Route path="/" element={<Login onLogin={() => setLogged(true)} />} />
          <Route path="*" element={<Login onLogin={() => setLogged(true)} />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
