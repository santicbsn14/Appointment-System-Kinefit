import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const scheduledSessionsSchema = new Schema({
    professional_id: { type: Schema.Types.ObjectId, ref: 'professionals', required: true },
    pacient_id: { type: Schema.Types.ObjectId, ref: 'pacients', required: true },
    week_day: { type: Schema.Types.String, required: true },
    start_date: { type: Schema.Types.Date, required: true },
    number_sessions: { type: Schema.Types.Number, required: true },
    frequency: { type: Schema.Types.String, required: true },
    state: { type: Schema.Types.String, required: true }
});
scheduledSessionsSchema.plugin(paginate);
export default mongoose.model('scheduled_sessions', scheduledSessionsSchema);
