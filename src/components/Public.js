import { Link } from "react-router-dom"

const Public = () => {
  const content = (
    <section>
      <header>
        <h1>Welcome to DogsApp</h1>
      </header>
      <main>
        <p>Kasparblabla</p>
      </main>
      <footer>
        <Link to="/login">User Login</Link>
      </footer>
    </section>
  )
  
  return content
}

export default Public
