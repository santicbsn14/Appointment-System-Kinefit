import z from 'zod';
import mongoose from 'mongoose';
const createScheduledSessionsValidation = z.object({
    professional_id: z.instanceof(mongoose.Types.ObjectId),
    pacient_id: z.instanceof(mongoose.Types.ObjectId),
    week_day: z.string(),
    start_date: z.date(),
    number_sessions: z.number(),
    state: z.string(),
    frequency: z.string()
});
export default createScheduledSessionsValidation;
