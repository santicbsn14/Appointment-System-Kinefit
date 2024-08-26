import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface Notification {
    _id?:  mongoose.Types.ObjectId,
    appointment_id:  mongoose.Types.ObjectId,
    type: string,
    state: string,
    date_send: Date,
    note: string
}

const notificationSchema = new Schema<Notification>({
    appointment_id: {type: Schema.Types.ObjectId, ref:'appointments', required: true},
    type: {type: Schema.Types.String, required:true},
    state:{type: Schema.Types.String, required:true},
    date_send: {type: Schema.Types.Date, required: true},
    note: {type: Schema.Types.String, required:true}
})
notificationSchema.plugin(paginate)

export default mongoose.model('notifications', notificationSchema)