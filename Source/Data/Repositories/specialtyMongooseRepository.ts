import { SpecialtyModel } from '../Models/specialtyModel'
import { ISpecialtyRepository } from './Interfaces/index'
import { ISpecialty } from '../../Domain/Entities/index'

export class SpecialtyMongooseRepository implements ISpecialtyRepository {
  async getAll(): Promise<ISpecialty[]> {
    return SpecialtyModel.find().lean()
  }
  async getById(id: string): Promise<ISpecialty | null> {
    return SpecialtyModel.findById(id).lean()
  }
  async create(data: Omit<ISpecialty, '_id' | 'createdAt'>): Promise<ISpecialty> {
    const specialty = await SpecialtyModel.create(data)
    return specialty.toObject()
  }
  async update(id: string, data: Partial<ISpecialty>): Promise<ISpecialty | null> {
    return SpecialtyModel.findByIdAndUpdate(id, data, { new: true }).lean()
  }
  async delete(id: string): Promise<boolean> {
    const result = await SpecialtyModel.findByIdAndDelete(id)
    return result !== null
  }
}