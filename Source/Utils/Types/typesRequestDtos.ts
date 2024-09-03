
import { DaySchedule } from "Source/Data/Models/professionalTimeSlotsSchema";
export interface CreateAppointmentDto {
    pacient_id: string;          
    professional_id: string;     
    date_time: Date;
    schedule: DaySchedule;             
    state: string;               
    session_type: string;        
}
export interface CreateProfessionalDto{
    user_id: string
}
export interface CreatePatientDto{
    user_id: string,
    mutual?: string,
    clinical_data: unknown
}
export interface CreateProfessionalTimeSlotsDto {
    professional_id: string;
    schedule:DaySchedule[],
    state: string;
}
export interface CreateMedicalRecordDto{
    pacient_id: string,
    last_update: Date,
    notes: string,
    attachments: string
}
export interface CreateNotificationDto{
    appointment_id:  string,
    type: string,
    state: string,
    date_send: Date,
    note: string
}
export interface CreateDailyHourAvailabilityDto{
    professional_id: string;
    date: Date;
    hourly_slots: {
        hour: number; // 0-23
        max_sessions: number;
        current_sessions: number;
    }[];
}
export interface CreateRoleDto{
    name: string,
    id: string,
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
    role: string,
    phone: number,
}
export interface userAuth {
    user: {
        email: string,
        password: string
    }
}
export type userLogin = {
    email:string,
    password: string
}