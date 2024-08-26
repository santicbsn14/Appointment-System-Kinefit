import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const professionalTimesSlots = new Schema({
    professional_id: { type: Schema.Types.ObjectId, ref: 'professional', required: true },
    week_day: { type: Schema.Types.Date, required: true },
    start_time: { type: Schema.Types.String, required: true },
    end_time: { type: Schema.Types.String, required: true },
    state: { type: Schema.Types.String, required: true, default: 'pending' }
});
professionalTimesSlots.plugin(paginate);
export default mongoose.model('professional_times_slots', professionalTimesSlots);
