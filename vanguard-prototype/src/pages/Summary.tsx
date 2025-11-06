import { Link } from 'react-router-dom'

export default function Summary() {
  return (
    <div className="panel">
      <h2>Summary</h2>
      <p className="muted">Entry landing page. From here you can navigate to Controls, Active Testing, and Requests.</p>
      <div style={{display:'flex', gap:16, marginTop:12}}>
        <Link to="/controls" className="panel">Controls</Link>
        <Link to="/active-testing" className="panel">Active Controls</Link>
        <Link to="/requests" className="panel">Requests</Link>
      </div>
    </div>
  )
}
