import { Link } from 'react-router-dom'

export default function CreateRequest() {
  return (
    <div>
      <h2>Create Request</h2>
      <p>Form placeholder to create a request.</p>
      <p><Link to="/requests">Back to Requests</Link></p>
    </div>
  )
}
