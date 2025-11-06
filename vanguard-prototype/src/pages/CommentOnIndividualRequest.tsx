import { Link, useParams } from 'react-router-dom'

export default function CommentOnIndividualRequest() {
  const { id } = useParams()
  return (
    <div>
      <h2>Comment on Individual Request</h2>
      <p>Comments for request {id} (placeholder).</p>
      <p><Link to="/requests">Back to Requests</Link></p>
    </div>
  )
}
