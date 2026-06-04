import mongoose, { Schema, Document } from 'mongoose'
import { ISchedule, DayOfWeek } from '../../Domain/Entities/index'

export type ScheduleDocument = Omit<ISchedule, '_id'> & Document

const WeeklySlotSchema = new Schema(
  {
    day: { type: String, enum: Object.values(DayOfWeek), required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
)

const ScheduleSchema = new Schema<ScheduleDocument>(
  {
    professionalId: { type: Schema.Types.ObjectId, ref: 'Professional', required: true, unique: true },
    weeklySlots: [WeeklySlotSchema],
  },
  { timestamps: true }
)

export const ScheduleModel = mongoose.model<ScheduleDocument>('Schedule', ScheduleSchema)