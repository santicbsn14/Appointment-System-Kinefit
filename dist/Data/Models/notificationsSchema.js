import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const notificationSchema = new Schema({
    appointment_id: { type: Schema.Types.ObjectId, ref: 'appointments', required: true },
    type: { type: Schema.Types.String, required: true },
    state: { type: Schema.Types.String, required: true },
    date_send: { type: Schema.Types.Date, required: true },
    note: { type: Schema.Types.String, required: true }
});
notificationSchema.plugin(paginate);
export default mongoose.model('notifications', notificationSchema);
