import z from 'zod';
import mongoose from 'mongoose';
import idValidation from '../idValidation';

// Enum for WeekDay
const weekDayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

// Enum for State
const stateEnum = z.enum(['Disponible', 'No disponible', 'Vacaciones', 'Feriado', 'Licencia']);

// TimeSlot schema
const timeSlotSchema = z.object({
  start_time: z.string().nonempty("Start time is required"),
  end_time: z.string().nonempty("End time is required"),
});

// DaySchedule schema
const dayScheduleSchema = z.object({
  week_day: weekDayEnum,
  time_slots: timeSlotSchema,
});

// Main schema for ProfessionalTimeSlots
const createProfessionalTimeSlotsValidation = z.object({
  professional_id: idValidation,
  schedule: z.array(dayScheduleSchema),
  state: stateEnum.default('Disponible'),
});

export default createProfessionalTimeSlotsValidation;
