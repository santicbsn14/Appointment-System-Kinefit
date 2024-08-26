import { Router } from "express";
import { createMedicalRecord, deleteOne, getAll, getById, update } from "../Controllers/medicalRecController.js";
const medicalRecordRouter = Router();
medicalRecordRouter.get('/', getAll);
medicalRecordRouter.get('/:id', getById);
medicalRecordRouter.post('/', createMedicalRecord);
medicalRecordRouter.put('/:id', update);
medicalRecordRouter.delete('/:id', deleteOne);
export default medicalRecordRouter;
