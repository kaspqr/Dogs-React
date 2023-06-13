import { Link } from "react-router-dom"

const Welcome = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <div>
      <p>{today}</p>
      <h1>Welcome!</h1>
      <p><Link to="/dash/dogs">View Dogs</Link></p>
      <p><Link to="/dash/dogs/new">Add New Dog</Link></p>
      <p><Link to="/dash/users">View Users</Link></p>
      <p><Link to="/dash/users/new">Add New User</Link></p>
    </div>
  )
}

export default Welcome
