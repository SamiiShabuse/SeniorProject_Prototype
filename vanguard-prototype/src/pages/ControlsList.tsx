import { Link } from 'react-router-dom'

export default function ControlsList() {
  return (
    <div>
      <h2>Controls List</h2>
      <p>List of controls. Click a control to view details or create a new control.</p>
      <ul>
        <li><Link to="/controls/1">Control #1 (example)</Link></li>
        <li><Link to="/controls/2">Control #2 (example)</Link></li>
      </ul>
      <p><Link to="/controls/create">Create new control</Link></p>
    </div>
  )
}
