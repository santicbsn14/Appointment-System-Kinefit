import { Router } from "express";
import { createNotification, deleteOne, getAll, getById, update } from "../Controllers/notificationController.js";
const notificationRouter = Router();
notificationRouter.get('/', getAll);
notificationRouter.get('/:id', getById);
notificationRouter.post('/', createNotification);
notificationRouter.put('/:id', update);
notificationRouter.delete('/:id', deleteOne);
export default notificationRouter;
