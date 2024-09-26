import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Dayjs } from 'dayjs';

export interface TimeSlot {
    start_time: Dayjs;
    end_time: Dayjs;
}

export interface DaySchedule {
    week_day: number; 
    time_slots: TimeSlot;
}

export interface ProfessionalTimeSlots {
    _id?: mongoose.Types.ObjectId;
    professional_id: mongoose.Types.ObjectId | string;
    schedule: DaySchedule[];
    state: 'Disponible' | 'No disponible' | 'Vacaciones' | 'Feriado' | 'Licencia';
    date_range?: {
        start_date: Dayjs;
        end_date: Dayjs;
    };
}

const professionalTimeSlotsSchema = new Schema<ProfessionalTimeSlots>({
    professional_id: { type: Schema.Types.ObjectId, ref: 'professional', required: true },
    schedule: [
        {
            week_day: { type: Number, min: 0, max: 6, required: true }, 
            time_slots: {
                start_time: { type: Date, required: true },
                end_time: { type: Date, required: true }
            }
        }
    ],
    state: { 
        type: String, 
        enum: ['Disponible', 'No disponible', 'Vacaciones', "Feriado", "Licencia"], 
        required: true, 
        default: 'Disponible'
    },
    date_range: {start_date: {type: Date}, end_date:{type: Date}}
});
professionalTimeSlotsSchema.plugin(paginate);

export default mongoose.model<ProfessionalTimeSlots, PaginateModel<ProfessionalTimeSlots>>(
    'professional_time_slots', 
    professionalTimeSlotsSchema
);