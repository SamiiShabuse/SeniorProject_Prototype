import { Link, useParams } from 'react-router-dom'

export default function RetireIndividualControl() {
  const { id } = useParams()
  return (
    <div>
      <h2>Retire Individual Control</h2>
      <p>Confirm retire of control {id} (placeholder).</p>
      <p>
        <Link to="/controls">Back to Controls List</Link>
      </p>
    </div>
  )
}
