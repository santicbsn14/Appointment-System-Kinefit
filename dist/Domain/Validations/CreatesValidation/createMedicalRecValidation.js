import z from 'zod';
import mongoose from 'mongoose';
const createMedicalRecordValidation = z.object({
    pacient_id: z.instanceof(mongoose.Types.ObjectId),
    last_update: z.date(),
    notes: z.string(),
    attachments: z.string()
});
export default createMedicalRecordValidation;
