import z from 'zod';
import idValidation from '../idValidation.js';
import dayjs from 'dayjs';
const timeSlotSchema = z.object({
    start_time: z.preprocess((val) => {
        if (typeof val === 'string' || val instanceof Date) {
            return dayjs(val);
        }
        return val;
    }, z.custom((val) => dayjs.isDayjs(val) && val.isValid(), {
        message: "Invalid start_time",
    })),
    end_time: z.preprocess((val) => {
        if (typeof val === 'string' || val instanceof Date) {
            return dayjs(val);
        }
        return val;
    }, z.custom((val) => dayjs.isDayjs(val) && val.isValid(), {
        message: "Invalid end_time",
    })),
});

// Definir el esquema para DaySchedule
const dayScheduleSchema = z.object({
    week_day: z.number().min(0).max(6), 
    time_slots: timeSlotSchema, 
});

const createAppointmentValidation = z.object({
    pacient_id: idValidation,
    professional_id: idValidation,
    date_time: z.date(),
    state: z.string(),
    schedule:dayScheduleSchema,
    session_type: z.string()
  });
export default createAppointmentValidation;
