import { Link } from "react-router-dom"
import { useGetLittersQuery } from "./littersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { memo } from "react"

const Litter = ({ litterId }) => {

    // GET the litter with all of it's .values
    const { litter } = useGetLittersQuery("littersList", {
        selectFromResult: ({ data }) => ({
            litter: data?.entities[litterId]
        }),
    })

    // GET the litter's mother dog with all of it's .values
    const { mother } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            mother: data?.entities[litter?.mother]
        }),
    })

    if (!litter) {
        return null
    }

    if (!mother) {
        return null
    }

    if (litter && mother) {
        return (
            <tr>
                <td><Link className="orange-link" to={`/litters/${litterId}`}><b>View Litter</b></Link></td>
                <td><Link className="orange-link" to={`/dogs/${mother?.id}`}><b>{mother?.name}</b></Link></td>
                <td>{litter?.born?.split(' ').slice(1, 4).join(' ')}</td>
            </tr>
        )
    } else return null
}

const memoizedLitter = memo(Litter)

export default memoizedLitter
