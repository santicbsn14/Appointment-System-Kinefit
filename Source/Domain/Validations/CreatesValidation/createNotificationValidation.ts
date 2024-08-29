import mongoose from 'mongoose'
import z from 'zod'
import idValidation from '../idValidation'

const createNotificationValidation= z.object(
    {
        appointment_id: idValidation,
        type:z.string(),
        state: z.string(),
        date_send: z.date(),
        note: z.string()
    }
)
export default createNotificationValidation