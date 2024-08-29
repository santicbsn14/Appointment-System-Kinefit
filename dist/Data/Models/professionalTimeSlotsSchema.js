import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const professionalTimeSlotsSchema = new Schema({
    professional_id: { type: Schema.Types.ObjectId, ref: 'professional', required: true },
    schedule: [
        {
            week_day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], required: true },
            time_slots: {
                start_time: { type: String, required: true },
                end_time: { type: String, required: true }
            }
        }
    ],
    state: {
        type: String,
        enum: ['Disponible', 'No disponible', 'Vacaciones', "Feriado", "Licencia"],
        required: true,
        default: 'Disponible'
    }
});
professionalTimeSlotsSchema.plugin(paginate);
export default mongoose.model('professional_time_slots', professionalTimeSlotsSchema);
