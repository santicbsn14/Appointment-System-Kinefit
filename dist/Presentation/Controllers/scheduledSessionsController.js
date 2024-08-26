import ScheduledSessionsManager from "../../Domain/Manager/scheduledSessionsManager.js";
export const createScheduledSessions = async (req, res, next) => {
    try {
        const manager = new ScheduledSessionsManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const scheduledSessionsData = req.body;
        const createdScheduledSessions = await manager.createScheduledSessions(scheduledSessionsData);
        res.status(201).json(createdScheduledSessions);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new ScheduledSessionsManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.status(201).send({ status: 'success', scheduledSessions: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new ScheduledSessionsManager();
        let id = req.params.id;
        res.status(200).json(await manager.getScheduledSessionsById(id));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new ScheduledSessionsManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updateScheduledSessions(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new ScheduledSessionsManager();
        let id = req.params.id;
        res.status(201).json(await manager.deleteScheduledSessions(id));
    }
    catch (error) {
        next(error);
    }
};
