import mongoose, { Schema, Document, PaginateModel } from 'mongoose'
import { paginate } from 'mongoose-paginate-v2';

export interface DailyHourAvailability {
    _id?: mongoose.Types.ObjectId;
    professional_id: mongoose.Types.ObjectId;
    date: Date;
    hourly_slots: {
        hour: number; // 0-23
        max_sessions: number;
        current_sessions: number;
    }[];
}
const dailyHourAvailabilitySchema = new Schema<DailyHourAvailability>({
    professional_id: { type: mongoose.Schema.Types.ObjectId, ref: 'professionals', required: true },
    date: { type: Date, required: true, index: true },
    hourly_slots: [{
        hour: { type: Number, required: true, min: 0, max: 23 },
        max_sessions: { type: Number, required: true, min: 1 },
        current_sessions: { type: Number, default: 0, min: 0 }
    }]
});
// dailyHourAvailabilitySchema.plugin(paginate)
export default mongoose.model<DailyHourAvailability>('dayly_hour_availability', dailyHourAvailabilitySchema )