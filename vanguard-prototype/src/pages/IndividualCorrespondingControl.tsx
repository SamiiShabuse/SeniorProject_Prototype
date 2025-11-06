import { Link, useParams } from 'react-router-dom'

export default function IndividualCorrespondingControl() {
  const { id } = useParams()
  return (
    <div>
      <h2>Individual Corresponding Control</h2>
      <p>Corresponding control id: {id}</p>
      <p>
        <Link to={`/corresponding/${id}/update`}>Update Testing Details</Link> |{' '}
        <Link to={`/corresponding/${id}/assign`}>Assign Tester</Link>
      </p>
      <p><Link to="/active-testing">Back to Active Controls Testing List</Link></p>
    </div>
  )
}
