import z from 'zod'
import idValidation from '../idValidation'
import createUserValidation from '../CreatesValidation/createUserValidation'

const updateUserValidation= z.union(
    [
        idValidation,
        createUserValidation
    ]
)
export default updateUserValidation