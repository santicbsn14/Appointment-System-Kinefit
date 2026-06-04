import mongoose, { Schema, Document } from 'mongoose'
import { IProfessional } from '../../Domain/Entities/index'

export type ProfessionalDocument = Omit<IProfessional, '_id'> & Document

const ProfessionalSchema = new Schema<ProfessionalDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialties: [{ type: Schema.Types.ObjectId, ref: 'Specialty' }],
    scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule', default: null },
  },
  { timestamps: true }
)

export const ProfessionalModel = mongoose.model<ProfessionalDocument>('Professional', ProfessionalSchema)