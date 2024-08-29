import container from "../../container";
import { appointmentState, type Appointment } from "../../Data/Models/appointmentSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createAppointmentValidation from "../Validations/CreatesValidation/createAppointmentValidation";
import { CreateAppointmentDto } from "typesRequestDtos";
import mongoose from "mongoose";
import { ProfessionalTimeSlots } from "Source/Data/Models/professionalTimeSlotsSchema";
import { isAvailable } from "Source/Utils/scheduleUtils";
import { DailyHourAvailability } from "Source/Data/Models/dailyHourASchema";



class AppointmentManager {
    private appointmentRepository
    private professionalTimeSlotRepository
    private dailyHourAvailabilityRepository
    constructor(){
        this.appointmentRepository = container.resolve('AppointmentRepository');
        this.professionalTimeSlotRepository = container.resolve('ProfessionalTimeSlotRepository')
        this.dailyHourAvailabilityRepository = container.resolve('DailyHourAvailability')
    }
    async getAll(criteria: Criteria){
       return await this.appointmentRepository.getAll(criteria)
    }
    async getAppointmentById(id: string){
        let aid = new mongoose.Types.ObjectId(id)
        await idValidation.parseAsync(aid)
        return await this.appointmentRepository.getAppointmentById(aid)
    }
    async createAppointmentByPatient(bodyDto: CreateAppointmentDto) {
        const body: Appointment = {
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: bodyDto.date_time,
            schedule: bodyDto.schedule,
            state: bodyDto.state as appointmentState,
            session_type: bodyDto.session_type,
        };
    
        await createAppointmentValidation.parseAsync(body);
    
        // Verificar disponibilidad del profesional
        const proTimeSlots = await this.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro(body.professional_id);
        if (!proTimeSlots) throw new Error('Professional not found');
        
        const isAvailableSlot = isAvailable(proTimeSlots.schedule, body.schedule);
        if (!isAvailableSlot) throw new Error('The professional does not work in that time slot');
    
        // Verificar disponibilidad de cupos
        const isSlotAvailable = await this.isHourlySlotAvailable(body.date_time, body.schedule.time_slots.start_time);
        if (!isSlotAvailable) throw new Error('No available slots for the selected time');
    
        body.state = 'Confirmado';
        return await this.appointmentRepository.createAppointment(body);
    }
    
    private async isHourlySlotAvailable(date: Date, startTime: string): Promise<boolean> {
        const hourlySlots = await this.dailyHourAvailabilityRepository.getDailyHourAvailabilityByDate(date);
        const slotHour = parseInt(startTime.split(':')[0], 10);
        
        const matchingSlot = hourlySlots.hourly_slots.find((slot: DailyHourAvailability["hourly_slots"][number]) => slot.hour === slotHour);
        return matchingSlot ? matchingSlot.current_sessions < matchingSlot.max_sessions : false;
    }
    async createAppointmentByProfessional(bodyDto:CreateAppointmentDto){
        const body: Appointment = {
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: bodyDto.date_time,
            schedule: bodyDto.schedule,
            state: bodyDto.state as appointmentState,
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