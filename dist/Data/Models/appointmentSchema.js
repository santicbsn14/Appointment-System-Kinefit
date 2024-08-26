import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const appointmentSchema = new Schema({
    pacient_id: { type: Schema.Types.ObjectId, ref: 'pacients', required: true },
    professional_id: { type: Schema.Types.ObjectId, ref: 'professionals', required: true },
    date_time: { type: Schema.Types.Date, required: true },
    state: { type: Schema.Types.String, required: true },
    session_type: { type: Schema.Types.String, required: true }
});
appointmentSchema.plugin(paginate);
export default mongoose.model('appointments', appointmentSchema);
