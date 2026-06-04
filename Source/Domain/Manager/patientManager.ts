import { IPatientRepository } from '../../Data/Repositories/Interfaces/index'
import { IPatient, PaginationOptions, PaginatedResult } from '../Entities/index'
import { AppError } from '../../Utils/AppError'

export class PatientManager {
  private patientRepository: IPatientRepository

  constructor({ patientRepository }: { patientRepository: IPatientRepository }) {
    this.patientRepository = patientRepository
  }

  async getAll(options?: PaginationOptions): Promise<PaginatedResult<IPatient>> {
    return this.patientRepository.getAll(options)
  }

  async getById(id: string): Promise<IPatient> {
    const patient = await this.patientRepository.getById(id)
    if (!patient) throw new AppError('Paciente no encontrado.', 404)
    return patient
  }

  async update(id: string, data: { medicalHistory?: string }): Promise<IPatient> {
    const patient = await this.patientRepository.getById(id)
    if (!patient) throw new AppError('Paciente no encontrado.', 404)
    const updated = await this.patientRepository.update(id, data)
    return updated!
  }
}