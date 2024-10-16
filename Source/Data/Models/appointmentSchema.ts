import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Dayjs } from 'dayjs';
import { DaySchedule } from './professionalTimeSlotsSchema';
export type appointmentState = 'Solicitado' |'Confirmado' | 'Completado' | 'Cancelado'
export interface Appointment {
    _id?: mongoose.Types.ObjectId,
    pacient_id: mongoose.Types.ObjectId | string,
    professional_id: mongoose.Types.ObjectId | string,
    date_time: Dayjs,
    schedule: DaySchedule,
    state: appointmentState,
    session_type: string,
    order_photo?: string
}

const appointmentSchema = new Schema<Appointment>({
    pacient_id: {type: Schema.Types.ObjectId, ref:'patients', required: true},
    professional_id: {type: Schema.Types.ObjectId, ref:'professionals', required: true},
    date_time: {type: Schema.Types.Date, required:true},
    schedule:{
        week_day: { type: Number, min: 0, max: 6, required: true }, 
        time_slots: {
            start_time: { type: Date, required: true },
            end_time: { type: Date, required: true }
        }
    },
    state: {type: Schema.Types.String, required: true, default:'Solicitado'},
    order_photo:{type: Schema.Types.String},
    session_type:{type: Schema.Types.String, required: true}
})

appointmentSchema.plugin(paginate)

export default mongoose.model<Appointment>('appointments', appointmentSchema)