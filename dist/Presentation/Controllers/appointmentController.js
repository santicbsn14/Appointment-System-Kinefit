import AppointmentManager from "../../Domain/Manager/appointmentManager.js";
import { mailForConfirmAppointment } from "../../Services/mailing.js";
export const createAppointmentByPatient = async (req, res, next) => {
    try {
        const manager = new AppointmentManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const appointmentData = req.body;
        const createdAppointment = await manager.createAppointmentByPatient(appointmentData);
        if (createdAppointment)
            mailForConfirmAppointment(createdAppointment.pacient_id.user_id.email);
        res.status(201).json(createdAppointment);
    }
    catch (error) {
        next(error);
    }
};
export const createAppointmentByProfessional = async (req, res, next) => {
    try {
        const manager = new AppointmentManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const appointmentData = req.body;
        const { getPatientEmail, appointmentCreated } = await manager.createAppointmentByProfessional(appointmentData);
        if (appointmentCreated)
            mailForConfirmAppointment(getPatientEmail.user_id.email);
        res.status(201).json(appointmentCreated);
    }
    catch (error) {
        next(error);
    }
};
export const createBulkAppointments = async (req, res, next) => {
    try {
        const manager = new AppointmentManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const appointmentData = req.body;
        const createdAppointment = await manager.createBulkAppointments(appointmentData);
        res.status(201).json(createdAppointment);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new AppointmentManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.send({ status: 'success', appointments: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new AppointmentManager();
        let id = req.params.id;
        res.status(200).json(await manager.getAppointmentById(id));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new AppointmentManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updateAppointment(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new AppointmentManager();
        let id = req.params.id;
        res.status(201).json(await manager.deleteAppointment(id));
    }
    catch (error) {
        next(error);
    }
};
