import { useGetUsersQuery } from "./usersApiSlice"
import { memo } from "react"
import { Link } from "react-router-dom"

const User = ({ userId }) => {

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    if (user) {

        return (
            <tr>
                <td><Link className="orange-link" to={`/users/${userId}`}><b>{user.username}</b></Link></td>
            </tr>
        )
    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser
