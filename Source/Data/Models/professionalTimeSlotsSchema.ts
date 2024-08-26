import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface ProfessionalTimesSlots{
    _id: mongoose.Types.ObjectId,
    professional_id: mongoose.Types.ObjectId,
    week_day: Date,
    start_time: string,
    end_time: string,
    state: string
}

const professionalTimesSlots = new Schema<ProfessionalTimesSlots>({
    professional_id: {type: Schema.Types.ObjectId, ref:'professional', required: true},
    week_day: {type: Schema.Types.Date, required: true},
    start_time: {type: Schema.Types.String, required: true},
    end_time: {type: Schema.Types.String, required: true},
    state: {type: Schema.Types.String, required: true, default:'pending'}
})
professionalTimesSlots.plugin(paginate)
export default mongoose.model<ProfessionalTimesSlots>('professional_times_slots', professionalTimesSlots)