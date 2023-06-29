import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetLittersQuery } from "../litters/littersApiSlice"
import { useNavigate, useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const DogPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()

    const { dogid } = useParams()

    const { dog } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            dog: data?.entities[dogid]
        }),
    })

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[dog?.user]
        }),
    })

    const { owner } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            owner: data?.entities[dog?.owner]
        }),
    })

    const { parentLitter } = useGetLittersQuery("littersList", {
        selectFromResult: ({ data }) => ({
            parentLitter: data?.entities[dog?.litter]
        }),
    })

    console.log(parentLitter)

    let filteredLitters
    let childrenLitterIds
    let allChildren

    const {
        data: litters,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetLittersQuery('littersList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let littersContent

    if (isLoading) littersContent = <p>Loading...</p>

    if (isError) {
        littersContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids, entities } = litters

        const filteredIds = dog?.female === true
            ? ids.filter(litterId => entities[litterId].mother === dog?.id)
            : ids.filter(litterId => entities[litterId].father === dog?.id)

        if (filteredIds?.length) {
            filteredLitters = filteredIds.map(litterId => entities[litterId])
            childrenLitterIds = filteredIds
        }
    }

    const {
        data: dogs,
        isLoading: isDogsLoading,
        isSuccess: isDogsSuccess,
        isError: isDogsError,
        error: dogsError
    } = useGetDogsQuery('dogsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    if (isDogsLoading) littersContent = <p>Loading...</p>

    if (isDogsError) {
        littersContent = <p className="errmsg">{dogsError?.data?.message}</p>
    }

    let siblings

    if (isDogsSuccess) {
        const { ids, entities } = dogs

        const filteredIds = ids.filter(dogId => childrenLitterIds?.includes(entities[dogId].litter))
        const filteredSiblingIds = ids.filter(dogId => entities[dogId].litter === dog?.litter && dogId !== dog?.id)

        if (filteredSiblingIds?.length) {
            siblings = filteredSiblingIds.map(dogId => entities[dogId])
        }

        if (filteredIds?.length) {
            allChildren = filteredIds.map(dogId => entities[dogId])
        }
    }

    if (isSuccess) {
        littersContent = filteredLitters.map(litter => 
            <>
                <p>
                    <b>Litter </b><Link to={`/litters/${litter?.id}`}>{litter?.id}</Link>
                    {allChildren.map(child => child?.litter === litter?.id 
                        ? <><br />{child?.female === true ? <b>Daughter: </b> : <b>Son: </b>}<Link to={`/dogs/${child?.id}`}>{child?.name}</Link></>
                        : null
                    )}
                </p>
                <br />
            </> 
        )
    }

    const { mother } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            mother: data?.entities[parentLitter?.mother]
        }),
    })

    console.log(mother)
    console.log(parentLitter?.mother)

    const { father } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            father: data?.entities[parentLitter?.father]
        }),
    })

    if (!dog) {
        return null
    }

    let content = null

    if (userId === dog?.user) {
        content = (
            <>
                <button
                    onClick={() => navigate(`/dogs/edit/${dog?.id}`)}
                >
                    Edit
                </button>
                <br />
                <br />
            </>
        )
    }

    const fatherContent = father
        ? <p><b>Father: </b><Link to={`/dogs/${father?.id}`}>{father?.name}</Link></p>
        : null

    const parentsContent = parentLitter 
        ? <>
            <p><b>Mother: </b><Link to={`/dogs/${mother?.id}`}>{mother?.name}</Link></p>
            {fatherContent}
            <p><b>Litter: </b><Link to={`/litters/${parentLitter?.id}`}>{parentLitter?.id}</Link></p>
        </>
        : null


    let siblingsContent = null

    if (siblings?.length) {
        siblingsContent = siblings.map(sibling => <p><b>{sibling?.female === true ? <>Sister: </> : <>Brother: </>}</b><Link to={`/dogs/${sibling?.id}`}>{sibling?.name}</Link></p>)
    }

    return (
        <>
            {content}
            <p className="dog-page-name">{dog?.name}</p>
            <p><b>Administrative user:</b> <Link to={`/users/${user?.id}`}>{user?.username}</Link></p>
            <p><b>Owner:</b> {owner ? <Link to={`/users/${owner?.id}`}>{owner?.username}</Link> : 'Not added'}</p>
            <p><b>Gender:</b> {dog?.female === true ? 'Female' : 'Male'}</p>
            <p><b>Breed:</b> {dog?.breed}</p>
            {dog?.female === true && dog?.sterilized === false ? <p><b>Currently in heat?:</b> {dog?.heat === true ? 'Yes' : 'No'}</p> : null}
            <p><b>Sterilized:</b> {dog?.sterilized === true ? 'Yes' : 'No'}</p>
            <p><b>Birth:</b> {dog?.birth}</p>
            {dog?.death?.length ? <p><b>Death:</b> {dog?.death}</p> : null}
            <p><b>Microchipped:</b> {dog?.microchipped === true ? 'Yes' : 'No'}</p>
            <p><b>Chipnumber:</b> {dog?.chipnumber ? dog?.chipnumber : 'Not added'}</p>
            <p><b>Passport:</b> {dog?.passport === true ? 'Yes' : 'No'}</p>
            <p><b>Location:</b> {dog?.location}</p>
            <p><b>Info:</b></p>
            <p>{dog?.info}</p>
            <br />
            {parentsContent}
            <br />
            <p><b>{dog?.name}</b></p>
            {siblingsContent}
            <br />
            {littersContent}
        </>
    )
}

export default DogPage
