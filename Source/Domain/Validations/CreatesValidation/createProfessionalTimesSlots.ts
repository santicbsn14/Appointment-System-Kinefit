import z from 'zod';
import mongoose from 'mongoose';

const createProfessionalTimesSlotsValidation = z.object({
  professional_id: z.instanceof(mongoose.Types.ObjectId),
  week_day: z.date(),
  start_time: z.string(),
  end_time: z.string(),
  state: z.string()
});

export default createProfessionalTimesSlotsValidation;
