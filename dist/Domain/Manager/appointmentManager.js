import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createAppointmentValidation from "../Validations/CreatesValidation/createAppointmentValidation.js";
import mongoose from "mongoose";
class AppointmentManager {
    constructor() {
        this.appointmentRepository = container.resolve('AppointmentRepository');
    }
    async getAll(criteria) {
        return await this.appointmentRepository.getAll(criteria);
    }
    async getAppointmentById(id) {
        let aid = new mongoose.Types.ObjectId(id);
        await idValidation.parseAsync(aid);
        return await this.appointmentRepository.getAppointmentById(aid);
    }
    async createAppointment(bodyDto) {
        const body = {
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: bodyDto.date_time,
            state: bodyDto.state,
            session_type: bodyDto.session_type,
        };
        await createAppointmentValidation.parseAsync(body);
        return await this.appointmentRepository.createAppointment(body);
    }
    async updateAppointment(body, id) {
        await idValidation.parseAsync(id);
        return await this.appointmentRepository.updateAppointment(body, id);
    }
    async deleteAppointment(id) {
        await idValidation.parseAsync(id);
        return await this.appointmentRepository.deleteAppointment(id);
    }
}
export default AppointmentManager;
