import container from "../../container";
import { appointmentState, type Appointment } from "../../Data/Models/appointmentSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createAppointmentValidation from "../Validations/CreatesValidation/createAppointmentValidation";
import { CreateAppointmentDto } from "typesRequestDtos";
import mongoose, { Error } from "mongoose";
import { ProfessionalTimeSlots } from "Source/Data/Models/professionalTimeSlotsSchema";
import { isAvailable } from "../../Utils/scheduleUtils";
import { DailyHourAvailability, HourlySlot } from "Source/Data/Models/dailyHourASchema";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/es.js'
import { get } from "http";

class AppointmentManager {
    private appointmentRepository
    private professionalTimeSlotRepository
    private dailyHourAvailabilityRepository
    private patientRepository 
    constructor(){
        this.patientRepository = container.resolve('PatientRepository')
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
    async getNextAppointmentAvailable(){
        
    }
    async createAppointmentByPatient(bodyDto: CreateAppointmentDto){
        let body : Appointment = {...bodyDto,
            pacient_id: bodyDto.pacient_id,
            professional_id: bodyDto.professional_id,
            date_time: new Date(bodyDto.date_time) as unknown as Dayjs,
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
        body.date_time= dayjs(bodyDto.date_time)
        return await this.appointmentRepository.createAppointment(body);
    }
    async createAppointmentByProfessional(bodyDto:CreateAppointmentDto){
        const body: Appointment = {
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: new Date(bodyDto.date_time) as unknown as Dayjs,
            schedule: bodyDto.schedule,
            state: bodyDto.state as appointmentState,
            session_type: bodyDto.session_type,
        };
        await createAppointmentValidation.parseAsync(body)
        let appointment = {...body, date_time:dayjs(bodyDto.date_time)}
        const appointmentDate = dayjs(appointment.date_time).startOf('day');
        
        const existingAppointments = await this.appointmentRepository.getAll({
            pacient_id: body.pacient_id,
            date_time: {
                $gte: appointmentDate.toDate(),  
                $lt: appointmentDate.add(1, 'day').toDate()  
            }
        });
        
        if (existingAppointments && existingAppointments.docs.length > 0) {
            throw new Error('El paciente ya tiene un turno asignado para esta fecha.');
        }
        appointment.state='Confirmado'
        let getPatientEmail = await this.patientRepository.getPatientById(body.pacient_id)
        let appointmentCreated = await this.appointmentRepository.createAppointment(appointment)
        return {getPatientEmail, appointmentCreated}
    }
    async createBulkAppointments(bulkAppointmentsDto: CreateAppointmentDto[]): Promise<{success: Appointment[], failed: string[]}> {
        const createdAppointments: Appointment[] = [];
        const failedAppointments: string[] = [];
    
        for (const bodyDto of bulkAppointmentsDto) {
            try {
                let body: Appointment = {
                    ...bodyDto,
                    pacient_id: bodyDto.pacient_id,
                    professional_id: bodyDto.professional_id,
                    date_time: dayjs(bodyDto.date_time),
                    schedule: {
                        week_day: bodyDto.schedule.week_day, 
                        time_slots: {
                            start_time: dayjs(bodyDto.schedule.time_slots.start_time), 
                            end_time: dayjs(bodyDto.schedule.time_slots.end_time)
                        }
                    },
                    state: 'Solicitado'
                };
    
                const proTimeSlots: ProfessionalTimeSlots = await this.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro(body.professional_id);
                if (!proTimeSlots) throw new Error('Professional not found');
    
                const isAvailableSlot = isAvailable(proTimeSlots.schedule, body.schedule);
                if (!isAvailableSlot) throw new Error('The professional does not work in that time slot');
    
                const isSlotAvailable = await this.isHourlySlotAvailable(body.date_time, body.schedule.time_slots.start_time, body.professional_id);
                if (!isSlotAvailable) throw new Error('No available slots for the selected time');
    
                body.state = 'Confirmado';
                const createdAppointment = await this.appointmentRepository.createAppointment(body);
                createdAppointments.push(createdAppointment);
    
            } catch (error) {
                if (typeof error === 'object' && error !== null && 'message' in error)
                failedAppointments.push(`Appointment for date ${bodyDto.date_time} failed: ${error.message instanceof Error}`);
            }
        }
    
        return { success: createdAppointments, failed: failedAppointments };
    }
     async isHourlySlotAvailable(date: dayjs.Dayjs, startTime: dayjs.Dayjs, professional_id?: IdMongo | string): Promise<boolean> {
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