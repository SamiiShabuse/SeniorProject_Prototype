import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <h1>Vanguard Prototype — Flow</h1>
          <nav className="app-nav">
            <Link to="/">Summary</Link>
            <Link to="/controls">Controls List</Link>
            <Link to="/active-testing">Active Controls</Link>
            <Link to="/requests">Requests</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Summary />} />
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

            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
