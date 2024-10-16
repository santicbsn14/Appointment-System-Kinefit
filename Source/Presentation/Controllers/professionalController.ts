import { NextFunction, Response } from "express";
import { Professional } from "../../Data/Models/professionalSchema";
import ProfessionalManager from "../../Domain/Manager/professionalManager";
import { IdMongo, Criteria } from "typesMongoose";
import { CreateProfessionalDto } from "typesRequestDtos";



export const createProfessional = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const manager = new ProfessionalManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const body: CreateProfessionalDto = req.body
        const createdProfessional = await manager.createProfessional(body);
        
        res.status(201).json(createdProfessional);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
            const manager = new ProfessionalManager()
            const { limit, page }: Criteria = req.query;
            const data = await manager.getAll({ limit, page });
            res.send({ status: 'success', professionals: data.docs, ...data, docs: undefined })
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
        const manager = new ProfessionalManager()
        let id : IdMongo = req.params.id as unknown as IdMongo
        res.status(200).json(await manager.getProfessionalById(id))
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
        const manager = new ProfessionalManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let obj : Professional = req.body as unknown as Professional
        res.status(201).json(await manager.updateProfessional(obj, id))
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
        const manager = new ProfessionalManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        res.status(201).json(await manager.deleteProfessional(id))
        }
        catch(error)
        {
           next(error)
        }
}