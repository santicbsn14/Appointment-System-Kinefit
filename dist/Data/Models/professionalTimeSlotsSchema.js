import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const professionalTimeSlotsSchema = new Schema({
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
    date_range: { start_date: { type: Date }, end_date: { type: Date } }
});
professionalTimeSlotsSchema.plugin(paginate);
export default mongoose.model('professional_time_slots', professionalTimeSlotsSchema);
