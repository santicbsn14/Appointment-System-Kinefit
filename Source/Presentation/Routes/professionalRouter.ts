import { Router } from "express";
import { createProfessional, deleteOne, getAll, getById, update } from "../Controllers/professionalController";
import authorization from "../Middlewares/authorization";
import authMiddleware from "../Middlewares/auth";

const professionalRouter: Router = Router()

professionalRouter.get('/', getAll)
professionalRouter.get('/:id',authMiddleware, authorization('GetUserById'), getById)
professionalRouter.post('/',authMiddleware, authorization('CreateProfessional'), createProfessional);
professionalRouter.put('/:id',authMiddleware, authorization('UpdateUser'), update)
professionalRouter.delete('/:id',authMiddleware, authorization('DeleteUser'), deleteOne)
export default professionalRouter