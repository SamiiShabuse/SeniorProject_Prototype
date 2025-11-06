import { Link } from 'react-router-dom'

export default function IndividualRequest() {
  return (
    <div>
      <h2>Individual Request</h2>
      <p>Requests list / single request entry point.</p>
      <p><Link to="/requests/create">Create Request</Link></p>
      <p><Link to="/requests/1/update">Example Request #1</Link></p>
    </div>
  )
}
