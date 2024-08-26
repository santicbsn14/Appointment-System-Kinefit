import { Router } from "express";
import { createAppointment, deleteOne, getAll, getById, update } from "../Controllers/appointmentController";

const appointmentRouter: Router = Router()

appointmentRouter.get('/', getAll)
appointmentRouter.get('/:id', getById)
appointmentRouter.post('/', createAppointment);
appointmentRouter.put('/:id', update)
appointmentRouter.delete('/:id', deleteOne)
export default appointmentRouter