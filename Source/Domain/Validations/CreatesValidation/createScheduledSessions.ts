import z from 'zod';
import mongoose from 'mongoose';
import idValidation from '../idValidation';

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
