import container from "../../container";
import { type Appointment } from "../../Data/Models/appointmentSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createAppointmentValidation from "../Validations/CreatesValidation/createAppointmentValidation";
import { CreateAppointmentDto } from "typesRequestDtos";
import mongoose from "mongoose";



class AppointmentManager {
    private appointmentRepository

    constructor(){
        this.appointmentRepository = container.resolve('AppointmentRepository');
    }
    async getAll(criteria: Criteria){
       return await this.appointmentRepository.getAll(criteria)
    }
    async getAppointmentById(id: string){
        let aid = new mongoose.Types.ObjectId(id)
        await idValidation.parseAsync(aid)
        return await this.appointmentRepository.getAppointmentById(aid)
    }
    async createAppointment(bodyDto:CreateAppointmentDto){
        const body: Appointment = {
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: bodyDto.date_time,
            state: bodyDto.state,
            session_type: bodyDto.session_type,
        };
        await createAppointmentValidation.parseAsync(body)
        return await this.appointmentRepository.createAppointment(body)
    }
    async updateAppointment(body:Appointment, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.appointmentRepository.updateAppointment(body, id)
    }
    async deleteAppointment(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.appointmentRepository.deleteAppointment(id)
    }
}
export default AppointmentManager