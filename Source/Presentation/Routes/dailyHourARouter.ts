import { Router } from "express";
import { createDailyHourAvailability, deleteOne, getAll, getById, update } from "../Controllers/dailyHourAController";

const dailyHourAvailabilityRouter: Router = Router()

dailyHourAvailabilityRouter.get('/', getAll)
dailyHourAvailabilityRouter.get('/:id', getById)
dailyHourAvailabilityRouter.post('/', createDailyHourAvailability);
dailyHourAvailabilityRouter.put('/:id', update)
dailyHourAvailabilityRouter.delete('/:id', deleteOne)
export default dailyHourAvailabilityRouter