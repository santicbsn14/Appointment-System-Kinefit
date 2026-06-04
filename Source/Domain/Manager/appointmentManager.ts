import { IAppointmentRepository } from '../../Data/Repositories/Interfaces/index'
import { IProfessionalRepository } from '../../Data/Repositories/Interfaces/index'
import { ISpecialtyRepository } from '../../Data/Repositories/Interfaces/index'
import { IScheduleRepository } from '../../Data/Repositories/Interfaces/index'
import { IPatientRepository } from '../../Data/Repositories/Interfaces/index'
import { IAppointment, AppointmentStatus, CancelledBy, PaginationOptions, PaginatedResult } from '../Entities/index'
import { validateProfessionalSchedule, validateSpecialtyRestriction, calculateTimeTo, isDateInPast } from '../../Utils/scheduleUtils'
import { AppError } from '../../Utils/AppError'

interface CreateAppointmentDTO {
  patientUserId: string
  professionalId: string
  specialtyId: string
  date: Date
  timeFrom: string
  notes?: string
}

export class AppointmentManager {
  private appointmentRepository: IAppointmentRepository
  private professionalRepository: IProfessionalRepository
  private specialtyRepository: ISpecialtyRepository
  private scheduleRepository: IScheduleRepository
  private patientRepository: IPatientRepository

  constructor({ appointmentRepository, professionalRepository, specialtyRepository, scheduleRepository, patientRepository }: {
    appointmentRepository: IAppointmentRepository
    professionalRepository: IProfessionalRepository
    specialtyRepository: ISpecialtyRepository
    scheduleRepository: IScheduleRepository
    patientRepository: IPatientRepository
  }) {
    this.appointmentRepository = appointmentRepository
    this.professionalRepository = professionalRepository
    this.specialtyRepository = specialtyRepository
    this.scheduleRepository = scheduleRepository
    this.patientRepository = patientRepository
  }

  async getAll(options?: PaginationOptions): Promise<PaginatedResult<IAppointment>> {
    return this.appointmentRepository.getAll(options)
  }

  async getById(id: string): Promise<IAppointment> {
    const appointment = await this.appointmentRepository.getById(id)
    if (!appointment) throw new AppError('Turno no encontrado.', 404)
    return appointment
  }

  async getByPatient(patientId: string, options?: PaginationOptions): Promise<PaginatedResult<IAppointment>> {
    return this.appointmentRepository.getByPatient(patientId, options)
  }

  async getByProfessional(professionalId: string, options?: PaginationOptions): Promise<PaginatedResult<IAppointment>> {
    return this.appointmentRepository.getByProfessional(professionalId, options)
  }

  async create(dto: CreateAppointmentDTO): Promise<IAppointment> {
    const { patientUserId, professionalId, specialtyId, date, timeFrom, notes } = dto


    if (isDateInPast(date)) throw new AppError('No se pueden solicitar turnos en fechas pasadas.')

    const patient = await this.patientRepository.getByUserId(patientUserId)
    if (!patient) throw new AppError('El paciente no existe.', 404)

    const professional = await this.professionalRepository.getById(professionalId)

    if (!professional) throw new AppError('El profesional no existe.', 404)

    const specialty = await this.specialtyRepository.getById(specialtyId)
    if (!specialty) throw new AppError('La especialidad no existe.', 404)

    const professionalSpecialtyIds = (professional.specialties as any[]).map((s: any) => s._id ? s._id.toString() : s.toString())
    if (!professionalSpecialtyIds.includes(specialtyId)) {
      throw new AppError(`El profesional no atiende la especialidad "${specialty.name}".`)
    }

    const timeTo = calculateTimeTo(timeFrom, specialty.durationMinutes)

    const specialtyError = validateSpecialtyRestriction(specialty, date, timeFrom, timeTo)
    if (specialtyError) throw new AppError(specialtyError)

    const schedule = await this.scheduleRepository.getByProfessionalId(professionalId)
    if (!schedule) throw new AppError('El profesional no tiene horarios configurados.')

    const scheduleError = validateProfessionalSchedule(schedule, date, timeFrom, timeTo)
    if (scheduleError) throw new AppError(scheduleError)

    const activeCount = await this.appointmentRepository.countActiveBySlot(professionalId, specialtyId, date, timeFrom)
    if (activeCount >= specialty.maxCapacity) {
      throw new AppError(`El turno de las ${timeFrom} ya alcanzó la capacidad máxima (${specialty.maxCapacity}).`)
    }

    const existingAppointments = await this.appointmentRepository.getByProfessionalAndDate(professionalId, date)
    const conflict = existingAppointments.find((a) => {
      const aPatientId = typeof a.patientId === 'string' ? a.patientId : (a.patientId as any)._id?.toString()
      return aPatientId === patient._id?.toString() && a.timeFrom === timeFrom
    })
    if (conflict) throw new AppError('Ya tenés un turno pendiente o aprobado con este profesional a la misma hora.')

    return this.appointmentRepository.create({
      patientId: patient._id as string,
      professionalId, specialtyId, date, timeFrom, timeTo,
      status: AppointmentStatus.Pending,
      cancelledBy: null,
      notes: notes ?? '',
      secretaryNotes: '',
    })
  }

  async approve(id: string, secretaryNotes?: string): Promise<IAppointment> {
    const appointment = await this.appointmentRepository.getById(id)
    if (!appointment) throw new AppError('Turno no encontrado.', 404)
    if (appointment.status !== AppointmentStatus.Pending) throw new AppError(`Solo se pueden aprobar turnos pendientes.`)
    return (await this.appointmentRepository.updateStatus(id, AppointmentStatus.Approved, { secretaryNotes }))!
  }

  async reject(id: string, secretaryNotes?: string): Promise<IAppointment> {
    const appointment = await this.appointmentRepository.getById(id)
    if (!appointment) throw new AppError('Turno no encontrado.', 404)
    if (appointment.status !== AppointmentStatus.Pending) throw new AppError(`Solo se pueden rechazar turnos pendientes.`)
    return (await this.appointmentRepository.updateStatus(id, AppointmentStatus.Rejected, { secretaryNotes }))!
  }

  async cancelByPatient(id: string, patientUserId: string): Promise<IAppointment> {
    const appointment = await this.appointmentRepository.getById(id)
    if (!appointment) throw new AppError('Turno no encontrado.', 404)

    const patient = await this.patientRepository.getByUserId(patientUserId)
    const patientId = typeof appointment.patientId === 'string' ? appointment.patientId : (appointment.patientId as any)._id?.toString()
    if (!patient || patient._id?.toString() !== patientId) throw new AppError('No tenés permiso para cancelar este turno.', 403)

    if (![AppointmentStatus.Pending, AppointmentStatus.Approved].includes(appointment.status)) {
      throw new AppError('Solo se pueden cancelar turnos pendientes o aprobados.')
    }

    return (await this.appointmentRepository.updateStatus(id, AppointmentStatus.Cancelled, { cancelledBy: CancelledBy.Patient }))!
  }

  async cancelBySecretary(id: string, secretaryNotes?: string): Promise<IAppointment> {
    const appointment = await this.appointmentRepository.getById(id)
    if (!appointment) throw new AppError('Turno no encontrado.', 404)

    if (![AppointmentStatus.Pending, AppointmentStatus.Approved].includes(appointment.status)) {
      throw new AppError('Solo se pueden cancelar turnos pendientes o aprobados.')
    }

    return (await this.appointmentRepository.updateStatus(id, AppointmentStatus.Cancelled, { cancelledBy: CancelledBy.Secretary, secretaryNotes }))!
  }
}