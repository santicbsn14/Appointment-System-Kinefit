import mongoose from 'mongoose';
import z from 'zod';
const createPatientValidation = z.object({
    user_id: z.instanceof(mongoose.Types.ObjectId),
    clinical_data: z.array(z.unknown())
});
export default createPatientValidation;
