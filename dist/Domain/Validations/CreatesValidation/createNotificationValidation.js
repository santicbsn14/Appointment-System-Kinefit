import z from 'zod';
import idValidation from '../idValidation.js';
const createNotificationValidation = z.object({
    appointment_id: idValidation,
    type: z.string(),
    state: z.string(),
    date_send: z.date(),
    note: z.string()
});
export default createNotificationValidation;
