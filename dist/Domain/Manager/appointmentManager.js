import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createAppointmentValidation from "../Validations/CreatesValidation/createAppointmentValidation.js";
import mongoose, { Error } from "mongoose";
import { isAvailable } from "../../Utils/scheduleUtils.js";
import dayjs from "dayjs";
import 'dayjs/locale/es.js';
class AppointmentManager {
    constructor() {
        this.appointmentRepository = container.resolve('AppointmentRepository');
        this.professionalTimeSlotRepository = container.resolve('ProfessionalTimeSlotsRepository');
        this.dailyHourAvailabilityRepository = container.resolve('DailyHourAvailabilityRepository');
    }
    async getAll(criteria) {
        return await this.appointmentRepository.getAll(criteria);
    }
    async getAppointmentById(id) {
        let aid = new mongoose.Types.ObjectId(id);
        await idValidation.parseAsync(aid);
        return await this.appointmentRepository.getAppointmentById(aid);
    }
    async getNextAppointmentAvailable() {
    }
    async createAppointmentByPatient(bodyDto) {
        let body = { ...bodyDto,
            pacient_id: bodyDto.pacient_id,
            professional_id: bodyDto.professional_id,
            date_time: new Date(bodyDto.date_time),
            schedule: { week_day: bodyDto.schedule.week_day, time_slots: { start_time: dayjs(bodyDto.schedule.time_slots.start_time), end_time: dayjs(bodyDto.schedule.time_slots.end_time) } },
            state: 'Solicitado' };
        await createAppointmentValidation.parseAsync(body);
        const proTimeSlots = await this.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro(body.professional_id);
        if (!proTimeSlots)
            throw new Error('Professional not found');
        const isAvailableSlot = isAvailable(proTimeSlots.schedule, body.schedule);
        if (!isAvailableSlot)
            throw new Error('The professional does not work in that time slot');
        const isSlotAvailable = await this.isHourlySlotAvailable(body.date_time, body.schedule.time_slots.start_time, body.professional_id);
        if (!isSlotAvailable)
            throw new Error('No available slots for the selected time');
        body.state = 'Confirmado';
        body.date_time = dayjs(bodyDto.date_time);
        return await this.appointmentRepository.createAppointment(body);
    }
    async createAppointmentByProfessional(bodyDto) {
        const body = {
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date_time: new Date(bodyDto.date_time),
            schedule: bodyDto.schedule,
            state: bodyDto.state,
            session_type: bodyDto.session_type,
        };
        await createAppointmentValidation.parseAsync(body);
        let appointment = { ...body, date_time: dayjs(bodyDto.date_time) };
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
        appointment.state = 'Confirmado';
        return await this.appointmentRepository.createAppointment(appointment);
    }
    async createBulkAppointments(bulkAppointmentsDto) {
        const createdAppointments = [];
        const failedAppointments = [];
        for (const bodyDto of bulkAppointmentsDto) {
            try {
                let body = {
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
                const proTimeSlots = await this.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro(body.professional_id);
                if (!proTimeSlots)
                    throw new Error('Professional not found');
                const isAvailableSlot = isAvailable(proTimeSlots.schedule, body.schedule);
                if (!isAvailableSlot)
                    throw new Error('The professional does not work in that time slot');
                const isSlotAvailable = await this.isHourlySlotAvailable(body.date_time, body.schedule.time_slots.start_time, body.professional_id);
                if (!isSlotAvailable)
                    throw new Error('No available slots for the selected time');
                body.state = 'Confirmado';
                const createdAppointment = await this.appointmentRepository.createAppointment(body);
                createdAppointments.push(createdAppointment);
            }
            catch (error) {
                if (typeof error === 'object' && error !== null && 'message' in error)
                    failedAppointments.push(`Appointment for date ${bodyDto.date_time} failed: ${error.message instanceof Error}`);
            }
        }
        return { success: createdAppointments, failed: failedAppointments };
    }
    async isHourlySlotAvailable(date, startTime, professional_id) {
        const hourlySlots = await this.dailyHourAvailabilityRepository.getDailyHourAvailabilityByDate(date, professional_id);
        const slotHour = startTime.toDate().getUTCHours();
        const matchingSlotIndex = hourlySlots.hourly_slots.findIndex((slot) => slot.hour === slotHour);
        const slot = hourlySlots.hourly_slots[matchingSlotIndex];
        if (matchingSlotIndex !== -1) {
            if (slot.current_sessions < slot.max_sessions) {
                const updatedHourlySlots = [...hourlySlots.hourly_slots];
                updatedHourlySlots[matchingSlotIndex] = {
                    hour: slot.hour,
                    max_sessions: slot.max_sessions,
                    current_sessions: slot.current_sessions + 1,
                };
                hourlySlots.hourly_slots = updatedHourlySlots;
                await this.dailyHourAvailabilityRepository.updateDailyHourAvailability(hourlySlots._id, hourlySlots);
                return true;
            }
        }
        else {
            let new_slot = { hour: slotHour,
                max_sessions: 6,
                current_sessions: 1
            };
            hourlySlots.hourly_slots.push(new_slot);
            await this.dailyHourAvailabilityRepository.updateDailyHourAvailability(hourlySlots._id, hourlySlots);
            return true;
        }
        return false;
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
