import mongoose, { Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface ScheduledSessions{
    _id: mongoose.Types.ObjectId,
    professional_id: mongoose.Types.ObjectId,
    pacient_id: mongoose.Types.ObjectId,
    week_day: string,
    start_date: Date,
    number_sessions: number,
    state: string,
    frequency: string
}

const scheduledSessionsSchema = new Schema<ScheduledSessions>({
    professional_id: {type: Schema.Types.ObjectId, ref:'professionals', required: true},
    pacient_id: {type: Schema.Types.ObjectId, ref:'pacients', required: true},
    week_day:{type: Schema.Types.String, required:true},
    start_date: {type: Schema.Types.Date, required:true},
    number_sessions: {type: Schema.Types.Number, required: true},
    frequency:{type: Schema.Types.String, required:true},
    state: {type: Schema.Types.String, required:true}
})

scheduledSessionsSchema.plugin(paginate)

export default mongoose.model<ScheduledSessions>('scheduled_sessions', scheduledSessionsSchema)