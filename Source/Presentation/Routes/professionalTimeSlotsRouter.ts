import { Router } from "express";
import { createProfessionalTimeSlots, deleteOne, getAll, getById, getByPro, update } from "../Controllers/professionalTimeSlotsController";

const professionalTimeSlotsRouter: Router = Router()

professionalTimeSlotsRouter.get('/', getAll)
professionalTimeSlotsRouter.get('/:id', getById)
professionalTimeSlotsRouter.get('/bypro/:idp', getByPro)
professionalTimeSlotsRouter.post('/', createProfessionalTimeSlots);
professionalTimeSlotsRouter.put('/:id', update)
professionalTimeSlotsRouter.delete('/:id', deleteOne)
export default professionalTimeSlotsRouter