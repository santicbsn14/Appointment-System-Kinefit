import { Router } from "express";
import { createProfessional, deleteOne, getAll, getById, update } from "../Controllers/professionalController";

const professionalRouter: Router = Router()

professionalRouter.get('/', getAll)
professionalRouter.get('/:id', getById)
professionalRouter.post('/', createProfessional);
professionalRouter.put('/:id', update)
professionalRouter.delete('/:id', deleteOne)
export default professionalRouter