import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Welcome = () => {

  const { username } = useAuth()

  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <div>
      <p>{today}</p>
      <h1>
        {username?.length ? 'Welcome, ' + username + '!' : 'Welcome!'}
      </h1>
      <p><Link to="/dogs">View Dogs</Link></p>
      <p><Link to="/dogs/new">Add New Dog</Link></p>
      <p><Link to="/users">View Users</Link></p>
      <p><Link to="/litters">View Litters</Link></p>
      <p><Link to="/litters/new">Add New Litter</Link></p>
      <p><Link to="/advertisements">View Advertisements</Link></p>
      <p><Link to="/advertisements/new">Add New Advertisement</Link></p>
    </div>
  )
}

export default Welcome
