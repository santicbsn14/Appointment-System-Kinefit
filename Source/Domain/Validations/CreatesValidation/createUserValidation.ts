import z from 'zod'

const createUserValidation= z.object(
    {
        firstname: z.string().min(4).max(20),
        lastname: z.string().min(4).max(20),
        username:z.string().min(5).max(14),
        email: z.string().email(),
        age: z.number(),
        dni:z.number(),
        homeAdress: z.string(),
        phone: z.number()
    }
)
export default createUserValidation