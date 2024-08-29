import z from 'zod';
import mongoose from 'mongoose';
import idValidation from '../idValidation';

const createAppointmentValidation = z.object({
  pacient_id: idValidation,
  professional_id: idValidation,
  date_time: z.date(),
  state: z.string(),
  session_type: z.string()
});

export default createAppointmentValidation;
