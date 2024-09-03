import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const appointmentSchema = new Schema({
    pacient_id: { type: Schema.Types.ObjectId, ref: 'pacients', required: true },
    professional_id: { type: Schema.Types.ObjectId, ref: 'professionals', required: true },
    date_time: { type: Schema.Types.Date, required: true },
    schedule: {
        week_day: { type: Number, min: 0, max: 6, required: true },
        time_slots: {
            start_time: { type: Date, required: true },
            end_time: { type: Date, required: true }
        }
    },
    state: { type: Schema.Types.String, required: true, default: 'Solicitado' },
    session_type: { type: Schema.Types.String, required: true }
});
appointmentSchema.plugin(paginate);
export default mongoose.model('appointments', appointmentSchema);
