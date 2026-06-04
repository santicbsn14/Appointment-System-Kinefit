import { ProfessionalModel } from '../Models/professionalModel'
import { IProfessionalRepository } from './Interfaces/index'
import { IProfessional } from '../../Domain/Entities/index'

export class ProfessionalMongooseRepository implements IProfessionalRepository {
  async getAll(): Promise<IProfessional[]> {
    return ProfessionalModel.find().populate('userId').populate('specialties').populate('scheduleId').lean()
  }
  async getById(id: string): Promise<IProfessional | null> {
    return ProfessionalModel.findById(id).populate('userId').populate('specialties').populate('scheduleId').lean()
  }
  async getByUserId(userId: string): Promise<IProfessional | null> {
    return ProfessionalModel.findOne({ userId }).populate('userId').populate('specialties').populate('scheduleId').lean()
  }
  async create(data: Omit<IProfessional, '_id' | 'createdAt'>): Promise<IProfessional> {
    const professional = await ProfessionalModel.create(data)
    return professional.toObject()
  }
  async update(id: string, data: Partial<IProfessional>): Promise<IProfessional | null> {
    return ProfessionalModel.findByIdAndUpdate(id, data, { new: true }).populate('userId').populate('specialties').lean()
  }
  async delete(id: string): Promise<boolean> {
    const result = await ProfessionalModel.findByIdAndDelete(id)
    return result !== null
  }
}