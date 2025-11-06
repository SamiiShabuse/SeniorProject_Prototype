import { Link, useParams } from 'react-router-dom'

export default function UpdateIndividualRequest() {
  const { id } = useParams()
  return (
    <div>
      <h2>Update Individual Request</h2>
      <p>Update form for request {id} (placeholder).</p>
      <p><Link to="/requests">Back to Requests</Link></p>
    </div>
  )
}
