import mongoose, { Schema, Document } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { IPatient } from '../../Domain/Entities/index'

export type PatientDocument = Omit<IPatient, '_id'> & Document

const PatientSchema = new Schema<PatientDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    dni: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    medicalHistory: { type: String, default: '' },
  },
  { timestamps: true }
)

PatientSchema.plugin(mongoosePaginate)
export const PatientModel = mongoose.model<PatientDocument>('Patient', PatientSchema)