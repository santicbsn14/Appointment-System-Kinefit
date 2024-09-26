import { Router } from "express";
import { createDailyHourAvailability, deleteOne, getAll, getById, update } from "../Controllers/dailyHourAController";
import authorization from "../Middlewares/authorization";
import authMiddleware from "../Middlewares/auth";

const dailyHourAvailabilityRouter: Router = Router()

dailyHourAvailabilityRouter.get('/', authMiddleware, authorization('GetDailyHourAvailability'), getAll)
dailyHourAvailabilityRouter.get('/:id', authMiddleware, authorization('GetDailyHourAvailability'), getById)
dailyHourAvailabilityRouter.post('/', authMiddleware, authorization('CreateDailyHourAvailability'), createDailyHourAvailability);
dailyHourAvailabilityRouter.put('/:id', authMiddleware, authorization('UpdateDailyHourAvailability'), update)
dailyHourAvailabilityRouter.delete('/:id', authMiddleware, authorization('DeleteDailyHourAvailability'), deleteOne)
export default dailyHourAvailabilityRouter