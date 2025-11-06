import { Link, useParams } from 'react-router-dom'

export default function UpdateIndividualControlTestingDetails() {
  const { id } = useParams()
  return (
    <div>
      <h2>Update Individual Control Testing Details</h2>
      <p>Update testing details for corresponding control {id} (placeholder).</p>
      <p><Link to="/active-testing">Back to Active Controls</Link></p>
    </div>
  )
}
