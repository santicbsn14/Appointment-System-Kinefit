import {
  IUser, IPatient, ISpecialty, ISchedule, IProfessional, IAppointment,
  AppointmentStatus, PaginationOptions, PaginatedResult,
} from '../../../Domain/Entities/index'

export interface IUserRepository {
  getAll(options?: PaginationOptions): Promise<PaginatedResult<IUser>>
  getById(id: string): Promise<IUser | null>
  getByEmail(email: string): Promise<IUser | null>
  create(data: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser>
  update(id: string, data: Partial<IUser>): Promise<IUser | null>
  delete(id: string): Promise<boolean>
}

export interface IPatientRepository {
  getAll(options?: PaginationOptions): Promise<PaginatedResult<IPatient>>
  getById(id: string): Promise<IPatient | null>
  getByUserId(userId: string): Promise<IPatient | null>
  create(data: Omit<IPatient, '_id' | 'createdAt'>): Promise<IPatient>
  update(id: string, data: Partial<IPatient>): Promise<IPatient | null>
  delete(id: string): Promise<boolean>
}

export interface ISpecialtyRepository {
  getAll(): Promise<ISpecialty[]>
  getById(id: string): Promise<ISpecialty | null>
  create(data: Omit<ISpecialty, '_id' | 'createdAt'>): Promise<ISpecialty>
  update(id: string, data: Partial<ISpecialty>): Promise<ISpecialty | null>
  delete(id: string): Promise<boolean>
}

export interface IScheduleRepository {
  getByProfessionalId(professionalId: string): Promise<ISchedule | null>
  create(data: Omit<ISchedule, '_id' | 'createdAt'>): Promise<ISchedule>
  update(id: string, data: Partial<ISchedule>): Promise<ISchedule | null>
}

export interface IProfessionalRepository {
  getAll(): Promise<IProfessional[]>
  getById(id: string): Promise<IProfessional | null>
  getByUserId(userId: string): Promise<IProfessional | null>
  create(data: Omit<IProfessional, '_id' | 'createdAt'>): Promise<IProfessional>
  update(id: string, data: Partial<IProfessional>): Promise<IProfessional | null>
  delete(id: string): Promise<boolean>
}

export interface IAppointmentRepository {
  getAll(options?: PaginationOptions): Promise<PaginatedResult<IAppointment>>
  getById(id: string): Promise<IAppointment | null>
  getByPatient(patientId: string, options?: PaginationOptions): Promise<PaginatedResult<IAppointment>>
  getByProfessional(professionalId: string, options?: PaginationOptions): Promise<PaginatedResult<IAppointment>>
  getByProfessionalAndDate(professionalId: string, date: Date): Promise<IAppointment[]>
  countActiveBySlot(professionalId: string, specialtyId: string, date: Date, timeFrom: string): Promise<number>
  create(data: Omit<IAppointment, '_id' | 'createdAt'>): Promise<IAppointment>
  updateStatus(id: string, status: AppointmentStatus, extra?: { cancelledBy?: string; secretaryNotes?: string }): Promise<IAppointment | null>
  delete(id: string): Promise<boolean>
}