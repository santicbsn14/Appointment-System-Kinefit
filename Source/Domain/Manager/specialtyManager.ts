import { ISpecialtyRepository } from '../../Data/Repositories/Interfaces/index'
import { ISpecialty } from '../Entities/index'
import { AppError } from '../../Utils/AppError'

export class SpecialtyManager {
  private specialtyRepository: ISpecialtyRepository

  constructor({ specialtyRepository }: { specialtyRepository: ISpecialtyRepository }) {
    this.specialtyRepository = specialtyRepository
  }

  async getAll(): Promise<ISpecialty[]> {
    return this.specialtyRepository.getAll()
  }

  async getById(id: string): Promise<ISpecialty> {
    const specialty = await this.specialtyRepository.getById(id)
    if (!specialty) throw new AppError('Especialidad no encontrada.', 404)
    return specialty
  }

  async create(data: Omit<ISpecialty, '_id' | 'createdAt'>): Promise<ISpecialty> {
    return this.specialtyRepository.create(data)
  }

  async update(id: string, data: Partial<ISpecialty>): Promise<ISpecialty> {
    const updated = await this.specialtyRepository.update(id, data)
    if (!updated) throw new AppError('Especialidad no encontrada.', 404)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const exists = await this.specialtyRepository.getById(id)
    if (!exists) throw new AppError('Especialidad no encontrada.', 404)
    return this.specialtyRepository.delete(id)
  }
}