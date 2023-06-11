import { Link } from "react-router-dom"

const Welcome = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <div>
      <p>{today}</p>
    </div>
  )
}

export default Welcome
