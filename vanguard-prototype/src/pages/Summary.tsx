import { Link } from 'react-router-dom'

export default function Summary() {
  return (
    <div>
      <h2>Summary</h2>
      <p>Entry landing page. From here you can navigate to Controls, Active Testing, and Requests.</p>
      <ul>
        <li><Link to="/controls">Go to Controls List</Link></li>
        <li><Link to="/active-testing">Go to Active Controls Testing List</Link></li>
        <li><Link to="/requests">Go to Requests</Link></li>
      </ul>
    </div>
  )
}
