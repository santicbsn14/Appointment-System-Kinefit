import { Router } from "express";
import { createAppointmentByPatient, createAppointmentByProfessional, createBulkAppointments, deleteOne, getAll, getById, update } from "../Controllers/appointmentController";
import authorization from "../Middlewares/authorization";
import authMiddleware from "../Middlewares/auth";

const appointmentRouter: Router = Router()

appointmentRouter.get('/', getAll)
appointmentRouter.get('/:id', getById)
appointmentRouter.post('/bypatient', authMiddleware, authorization('CreateAppointments'), createAppointmentByPatient)
appointmentRouter.post('/bulkAppointments', authMiddleware, authorization('CreateBulkAppointments'), createBulkAppointments)
appointmentRouter.post('/byprofessional', authMiddleware, authorization('CreateAppointments'),  createAppointmentByProfessional);
appointmentRouter.put('/:id', authMiddleware, authorization('UpdateAppointments'),  update)
appointmentRouter.delete('/:id', deleteOne)
export default appointmentRouter