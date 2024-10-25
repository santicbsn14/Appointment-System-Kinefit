import { Router } from "express";
import { login, signup, updatedUser } from "../Controllers/sessionController";

const sessionRouter: Router = Router()

sessionRouter.post('/signup', signup)
sessionRouter.post('/login', login)
sessionRouter.put('/:id', updatedUser)
export default sessionRouter