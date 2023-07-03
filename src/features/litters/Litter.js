import { Link } from "react-router-dom"
import { useGetLittersQuery } from "./littersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { memo } from "react"

const Litter = ({ litterId }) => {

    const { litter } = useGetLittersQuery("littersList", {
        selectFromResult: ({ data }) => ({
            litter: data?.entities[litterId]
        }),
    })

    const { mother } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            mother: data?.entities[litter?.mother]
        }),
    })

    console.log(mother)
    console.log(litter?.mother)

    if (!litter) {
        return null
    }

    if (!mother) {
        return null
    }

    if (litter && mother) {
        const born = new Date(litter.born).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        return (
            <tr>
                <td><Link className="orange-link" to={`/litters/${litterId}`}><b>Go to litter</b></Link></td>
                <td><Link className="orange-link" to={`/dogs/${mother?.id}`}><b>{mother?.name}</b></Link></td>
                <td>{born}</td>
            </tr>
        )
    } else return null
}

const memoizedLitter = memo(Litter)

export default memoizedLitter
