import z from 'zod';
import idValidation from '../idValidation.js';
const createScheduledSessionsValidation = z.object({
    professional_id: idValidation,
    pacient_id: idValidation,
    week_day: z.string(),
    start_date: z.date(),
    number_sessions: z.number(),
    state: z.string(),
    frequency: z.string()
});
export default createScheduledSessionsValidation;
