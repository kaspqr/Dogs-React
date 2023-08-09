import { Link } from "react-router-dom"
import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo, useEffect, useState } from "react"

const Dog = ({ dogId }) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize)
        }
    }, [])

    // GET the dog with all of it's .values
    const { dog } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            dog: data?.entities[dogId]
        }),
    })

    // GET the user who administrates the dog with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[dog?.user]
        }),
    })

    if (!dog) {
        return null
    }

    return (
        <tr>
            <td className="first-td"><Link className="orange-link" to={`/dogs/${dogId}`}><b>{dog.name}</b></Link></td>
            {windowWidth > 600 
                ? <><td>{dog.breed}</td>
                <td>{dog.female === true ? 'Girl' : 'Boy'}</td>
                <td>{dog.birth?.split(' ').slice(1, 4).join(' ')}</td></>
                : null
              }
            
            <td className="last-td"><Link className="orange-link" to={`/users/${user?.id}`}><b>{user?.username}</b></Link></td>
        </tr>
    )
}

const memoizedDog = memo(Dog)

export default memoizedDog
