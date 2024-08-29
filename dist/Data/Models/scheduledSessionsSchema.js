import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const scheduledSessionsSchema = new Schema({
    professional_id: { type: Schema.Types.ObjectId, ref: 'professionals', required: true },
    pacient_id: { type: Schema.Types.ObjectId, ref: 'pacients', required: true },
    session_dates: [
        {
            week_day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], required: true },
            time_slots: {
                start_time: { type: String, required: true },
                end_time: { type: String, required: true }
            }
        }
    ],
    start_date: { type: Date, required: true },
    number_sessions: { type: Number, required: true },
    frequency: { type: String, required: true },
    state: { type: String, required: true }
});
scheduledSessionsSchema.plugin(paginate);
export default mongoose.model('scheduled_sessions', scheduledSessionsSchema);
