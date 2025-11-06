import { Link } from 'react-router-dom'

export default function CreateState() {
  return (
    <div>
      <h2>Create Control</h2>
      <p>Form placeholder to create a new control.</p>
      <p><Link to="/controls">Back to Controls List</Link></p>
    </div>
  )
}
