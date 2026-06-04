export enum Role {
  Patient = 'patient',
  Professional = 'professional',
  Secretary = 'secretary',
  Admin = 'admin',
}

export enum AppointmentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
}

export enum CancelledBy {
  Patient = 'patient',
  Secretary = 'secretary',
  Professional = 'professional',
}

export enum DayOfWeek {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

export interface IUser {
  _id?: any
  name: string
  email: string
  password: string
  role: Role
  phone?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt?: Date
}

export interface IPatient {
  _id?: any
  userId: any
  dni: string
  phone: string
  birthDate: Date
  medicalHistory?: string
  createdAt?: Date
}

export interface ISpecialtyRestriction {
  hasRestriction: boolean
  days: DayOfWeek[]
  timeFrom: string
  timeTo: string
}

export interface ISpecialty {
  _id?: any
  name: string
  description?: string
  durationMinutes: number
  maxCapacity: number
  restriction: ISpecialtyRestriction
  createdAt?: Date
}

export interface IWeeklySlot {
  day: DayOfWeek
  timeFrom: string
  timeTo: string
  isAvailable: boolean
}

export interface ISchedule {
  _id?: any
  professionalId: any
  weeklySlots: IWeeklySlot[]
  createdAt?: Date
}

export interface IProfessional {
  _id?: any
  userId: any
  specialties: any[]
  scheduleId?: any
  createdAt?: Date
}

export interface IAppointment {
  _id?: any
  patientId: any
  professionalId: any
  specialtyId: any
  date: Date
  timeFrom: string
  timeTo: string
  status: AppointmentStatus
  cancelledBy?: CancelledBy | null
  notes?: string
  secretaryNotes?: string
  createdAt?: Date
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}