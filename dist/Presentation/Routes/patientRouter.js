import { Router } from "express";
import { createPatient, deleteOne, getAll, getById, update } from "../Controllers/patientController.js";
const patientRouter = Router();
patientRouter.get('/', getAll);
patientRouter.get('/:id', getById);
patientRouter.post('/', createPatient);
patientRouter.put('/:id', update);
patientRouter.delete('/:id', deleteOne);
export default patientRouter;
