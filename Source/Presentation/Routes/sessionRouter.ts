import { Router } from "express";
import { signup } from "../Controllers/sessionController";

const sessionRouter: Router = Router()

sessionRouter.post('/signup', signup)
export default sessionRouter