import mongoose from 'mongoose';
import z from 'zod';
const createNotificationValidation = z.object({
    appointment_id: z.instanceof(mongoose.Types.ObjectId),
    type: z.string(),
    state: z.string(),
    date_send: z.date(),
    note: z.string()
});
export default createNotificationValidation;
