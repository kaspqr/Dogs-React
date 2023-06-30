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
        const filteredSiblingIds = ids.filter(dogId => dog?.litter?.length && entities[dogId].litter === dog?.litter && dogId !== dog?.id)

        if (filteredSiblingIds?.length) {
            siblings = filteredSiblingIds.map(dogId => entities[dogId])
        }

        if (filteredIds?.length) {
            allChildren = filteredIds.map(dogId => entities[dogId])
        }
    }

    let filteredParents
    let parentDogs
    console.log(filteredLitters)

    if (isSuccess) {
        const { ids, entities } = dogs
        console.log(ids)
        filteredParents = filteredLitters?.map(litter => {
            if (dog?.female === true) {
                return litter?.father
            } else {
                return litter?.mother
            }
        })
        parentDogs = filteredParents?.map(dogId => entities[dogId])
        console.log(filteredParents)
        console.log(parentDogs)

        littersContent = filteredLitters?.map(litter => 
            <>
                <p>
                    <Link to={`/litters/${litter?.id}`}><b>Litter</b></Link>   
                    {dog?.female === true ? <> with <Link to={`/dogs/${litter?.father}`}>{parentDogs?.find(parent => parent?.id === litter?.father)?.name}</Link></> : null}
                    {dog?.female === false ? <> with <Link to={`/dogs/${litter?.mother}`}>{parentDogs?.find(parent => parent?.id === litter?.mother)?.name}</Link></> : null}
                    {litter?.born?.length ? <>, time of birth: {litter?.born?.split(' ').slice(1, 4).join(' ')}</> : null}
                    {allChildren?.map(child => child?.litter === litter?.id 
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
        </>
        : <p>{dog?.name} is not added to any litter and therefore has no parents in the database</p>


    let siblingsContent = null

    if (siblings?.length) {
        siblingsContent = siblings.map(sibling => <p><b>{sibling?.female === true ? <>Sister: </> : <>Brother: </>}</b><Link to={`/dogs/${sibling?.id}`}>{sibling?.name}</Link></p>)
    } else {
        if (parentLitter) {
            siblingsContent = <p>{dog?.name} is not connected to any siblings through it's litter in the database</p>
        } else {
            siblingsContent = <p>{dog?.name} is not added to any litter and therefore has no siblings in the database</p>
        }
    }

    return (
        <>
            {content}
            <p className="dog-page-name">{dog?.name}</p>
            <p><b>Administered by:</b> <Link to={`/users/${user?.id}`}>{user?.username}</Link></p>
            <p><b>Gender:</b> {dog?.female === true ? 'Female' : 'Male'}</p>
            <p><b>Breed:</b> {dog?.breed}</p>
            {dog?.female === true && dog?.sterilized === false ? <p><b>Currently in heat?:</b> {dog?.heat === true ? 'Yes' : 'No'}</p> : null}
            <p><b>{dog?.female === true ? 'Sterilized: ' : 'Castrated: '}</b> {dog?.sterilized === true ? 'Yes' : 'No'}</p>
            <p><b>Birth:</b> {dog?.birth?.split(' ').slice(1, 4).join(' ')}</p>
            {dog?.death?.length ? <p><b>Death:</b> {dog?.death}</p> : null}
            <p><b>Microchipped:</b> {dog?.microchipped === true ? 'Yes' : 'No'}</p>
            {dog?.microchipped === true ? <p><b>Chipnumber: </b>{dog?.chipnumber}</p> : null}
            <p><b>Passport:</b> {dog?.passport === true ? 'Yes' : 'No'}</p>
            <p><b>Location:</b> {dog?.location}</p>
            <p><b>Additional Info:</b></p>
            <p>{dog?.info}</p>
            <br />
            <p className="family-tree-title"><b>Instant Family Tree</b></p>
            <p><b>Parents of {dog?.name}'s {dog?.litter ? <Link to={`/litters/${dog?.litter}`}>litter</Link> : 'litter'}:</b></p>
            {parentsContent}
            <br />
            <p><b>Siblings:</b></p>
            {siblingsContent}
            <br />
            <p><b>{dog?.name}'s litters and each litter's puppies</b></p>
            {filteredLitters?.length ? littersContent : <>{dog?.name} has no litters and therefore has no children in the database</>}
        </>
    )
}

export default DogPage
