import { NextFunction, Response } from "express";
import { Notification } from "../../Data/Models/notificationSchema";
import NotificationManager from "../../Domain/Manager/notificationManager";
import { IdMongo, Criteria } from "typesMongoose";
import { CreateNotificationDto } from "typesRequestDtos";


export const createNotification = async (req: CustomRequest<CreateNotificationDto>, res: Response, next: NextFunction) => {
    try {
        const manager = new NotificationManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }

        const notificationData: CreateNotificationDto = req.body;
        const createdNotification = await manager.createNotification(notificationData);
        
        res.status(201).json(createdNotification);
    } catch (error) {
        next(error);
    }
};
export const getAll = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
            const manager = new NotificationManager()
            const { limit, page }: Criteria = req.query;
            const data = await manager.getAll({ limit, page });
            res.send({ status: 'success', notification: data.docs, ...data, docs: undefined })
        }
        catch(error)
        {
        next(error)
        }
}
        
export const getById =  async (req: CustomRequest, res: Response, next: NextFunction)=>
{
        try
        {
        const manager = new NotificationManager()
        let id : IdMongo = req.params.id as unknown as IdMongo
        res.status(200).json(await manager.getNotificationById(id))
        }
        catch(error)
        {
        next(error)
        }
}

export const update = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
        const manager = new NotificationManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let obj : Notification = req.body as unknown as Notification
        res.status(201).json(await manager.updateNotification(obj, id))
        }
        catch(error)
        {
           next(error)
        }
}
        
export const deleteOne = async (req: CustomRequest, res: Response, next: NextFunction)=>
{
        try
        {
        const manager = new NotificationManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        res.status(201).json(await manager.deleteNotification(id))
        }
        catch(error)
        {
           next(error)
        }
}