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
    </div>
  )
}

export default Welcome
