import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { DaySchedule } from './professionalTimeSlotsSchema';


export interface ScheduledSessions{
    _id?:  mongoose.Types.ObjectId,
    professional_id: mongoose.Types.ObjectId;
    pacient_id: mongoose.Types.ObjectId;
    session_dates: DaySchedule[];
    start_date: Date;
    next_date?: Date;
    number_sessions: number;
    state: string;
    frequency: string;
}

const scheduledSessionsSchema = new Schema<ScheduledSessions>({
    professional_id: { type: Schema.Types.ObjectId, ref: 'professionals', required: true },
    pacient_id: { type: Schema.Types.ObjectId, ref: 'pacients', required: true },
    session_dates: [
        {
            week_day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], required: true },
            time_slots:{
                    start_time: { type: String, required: true },
                    end_time: { type: String, required: true }}
        }
    ],
    start_date: { type: Date, required: true },
    next_date:{type: Date},
    number_sessions: { type: Number, required: true },
    frequency: { type: String, required: true },
    state: { type: String, required: true }
});

scheduledSessionsSchema.plugin(paginate);

export default mongoose.model<ScheduledSessions, PaginateModel<ScheduledSessions>>(
    'scheduled_sessions', 
    scheduledSessionsSchema
);