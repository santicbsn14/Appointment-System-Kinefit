import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { DaySchedule } from './professionalTimeSlotsSchema';
export type appointmentState = 'Solicitado' |'Confirmado' | 'Completado' | 'Cancelado'
export interface Appointment {
    _id?: mongoose.Types.ObjectId,
    pacient_id: mongoose.Types.ObjectId,
    professional_id: mongoose.Types.ObjectId,
    date_time: Date,
    schedule: DaySchedule,
    state: appointmentState,
    session_type: string
}

const appointmentSchema = new Schema<Appointment>({
    pacient_id: {type: Schema.Types.ObjectId, ref:'pacients', required: true},
    professional_id: {type: Schema.Types.ObjectId, ref:'professionals', required: true},
    date_time: {type: Schema.Types.Date, required:true},
    schedule:{
        week_day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], required: true },
        time_slots:{
                start_time: { type: String, required: true },
                end_time: { type: String, required: true }}
    },
    state: {type: Schema.Types.String, required: true, default:'Solicitado'},
    session_type:{type: Schema.Types.String, required: true}
})

appointmentSchema.plugin(paginate)

export default mongoose.model<Appointment>('appointments', appointmentSchema)