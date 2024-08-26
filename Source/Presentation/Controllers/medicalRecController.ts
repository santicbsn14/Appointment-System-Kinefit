import { NextFunction, Response } from "express";
import { MedicalRecord } from "../../Data/Models/medicalRecSchema";
import MedicalRecordManager from "../../Domain/Manager/medicalRecManager";
import { IdMongo, Criteria } from "typesMongoose";
import { CreateMedicalRecordDto } from "typesRequestDtos";


export const createMedicalRecord = async (req: CustomRequest<CreateMedicalRecordDto>, res: Response, next: NextFunction) => {
    try {
        const manager = new MedicalRecordManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }

        const medicalRecordData: CreateMedicalRecordDto = req.body;
        const createdMedicalRecord = await manager.createMedicalRecord(medicalRecordData);
        
        res.status(201).json(createdMedicalRecord);
    } catch (error) {
        next(error);
    }
};
export const getAll = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
            const manager = new MedicalRecordManager()
            const { limit, page }: Criteria = req.query;
            const data = await manager.getAll({ limit, page });
            res.send({ status: 'success', medicalRecords: data.docs, ...data, docs: undefined })
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
        const manager = new MedicalRecordManager()
        let id : IdMongo = req.params.id as unknown as IdMongo
        res.status(200).json(await manager.getMedicalRecordById(id))
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
        const manager = new MedicalRecordManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let obj : MedicalRecord = req.body as unknown as MedicalRecord
        res.status(201).json(await manager.updateMedicalRecord(obj, id))
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
        const manager = new MedicalRecordManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        res.status(201).json(await manager.deleteMedicalRecord(id))
        }
        catch(error)
        {
           next(error)
        }
}