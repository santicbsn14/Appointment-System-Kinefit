import { AppointmentModel } from '../Models/appointmentModel'
import { IAppointmentRepository } from './Interfaces/index'
import { IAppointment, AppointmentStatus, PaginationOptions, PaginatedResult } from '../../Domain/Entities/index'

const POPULATE_OPTS = [
  { path: 'patientId', populate: { path: 'userId', select: 'name email phone' }, select: 'phone userId' },
  { path: 'professionalId', populate: { path: 'userId', select: 'name email' } },
  { path: 'specialtyId' },
]

export class AppointmentMongooseRepository implements IAppointmentRepository {
  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<IAppointment>> {
    const { page = 1, limit = 10 } = options
    const result = await (AppointmentModel as any).paginate({}, { page, limit, populate: POPULATE_OPTS, lean: true, sort: { date: 1 } })
      if (result.docs.length > 0) {
  }
  
    return result
  }
  async getById(id: string): Promise<IAppointment | null> {
    return AppointmentModel.findById(id).populate(POPULATE_OPTS).lean()
  }
  async getByPatient(patientId: string, options: PaginationOptions = {}): Promise<PaginatedResult<IAppointment>> {
    const { page = 1, limit = 10 } = options
    const result = await (AppointmentModel as any).paginate({ patientId }, { page, limit, populate: POPULATE_OPTS, lean: true, sort: { date: 1 } })
    return result
  }
  async getByProfessional(professionalId: string, options: PaginationOptions = {}): Promise<PaginatedResult<IAppointment>> {
    const { page = 1, limit = 10 } = options
    const result = await (AppointmentModel as any).paginate({ professionalId }, { page, limit, populate: POPULATE_OPTS, lean: true, sort: { date: 1 } })
    return result
  }
  async getByProfessionalAndDate(professionalId: string, date: Date): Promise<IAppointment[]> {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    return AppointmentModel.find({
      professionalId,
      date: { $gte: start, $lte: end },
      status: { $in: [AppointmentStatus.Pending, AppointmentStatus.Approved] },
    }).populate(POPULATE_OPTS).lean()
  }
  async countActiveBySlot(professionalId: string, specialtyId: string, date: Date, timeFrom: string): Promise<number> {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    return AppointmentModel.countDocuments({
      professionalId, specialtyId,
      date: { $gte: start, $lte: end },
      timeFrom,
      status: { $in: [AppointmentStatus.Pending, AppointmentStatus.Approved] },
    })
  }
  async create(data: Omit<IAppointment, '_id' | 'createdAt'>): Promise<IAppointment> {
    const appointment = await AppointmentModel.create(data)
    return appointment.toObject()
  }
  async updateStatus(id: string, status: AppointmentStatus, extra: { cancelledBy?: string; secretaryNotes?: string } = {}): Promise<IAppointment | null> {
    return AppointmentModel.findByIdAndUpdate(id, { status, ...extra }, { new: true }).populate(POPULATE_OPTS).lean()
  }
  async delete(id: string): Promise<boolean> {
    const result = await AppointmentModel.findByIdAndDelete(id)
    return result !== null
  }
}