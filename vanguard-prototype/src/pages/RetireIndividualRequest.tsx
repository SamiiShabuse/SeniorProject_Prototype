import { Link, useParams } from 'react-router-dom'

export default function RetireIndividualRequest() {
  const { id } = useParams()
  return (
    <div>
      <h2>Retire Individual Request</h2>
      <p>Confirm retire for request {id} (placeholder).</p>
      <p><Link to="/requests">Back to Requests</Link></p>
    </div>
  )
}
