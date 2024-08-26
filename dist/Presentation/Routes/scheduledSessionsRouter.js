import { Router } from "express";
import { createScheduledSessions, deleteOne, getAll, getById, update } from "../Controllers/scheduledSessionsController.js";
const scheduledSessionsRouter = Router();
scheduledSessionsRouter.get('/', getAll);
scheduledSessionsRouter.get('/:id', getById);
scheduledSessionsRouter.post('/', createScheduledSessions);
scheduledSessionsRouter.put('/:id', update);
scheduledSessionsRouter.delete('/:id', deleteOne);
export default scheduledSessionsRouter;
