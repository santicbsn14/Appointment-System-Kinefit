import { NextFunction, Response } from "express";
import { Patient } from "../../Data/Models/patientSchema";
import PatientManager from "../../Domain/Manager/patientManager";
import { IdMongo, Criteria } from "typesMongoose";
import { CreatePatientDto } from "typesRequestDtos";



export const createPatient = async (req: CustomRequest<CreatePatientDto>, res: Response, next: NextFunction) => {
    try {
        const manager = new PatientManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const body: CreatePatientDto = req.body
        const createdPatient = await manager.createPatient(body);
        
        res.status(201).json(createdPatient);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
            const manager = new PatientManager()
            const { limit, page }: Criteria = req.query;
            const data = await manager.getAll({ limit, page });
            res.send({ status: 'success', patients: data.docs, ...data, docs: undefined })
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
        const manager = new PatientManager()
        let id : IdMongo = req.params.id as unknown as IdMongo
        res.status(200).json(await manager.getPatientById(id))
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
        const manager = new PatientManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let obj : Patient = req.body as unknown as Patient
        res.status(201).json(await manager.updatePatient(obj, id))
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
        const manager = new PatientManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        res.status(201).json(await manager.deletePatient(id))
        }
        catch(error)
        {
           next(error)
        }
}