import { Request, Response, NextFunction } from 'express'
import { ProfessionalManager } from '../../Domain/Manager/professionalManager'
import { z } from 'zod'
import { DayOfWeek } from '../../Domain/Entities/index'

const createProfessionalSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  specialties: z.array(z.string()).min(1),
})

const scheduleSchema = z.object({
  weeklySlots: z.array(z.object({
    day: z.nativeEnum(DayOfWeek),
    timeFrom: z.string().regex(/^\d{2}:\d{2}$/),
    timeTo: z.string().regex(/^\d{2}:\d{2}$/),
    isAvailable: z.boolean().default(true),
  })).min(1),
})

export class ProfessionalController {
  private professionalManager: ProfessionalManager
  constructor({ professionalManager }: { professionalManager: ProfessionalManager }) {
    this.professionalManager = professionalManager
  }
  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.professionalManager.getAll()) } catch (error) { next(error) }
  }
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.professionalManager.getById(req.params.id)) } catch (error) { next(error) }
  }
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(201).json(await this.professionalManager.create(createProfessionalSchema.parse(req.body))) } catch (error) { next(error) }
  }
  addSpecialty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { specialtyId } = z.object({ specialtyId: z.string() }).parse(req.body)
      res.json(await this.professionalManager.addSpecialty(req.params.id, specialtyId))
    } catch (error) { next(error) }
  }
  removeSpecialty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.professionalManager.removeSpecialty(req.params.id, req.params.specialtyId)) } catch (error) { next(error) }
  }
  setSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { weeklySlots } = scheduleSchema.parse(req.body)
      res.json(await this.professionalManager.setSchedule(req.params.id, weeklySlots))
    } catch (error) { next(error) }
  }
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { await this.professionalManager.delete(req.params.id); res.json({ message: 'Profesional eliminado.' }) } catch (error) { next(error) }
  }
}