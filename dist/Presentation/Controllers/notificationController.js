import NotificationManager from "../../Domain/Manager/notificationManager.js";
export const createNotification = async (req, res, next) => {
    try {
        const manager = new NotificationManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const notificationData = req.body;
        const createdNotification = await manager.createNotification(notificationData);
        res.status(201).json(createdNotification);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new NotificationManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.send({ status: 'success', notification: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new NotificationManager();
        let id = req.params.id;
        res.status(200).json(await manager.getNotificationById(id));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new NotificationManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updateNotification(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new NotificationManager();
        let id = req.params.id;
        res.status(201).json(await manager.deleteNotification(id));
    }
    catch (error) {
        next(error);
    }
};
