import { Router } from "express";
import { createProfessionalTimeSlots, deleteOne, getAll, getById, update } from "../Controllers/professionalTimeSlotsController.js";
const professionalTimeSlotsRouter = Router();
professionalTimeSlotsRouter.get('/', getAll);
professionalTimeSlotsRouter.get('/:id', getById);
professionalTimeSlotsRouter.post('/', createProfessionalTimeSlots);
professionalTimeSlotsRouter.put('/:id', update);
professionalTimeSlotsRouter.delete('/:id', deleteOne);
export default professionalTimeSlotsRouter;
