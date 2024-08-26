import z from 'zod';
import mongoose from 'mongoose';
const createAppointmentValidation = z.object({
    pacient_id: z.instanceof(mongoose.Types.ObjectId),
    professional_id: z.instanceof(mongoose.Types.ObjectId),
    date_time: z.date(),
    state: z.string(),
    session_type: z.string()
});
export default createAppointmentValidation;
