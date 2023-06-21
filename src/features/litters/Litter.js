import { useNavigate } from "react-router-dom"
import { useGetLittersQuery } from "./littersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { memo } from "react"

const Litter = ({ litterId }) => {

    const navigate = useNavigate()

    const { litter } = useGetLittersQuery("littersList", {
        selectFromResult: ({ data }) => ({
            litter: data?.entities[litterId]
        }),
    })

    const { mother } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            dog: data?.entities[litter?.mother]
        }),
    })

    if (!litter) {
        return null
    }

    if (litter) {
        const born = new Date(litter.born).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        return (
            <tr 
                onClick={() => navigate(`/litters/${litterId}`)}
            >
                <td>{litter.id}</td>
                <td>{mother}</td>
                <td>{born}</td>
            </tr>
        )
    } else return null
}

const memoizedLitter = memo(Litter)

export default memoizedLitter
