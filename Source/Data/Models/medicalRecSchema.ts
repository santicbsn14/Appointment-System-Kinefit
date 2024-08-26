import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface MedicalRecord  {
    _id?: mongoose.Types.ObjectId,
    pacient_id: mongoose.Types.ObjectId,
    last_update: Date,
    notes: string,
    attachments: string
}

const medicalRecSchema = new Schema<MedicalRecord>({
    pacient_id: {type: Schema.Types.ObjectId, ref:'pacients', required: true},
    last_update: {type: Schema.Types.Date, required: true},
    notes: {type: Schema.Types.String, required: true},
    attachments: {type: Schema.Types.String, required: true}
})
medicalRecSchema.plugin(paginate)

export default mongoose.model<MedicalRecord>('medical_records', medicalRecSchema)