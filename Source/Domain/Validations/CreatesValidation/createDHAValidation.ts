import mongoose from 'mongoose'
import z from 'zod'
import idValidation from '../idValidation'
import dayjs, { Dayjs } from 'dayjs';

const hourlySlotSchema = z.object({
    hour: z.number().int().min(0).max(23),
    max_sessions: z.number().int().min(0),
    current_sessions: z.number().int().min(0),
});
const createNotificationValidation= z.object(
    {
        professional_id: idValidation,
        hourly_slots:hourlySlotSchema,
        date: z.date(),
    }
)
export default createNotificationValidation