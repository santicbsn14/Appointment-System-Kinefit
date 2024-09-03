import { Router } from "express";
import { login, signup } from "../Controllers/sessionController";

const sessionRouter: Router = Router()

sessionRouter.post('/signup', signup)
sessionRouter.post('/login', login)
export default sessionRouter