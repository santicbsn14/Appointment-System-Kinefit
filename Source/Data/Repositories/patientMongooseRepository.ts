import { PatientModel } from '../Models/patientModel'
import { IPatientRepository } from './Interfaces/index'
import { IPatient, PaginationOptions, PaginatedResult } from '../../Domain/Entities/index'

export class PatientMongooseRepository implements IPatientRepository {
  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<IPatient>> {
    const { page = 1, limit = 10 } = options
    const result = await (PatientModel as any).paginate({}, { page, limit, populate: 'userId', lean: true })
    return result
  }
  async getById(id: string): Promise<IPatient | null> {
    return PatientModel.findById(id).populate('userId').lean()
  }
  async getByUserId(userId: string): Promise<IPatient | null> {
    return PatientModel.findOne({ userId }).populate('userId').lean()
  }
  async create(data: Omit<IPatient, '_id' | 'createdAt'>): Promise<IPatient> {
    const patient = await PatientModel.create(data)
    return patient.toObject()
  }
  async update(id: string, data: Partial<IPatient>): Promise<IPatient | null> {
    return PatientModel.findByIdAndUpdate(id, data, { new: true }).lean()
  }
  async delete(id: string): Promise<boolean> {
    const result = await PatientModel.findByIdAndDelete(id)
    return result !== null
  }
}