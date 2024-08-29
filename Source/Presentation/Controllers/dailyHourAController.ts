import { NextFunction, Response } from "express";
import { DailyHourAvailability } from "../../Data/Models/dailyHourASchema";
import DailyHourAvailabilityManager from "Source/Domain/Manager/dailyHourAManager";
import { IdMongo, Criteria } from "typesMongoose";
import mongoose from "mongoose";
import { CreateDailyHourAvailabilityDto } from "typesRequestDtos";


export const createDailyHourAvailability = async (req: CustomRequest<CreateDailyHourAvailabilityDto>, res: Response, next: NextFunction) => {
    try {
        const manager = new DailyHourAvailabilityManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }

        const appointmentData: CreateDailyHourAvailabilityDto = req.body;
        const createdDailyHourAvailability = await manager.createDailyHourAvailability(appointmentData);
        
        res.status(201).json(createdDailyHourAvailability);
    } catch (error) {
        next(error);
    }
};
export const getAll = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
            const manager = new DailyHourAvailabilityManager()
            const { limit, page }: Criteria = req.query;
            const data = await manager.getAll({ limit, page });
            res.send({ status: 'success', appointments: data.docs, ...data, docs: undefined })
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
        const manager = new DailyHourAvailabilityManager()
        let id : string = req.params.id
        res.status(200).json(await manager.getDailyHourAvailabilityById(id))
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
        const manager = new DailyHourAvailabilityManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let obj : DailyHourAvailability = req.body as unknown as DailyHourAvailability
        res.status(201).json(await manager.updateDailyHourAvailability(obj, id))
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
        const manager = new DailyHourAvailabilityManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        res.status(201).json(await manager.deleteDailyHourAvailability(id))
        }
        catch(error)
        {
           next(error)
        }
}