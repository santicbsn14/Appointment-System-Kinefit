export interface CreateAppointmentDto {
    pacient_id: string;          
    professional_id: string;     
    date_time: Date;             
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
export interface CreateScheduledSessionsDto{
    professional_id: string,
    pacient_id: string,
    week_day: string,
    start_date: Date,
    number_sessions: number,
    state: string,
    frequency: string
}
export interface CreateMedicalRecordDto{
    pacient_id: string,
    last_update: Date,
    notes: string,
    attachments: string
}


