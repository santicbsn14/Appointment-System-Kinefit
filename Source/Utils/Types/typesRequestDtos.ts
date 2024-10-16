
import mongoose, { ObjectId } from "mongoose";
import { Appointment } from "Source/Data/Models/appointmentSchema";
import { DaySchedule } from "Source/Data/Models/professionalTimeSlotsSchema";
export interface CreateAppointmentDto {
    pacient_id: mongoose.Types.ObjectId | string;          
    professional_id: mongoose.Types.ObjectId | string;     
    date_time: Date;
    schedule: DaySchedule;             
    state: string;
    order_photo: string;               
    session_type: string;        
}
export interface CreateProfessionalDto{
    user_id:  mongoose.Types.ObjectId | string,
    specialties: string[]
}
export interface CreatePatientDto{
    user_id: mongoose.Types.ObjectId | string,
    mutual?: string,
    clinical_data: unknown
}
export interface TimeSlot {
    start_time: string;
    end_time: number;
}

export interface DayScheduleDto {
    week_day: number; 
    time_slots: TimeSlot;
}
export interface CreateProfessionalTimeSlotsDto {
    professional_id: mongoose.Types.ObjectId | string,
    schedule:DayScheduleDto[],
    state: string;
}
export interface CreateMedicalRecordDto{
    pacient_id: string,
    last_update: Date,
    notes: string,
    attachments: string
}
export interface CreateNotificationDto{
    appointment_id:  mongoose.Types.ObjectId | string,
    type: string,
    state: string,
    date_send: Date,
    note: string
}
export interface CreateDailyHourAvailabilityDto{
    professional_id: mongoose.Types.ObjectId | string,
    date: Date;
    hourly_slots: {
        hour: number; // 0-23
        max_sessions: number;
        current_sessions: number;
    }[];
}
export interface CreateRoleDto{
    name: string,
    id?: string,
    permissions:string[]
}
export interface CreateUserDto{
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string,
    age: number,
    dni: number,
    homeAdress: number,
    role: mongoose.Types.ObjectId | string,
    phone: number,
}
export interface userAuth {
    user: {
        email: string,
        password: string
    }
}



export interface AuthenticatedRequest<T = unknown> extends Omit<Request, 'body'> {
    user?: userAuth;
    body: T;
}

export type userLogin = {
    email:string,
    password: string
}
