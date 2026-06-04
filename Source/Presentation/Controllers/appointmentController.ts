import { Request, Response, NextFunction } from 'express'
import { AppointmentManager } from '../../Domain/Manager/appointmentManager'
import { z } from 'zod'

const createSchema = z.object({
  professionalId: z.string(),
  specialtyId: z.string(),
  date: z.coerce.date(),
  timeFrom: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido. Use HH:MM'),
  notes: z.string().optional(),
})

const statusNoteSchema = z.object({ secretaryNotes: z.string().optional() })

export class AppointmentController {
  private appointmentManager: AppointmentManager
  constructor({ appointmentManager }: { appointmentManager: AppointmentManager }) {
    this.appointmentManager = appointmentManager
  }
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.appointmentManager.getAll({ page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 10 })) } catch (error) { next(error) }
  }
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.appointmentManager.getById(req.params.id)) } catch (error) { next(error) }
  }
  getMyAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.appointmentManager.getByPatient(req.user!.userId, { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 10 })) } catch (error) { next(error) }
  }
  getByProfessional = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.appointmentManager.getByProfessional(req.params.professionalId, { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 10 })) } catch (error) { next(error) }
  }
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createSchema.parse(req.body)
      res.status(201).json(await this.appointmentManager.create({ ...data, patientUserId: req.user!.userId }))
    } catch (error) { next(error) }
  }
  approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { const { secretaryNotes } = statusNoteSchema.parse(req.body); res.json(await this.appointmentManager.approve(req.params.id, secretaryNotes)) } catch (error) { next(error) }
  }
  reject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { const { secretaryNotes } = statusNoteSchema.parse(req.body); res.json(await this.appointmentManager.reject(req.params.id, secretaryNotes)) } catch (error) { next(error) }
  }
  cancelByPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.appointmentManager.cancelByPatient(req.params.id, req.user!.userId)) } catch (error) { next(error) }
  }
  cancelBySecretary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { const { secretaryNotes } = statusNoteSchema.parse(req.body); res.json(await this.appointmentManager.cancelBySecretary(req.params.id, secretaryNotes)) } catch (error) { next(error) }
  }
}