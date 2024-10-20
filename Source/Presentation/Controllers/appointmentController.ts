import { NextFunction, Response } from "express";
import { Appointment } from "../../Data/Models/appointmentSchema";
import AppointmentManager from "../../Domain/Manager/appointmentManager";
import { IdMongo, Criteria } from "typesMongoose";
import { CreateAppointmentDto } from "typesRequestDtos";
import { mailForConfirmAppointment, mailForDeleteAppointment } from "../../Services/mailing";


export const createAppointmentByPatient = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const manager = new AppointmentManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }

        const appointmentData: CreateAppointmentDto = req.body;
        const createdAppointment = await manager.createAppointmentByPatient(appointmentData);
        //@ts-expect-error 
        if(createdAppointment) await mailForConfirmAppointment(req.user.email);
        res.status(201).json(createdAppointment);
    } catch (error) {
        next(error);
    }
};

export const createAppointmentByProfessional = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const manager = new AppointmentManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }

        const appointmentData: CreateAppointmentDto = req.body;
        const {getPatientEmail, appointmentCreated} = await manager.createAppointmentByProfessional(appointmentData);
        if(appointmentCreated) mailForConfirmAppointment(getPatientEmail.user_id.email)
        res.status(201).json(appointmentCreated);
    } catch (error) {
        next(error);
    }
};
export const createBulkAppointments = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const manager = new AppointmentManager();
        
        if (!req.body) {
            throw new Error('Request body is empty');
        }

        const appointmentData: CreateAppointmentDto[] = req.body;
        const createdAppointment = await manager.createBulkAppointments(appointmentData);
        
        res.status(201).json(createdAppointment);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: CustomRequest, res: Response, next: NextFunction)=>
    {
        try
        {
            const manager = new AppointmentManager()
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
        const manager = new AppointmentManager()
        let id : string = req.params.id
        res.status(200).json(await manager.getAppointmentById(id))
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
        const manager = new AppointmentManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let obj : Appointment = req.body as unknown as Appointment
        res.status(201).json(await manager.updateAppointment(obj, id))
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
        const manager = new AppointmentManager()
        let id : IdMongo = req.params.id as unknown as IdMongo;
        let {appointmentToDelete, email}  = await manager.deleteAppointment(id)
        if(appointmentToDelete) mailForDeleteAppointment(email)
        res.status(201).json(appointmentToDelete);
        }
        catch(error)
        {
           next(error)
        }
}