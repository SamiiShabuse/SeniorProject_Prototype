import { Link, useParams } from 'react-router-dom'

export default function UpdateControlDetail() {
  const { id } = useParams()
  return (
    <div>
      <h2>Update Control Detail</h2>
      <p>Update form for control {id} (placeholder).</p>
      <p>
        <Link to={`/controls/${id}`}>Back to Control</Link>
      </p>
    </div>
  )
}
