import { Router } from "express";
import { createAppointment, deleteOne, getAll, getById, update } from "../Controllers/appointmentController.js";
const appointmentRouter = Router();
appointmentRouter.get('/', getAll);
appointmentRouter.get('/:id', getById);
appointmentRouter.post('/', createAppointment);
appointmentRouter.put('/:id', update);
appointmentRouter.delete('/:id', deleteOne);
export default appointmentRouter;
