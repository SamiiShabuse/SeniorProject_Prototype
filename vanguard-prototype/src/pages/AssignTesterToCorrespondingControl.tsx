import { Link, useParams } from 'react-router-dom'

export default function AssignTesterToCorrespondingControl() {
  const { id } = useParams()
  return (
    <div>
      <h2>Assign Tester to Corresponding Control</h2>
      <p>Assign a tester for corresponding control {id} (placeholder).</p>
      <p><Link to="/active-testing">Back to Active Controls</Link></p>
    </div>
  )
}
