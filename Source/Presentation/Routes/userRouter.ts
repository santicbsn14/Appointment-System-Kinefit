import { Router } from "express";
import { createUser, deleteOne, getAll, getByEmail, getById, update } from "../Controllers/userController";

const userRouter = Router()
userRouter.get('/', getAll)
userRouter.get('/:id', getById)
userRouter.get('/', getByEmail)
userRouter.post('/', createUser);
userRouter.put('/:id', update)
userRouter.delete('/:id', deleteOne)
export default userRouter