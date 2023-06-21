import { useGetLittersQuery } from "./littersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useNavigate, useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import Dog from '../dogs/Dog'

const LitterPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()

    const { litterid } = useParams()

    const { litter } = useGetLittersQuery("littersList", {
        selectFromResult: ({ data }) => ({
            litter: data?.entities[litterid]
        }),
    })

    const {
        data: dogs,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDogsQuery('dogsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let dogContent
    
    if (isLoading) dogContent = <p>Loading...</p>
    
    if (isError) {
        dogContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids } = dogs
      
        const tableContent = ids?.length
            ? ids.map(dogId => <Dog key={dogId} dogId={dogId} />)
            : null
      
        dogContent = (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Administrative user</th>
                        <th>Breed</th>
                        <th>Gender</th>
                        <th>Born</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    const { mother } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            mother: data?.entities[litter?.mother?.toString()]
        }),
    })

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[mother?.user]
        }),
    })

    if (!litter) {
        console.log(litter)
        return null
    }

    if (!mother) {
        console.log(litter.mother)
        return null
    }

    let content = null

    if (user === userId) {
        content = (
            <button
                onClick={() => navigate(`/litters/edit/${litter.id}`)}
            >
                <FontAwesomeIcon icon={faSave} />
            </button>
        )
    }

    return (
        <>
            {content}
            <p>Mother: {litter.mother}</p>
            <p>ID: {litter.id}</p>
            <p>Born: {litter?.born}</p>
            <br />
            <p>Dogs:</p>
            {dogContent}
        </>
    )
}

export default LitterPage
