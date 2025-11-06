import { Link } from 'react-router-dom'

export default function ActiveControlsTestingList() {
  return (
    <div>
      <h2>Active Controls Testing List</h2>
      <p>List of active controls under testing.</p>
      <ul>
        <li><Link to="/corresponding/101">Corresponding Control #101</Link></li>
      </ul>
    </div>
  )
}
