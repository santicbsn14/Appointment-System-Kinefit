import mongoose, { Schema, Document } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { IAppointment, AppointmentStatus, CancelledBy } from '../../Domain/Entities/index'

export type AppointmentDocument = Omit<IAppointment, '_id'> & Document

const AppointmentSchema = new Schema<AppointmentDocument>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    professionalId: { type: Schema.Types.ObjectId, ref: 'Professional', required: true },
    specialtyId: { type: Schema.Types.ObjectId, ref: 'Specialty', required: true },
    date: { type: Date, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.Pending,
    },
    cancelledBy: {
      type: String,
      enum: [...Object.values(CancelledBy), null],
      default: null,
    },
    notes: { type: String, default: '' },
    secretaryNotes: { type: String, default: '' },
  },
  { timestamps: true }
)

AppointmentSchema.plugin(mongoosePaginate)
export const AppointmentModel = mongoose.model<AppointmentDocument>('Appointment', AppointmentSchema)