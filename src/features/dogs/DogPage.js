import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetLittersQuery } from "../litters/littersApiSlice"

import { useNavigate, useParams, Link } from "react-router-dom"

import useAuth from "../../hooks/useAuth"

import InstagramSVG from "../../svgs/instagram.svg"

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

    const instagramUrl = dog?.instagram?.length ? `https://instagram.com/${dog?.instagram}` : null
    const facebookUrl = dog?.facebook?.length ? `https://facebook.com/${dog?.facebook}` : null
    const youtubeUrl = dog?.youtube?.length ? `https://youtube.com/@${dog?.youtube}` : null
    const tiktokUrl = dog?.tiktok?.length ? `https://tiktok.com/@${dog?.tiktok}` : null

    return (
        <>
            {content}
            <p className="dog-page-name">{dog?.name}</p>
            {dog?.instagram?.length ? <a href={instagramUrl} target="_blank"><svg className="instagram-icon" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a> : null}
            {dog?.facebook?.length ? <a href={facebookUrl} target="_blank"><svg className="facebook-icon" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512"><path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"/></svg></a> : null}
            {dog?.youtube?.length ? <a href={youtubeUrl} target="_blank"><svg className="youtube-icon" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg></a> : null}
            {dog?.tiktok?.length ? <a href={tiktokUrl} target="_blank"><svg className="tiktok-icon" xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg></a> : null}
            <br />
            <br />
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
