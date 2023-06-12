import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

import { useSelector } from "react-redux"
import { selectDogById } from "./dogsApiSlice"

const Dog = ({ dogId }) => {

    const dog = useSelector(state => selectDogById(state, dogId))

    const navigate = useNavigate()

    if (dog) {
        const birth = new Date(dog.birth).toLocaleString('en-US', { day: 'numeric', month: 'long' })
        const death = new Date(dog.death).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/dogs/${dogId}`)

        return (
            <tr>
                <td>{dog.user}</td>
                <td>{dog.owner}</td>
                <td>{dog.name}</td>
                <td>{dog.breed}</td>
                <td>
                    <button
                     onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null
}

export default Dog
