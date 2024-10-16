import { Router } from "express";
import { createUser, deleteOne, getAll, getByEmail, getById, update } from "../Controllers/userController";
import authMiddleware from "../Middlewares/auth";
import authorization from "../Middlewares/authorization";

const userRouter = Router()
userRouter.get('/', getAll)
userRouter.get('/email', getByEmail)
userRouter.get('/:id',authMiddleware,authorization('GetUserById'), getById)
userRouter.post('/',authMiddleware,authorization('CreateUser'), createUser);
userRouter.put('/:id',authMiddleware,authorization('UpdateUser'), update)
userRouter.delete('/:id',authMiddleware,authorization('DeleteUser'), deleteOne)
export default userRouter