import { Link, useParams } from 'react-router-dom'

export default function IndividualControl() {
  const { id } = useParams()
  return (
    <div>
      <h2>Individual Control</h2>
      <p>Control id: {id}</p>
      <p>
        <Link to={`/controls/${id}/update`}>Update</Link> |{' '}
        <Link to={`/controls/${id}/retire`}>Retire</Link> |{' '}
        <Link to="/controls">Back to Controls List</Link>
      </p>
    </div>
  )
}
