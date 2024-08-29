import { Router } from "express";
import { createAppointmentByPatient, createAppointmentByProfessional, deleteOne, getAll, getById, update } from "../Controllers/appointmentController";

const appointmentRouter: Router = Router()

appointmentRouter.get('/', getAll)
appointmentRouter.get('/:id', getById)
appointmentRouter.post('/bypatient', createAppointmentByPatient)
appointmentRouter.post('/byprofessional', createAppointmentByProfessional);
appointmentRouter.put('/:id', update)
appointmentRouter.delete('/:id', deleteOne)
export default appointmentRouter