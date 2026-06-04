import mongoose, { Schema, Document } from 'mongoose'
import { ISpecialty, DayOfWeek } from '../../Domain/Entities/index'

export type SpecialtyDocument = Omit<ISpecialty, '_id'> & Document

const SpecialtySchema = new Schema<SpecialtyDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, required: true, min: 15 },
    maxCapacity: { type: Number, required: true, min: 1 },
    restriction: {
      hasRestriction: { type: Boolean, default: false },
      days: [{ type: String, enum: Object.values(DayOfWeek) }],
      timeFrom: { type: String, default: '' },
      timeTo: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

export const SpecialtyModel = mongoose.model<SpecialtyDocument>('Specialty', SpecialtySchema)