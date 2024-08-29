import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface TimeSlots {
    start_time: string,
    end_time: string
}
export interface DaySchedule {
    week_day: string,
    time_slots: TimeSlots
}
export interface ProfessionalTimeSlots {
    _id?:mongoose.Types.ObjectId,
    professional_id: mongoose.Types.ObjectId;
    schedule: DaySchedule[];
    state: 'Disponible' | 'No disponible' | 'Vacaciones' | 'Feriado' | 'Licencia';
}

const professionalTimeSlotsSchema = new Schema<ProfessionalTimeSlots>({
    professional_id: { type: Schema.Types.ObjectId, ref: 'professional', required: true },
    schedule: [
        {
            week_day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], required: true },
            time_slots:{
                    start_time: { type: String, required: true },
                    end_time: { type: String, required: true }}
        }
    ],
    state: { 
        type: String, 
        enum: ['Disponible', 'No disponible', 'Vacaciones', "Feriado","Licencia"], 
        required: true, 
        default: 'Disponible'
    }
});

professionalTimeSlotsSchema.plugin(paginate);

export default mongoose.model<ProfessionalTimeSlots, PaginateModel<ProfessionalTimeSlots>>(
    'professional_time_slots', 
    professionalTimeSlotsSchema
);