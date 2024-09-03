import container from "../../container";
import { appointmentState, type Appointment } from "../../Data/Models/appointmentSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createAppointmentValidation from "../Validations/CreatesValidation/createAppointmentValidation";
import { CreateAppointmentDto } from "typesRequestDtos";
import mongoose from "mongoose";
import { ProfessionalTimeSlots } from "Source/Data/Models/professionalTimeSlotsSchema";
import { isAvailable } from "../../Utils/scheduleUtils";
import { DailyHourAvailability, HourlySlot } from "Source/Data/Models/dailyHourASchema";
import dayjs from "dayjs";
import 'dayjs/locale/es.js'

class AppointmentManager {
    private appointmentRepository
    private professionalTimeSlotRepository
    private dailyHourAvailabilityRepository
    constructor(){
        this.appointmentRepository = container.resolve('AppointmentRepository');
        this.professionalTimeSlotRepository = container.resolve('ProfessionalTimeSlotsRepository')
        this.dailyHourAvailabilityRepository = container.resolve('DailyHourAvailabilityRepository')
    }
    async getAll(criteria: Criteria){
       return await this.appointmentRepository.getAll(criteria)
    }
    async getAppointmentById(id: string){
        let aid = new mongoose.Types.ObjectId(id)
        await idValidation.parseAsync(aid)
        return await this.appointmentRepository.getAppointmentById(aid)
    }
    async createAppointmentByPatient(bodyDto: CreateAppointmentDto){
        let body : Appointment = {...bodyDto,
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: dayjs(bodyDto.date_time),
            schedule: {week_day: bodyDto.schedule.week_day, time_slots:{start_time: dayjs(bodyDto.schedule.time_slots.start_time), end_time: dayjs(bodyDto.schedule.time_slots.end_time)}},
            state:'Solicitado'
        }
        await createAppointmentValidation.parseAsync(body)
        const proTimeSlots : ProfessionalTimeSlots = await this.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro(body.professional_id);
        if (!proTimeSlots) throw new Error('Professional not found');

        const isAvailableSlot = isAvailable(proTimeSlots.schedule, body.schedule);
        if (!isAvailableSlot) throw new Error('The professional does not work in that time slot');

        const isSlotAvailable = await this.isHourlySlotAvailable(body.date_time, body.schedule.time_slots.start_time, body.professional_id);
        if (!isSlotAvailable) throw new Error('No available slots for the selected time');
    
        body.state = 'Confirmado';
        return await this.appointmentRepository.createAppointment(body);
    }
    private async isHourlySlotAvailable(date: dayjs.Dayjs, startTime: dayjs.Dayjs, professional_id?: IdMongo): Promise<boolean> {
        const hourlySlots: DailyHourAvailability = await this.dailyHourAvailabilityRepository.getDailyHourAvailabilityByDate(date, professional_id);
        const slotHour = startTime.toDate().getUTCHours(); 
        
        const matchingSlotIndex = hourlySlots.hourly_slots.findIndex((slot: HourlySlot) => slot.hour === slotHour);
        const slot = hourlySlots.hourly_slots[matchingSlotIndex]
        if(matchingSlotIndex !== -1){
            if(slot.current_sessions<slot.max_sessions){
                const updatedHourlySlots = [...hourlySlots.hourly_slots];
                updatedHourlySlots[matchingSlotIndex] = {
                    hour: slot.hour,
                    max_sessions:slot.max_sessions,
                    current_sessions: slot.current_sessions + 1,
                };
                hourlySlots.hourly_slots = updatedHourlySlots;
                console.log(hourlySlots)
                await this.dailyHourAvailabilityRepository.updateDailyHourAvailability(hourlySlots._id, hourlySlots);
                return true;
            }
        }else{
            let new_slot= {hour:slotHour,
                max_sessions:6,
                current_sessions:1
            }
            hourlySlots.hourly_slots.push(new_slot)
            await this.dailyHourAvailabilityRepository.updateDailyHourAvailability(hourlySlots._id, hourlySlots);
            return true
        }
    return false
    }
    async createAppointmentByProfessional(bodyDto:CreateAppointmentDto){
        const body: Appointment = {
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: dayjs(bodyDto.date_time),
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