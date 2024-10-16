import { Router } from "express";
import { createPatient, deleteOne, getAll, getById, update } from "../Controllers/patientController";
import authMiddleware from "../Middlewares/auth";
import authorization from "../Middlewares/authorization";

const patientRouter: Router = Router()

patientRouter.get('/', getAll)
patientRouter.get('/:id',authMiddleware, authorization('GetUserById'), getById)
patientRouter.post('/',authMiddleware, authorization('CreatePatient'), createPatient);
patientRouter.put('/:id',authMiddleware, authorization('UpdateUser'), update)
patientRouter.delete('/:id',authMiddleware, authorization('DeleteUser'), deleteOne)
export default patientRouter