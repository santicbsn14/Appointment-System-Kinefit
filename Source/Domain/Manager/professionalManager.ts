import bcrypt from 'bcryptjs'
import { IProfessionalRepository } from '../../Data/Repositories/Interfaces/index'
import { IUserRepository } from '../../Data/Repositories/Interfaces/index'
import { IScheduleRepository } from '../../Data/Repositories/Interfaces/index'
import { IProfessional, ISchedule, Role } from '../Entities/index'
import { AppError } from '../../Utils/AppError'

interface CreateProfessionalDTO {
  name: string
  email: string
  password: string
  specialties: string[]
}

export class ProfessionalManager {
  private professionalRepository: IProfessionalRepository
  private userRepository: IUserRepository
  private scheduleRepository: IScheduleRepository

  constructor({ professionalRepository, userRepository, scheduleRepository }: {
    professionalRepository: IProfessionalRepository
    userRepository: IUserRepository
    scheduleRepository: IScheduleRepository
  }) {
    this.professionalRepository = professionalRepository
    this.userRepository = userRepository
    this.scheduleRepository = scheduleRepository
  }

  async getAll(): Promise<IProfessional[]> {
    return this.professionalRepository.getAll()
  }

  async getById(id: string): Promise<IProfessional> {
    const professional = await this.professionalRepository.getById(id)
    if (!professional) throw new AppError('Profesional no encontrado.', 404)
    return professional
  }

  async create(dto: CreateProfessionalDTO): Promise<IProfessional> {
    const existing = await this.userRepository.getByEmail(dto.email)
    if (existing) throw new AppError('El email ya está registrado.')

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await this.userRepository.create({
      name: dto.name, email: dto.email, password: hashedPassword, role: Role.Professional,
    })

    return this.professionalRepository.create({ userId: user._id as string, specialties: dto.specialties })
  }

  async addSpecialty(professionalId: string, specialtyId: string): Promise<IProfessional> {
    const professional = await this.professionalRepository.getById(professionalId)
    if (!professional) throw new AppError('Profesional no encontrado.', 404)

    const currentIds = (professional.specialties as any[]).map((s: any) => s._id ? s._id.toString() : s.toString())
    if (currentIds.includes(specialtyId)) throw new AppError('El profesional ya tiene esa especialidad asignada.')

    return (await this.professionalRepository.update(professionalId, { specialties: [...currentIds, specialtyId] }))!
  }

  async removeSpecialty(professionalId: string, specialtyId: string): Promise<IProfessional> {
    const professional = await this.professionalRepository.getById(professionalId)
    if (!professional) throw new AppError('Profesional no encontrado.', 404)

    const currentIds = (professional.specialties as any[]).map((s: any) => s._id ? s._id.toString() : s.toString())
    return (await this.professionalRepository.update(professionalId, { specialties: currentIds.filter((id) => id !== specialtyId) }))!
  }

  async setSchedule(professionalId: string, weeklySlots: ISchedule['weeklySlots']): Promise<ISchedule> {
    const professional = await this.professionalRepository.getById(professionalId)
    if (!professional) throw new AppError('Profesional no encontrado.', 404)

    const existing = await this.scheduleRepository.getByProfessionalId(professionalId)
    if (existing) return (await this.scheduleRepository.update(existing._id as string, { weeklySlots }))!

    const schedule = await this.scheduleRepository.create({ professionalId, weeklySlots })
    await this.professionalRepository.update(professionalId, { scheduleId: schedule._id as string })
    return schedule
  }

  async delete(id: string): Promise<boolean> {
    const professional = await this.professionalRepository.getById(id)
    if (!professional) throw new AppError('Profesional no encontrado.', 404)
    return this.professionalRepository.delete(id)
  }
}