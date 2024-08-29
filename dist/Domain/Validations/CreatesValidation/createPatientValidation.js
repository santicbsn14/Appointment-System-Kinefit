import z from 'zod';
import idValidation from '../idValidation.js';
const createPatientValidation = z.object({
    user_id: idValidation,
    clinical_data: z.array(z.unknown())
});
export default createPatientValidation;
