import z from 'zod';
import idValidation from '../idValidation.js';
import createUserValidation from '../CreatesValidation/createUserValidation.js';
const updateUserValidation = z.union([
    idValidation,
    createUserValidation
]);
export default updateUserValidation;
