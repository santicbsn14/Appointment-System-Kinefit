import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const medicalRecSchema = new Schema({
    pacient_id: { type: Schema.Types.ObjectId, ref: 'pacients', required: true },
    last_update: { type: Schema.Types.Date, required: true },
    notes: { type: Schema.Types.String, required: true },
    attachments: { type: Schema.Types.String, required: true }
});
medicalRecSchema.plugin(paginate);
export default mongoose.model('medical_records', medicalRecSchema);
