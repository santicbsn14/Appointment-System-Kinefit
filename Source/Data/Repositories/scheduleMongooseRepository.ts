import { ScheduleModel } from '../Models/scheduleModel'
import { IScheduleRepository } from './Interfaces/index'
import { ISchedule } from '../../Domain/Entities/index'

export class ScheduleMongooseRepository implements IScheduleRepository {
  async getByProfessionalId(professionalId: string): Promise<ISchedule | null> {
    return ScheduleModel.findOne({ professionalId }).lean()
  }
  async create(data: Omit<ISchedule, '_id' | 'createdAt'>): Promise<ISchedule> {
    const schedule = await ScheduleModel.create(data)
    return schedule.toObject()
  }
  async update(id: string, data: Partial<ISchedule>): Promise<ISchedule | null> {
    return ScheduleModel.findByIdAndUpdate(id, data, { new: true }).lean()
  }
}