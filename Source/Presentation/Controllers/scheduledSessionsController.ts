import { NextFunction, Response } from "express";
import { ScheduledSessions } from "../../Data/Models/scheduledSessionsSchema";
import ScheduledSessionsManager from "../../Domain/Manager/scheduledSessionsManager";
import { IdMongo, Criteria } from "typesMongoose";
import { CreateScheduledSessionsDto} from "typesRequestDtos";


export const createScheduledSessions = async (req: CustomRequest<CreateScheduledSessionsDto>, res: Response, next: NextFunction) => {
    try {
        const manager = new ScheduledSessionsManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }

        const scheduledSessionsData: CreateScheduledSessionsDto = req.body;
        const createdScheduledSessions = await manager.createScheduledSessions(scheduledSessionsData);
        
        res.status(201).json(createdScheduledSessions);
    } catch (error) {
        next(error);
    }
};
export const getAll = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
            const manager = new ScheduledSessionsManager()
            const { limit, page }: Criteria = req.query;
            const data = await manager.getAll({ limit, page });
            res.status(201).send({ status: 'success', scheduledSessions: data.docs, ...data, docs: undefined })
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
        const manager = new ScheduledSessionsManager()
        let id : IdMongo = req.params.id as unknown as IdMongo
        res.status(200).json(await manager.getScheduledSessionsById(id))
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
        const manager = new ScheduledSessionsManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let obj : ScheduledSessions = req.body as unknown as ScheduledSessions
        res.status(201).json(await manager.updateScheduledSessions(obj, id))
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
        const manager = new ScheduledSessionsManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        res.status(201).json(await manager.deleteScheduledSessions(id))
        }
        catch(error)
        {
           next(error)
        }
}