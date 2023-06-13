import { store } from '../../app/store'
import { dogsApiSlice } from '../dogs/dogsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'


const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const dogs = store.dispatch(dogsApiSlice.endpoints.getDogs.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('unsubscribing')
            dogs.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default Prefetch

