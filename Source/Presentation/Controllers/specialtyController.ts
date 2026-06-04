import { Request, Response, NextFunction } from 'express'
import { SpecialtyManager } from '../../Domain/Manager/specialtyManager'
import { z } from 'zod'
import { DayOfWeek } from '../../Domain/Entities/index'

const restrictionSchema = z.object({
  hasRestriction: z.boolean(),
  days: z.array(z.nativeEnum(DayOfWeek)).default([]),
  timeFrom: z.string().default(''),
  timeTo: z.string().default(''),
}).refine(
  (data) => {
    if (!data.hasRestriction) return true
    return /^\d{2}:\d{2}$/.test(data.timeFrom) && /^\d{2}:\d{2}$/.test(data.timeTo)
  },
  { message: 'timeFrom y timeTo son requeridos cuando hay restricción (formato HH:MM)' }
)

const specialtySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  durationMinutes: z.number().min(15),
  maxCapacity: z.number().min(1),
  restriction: restrictionSchema,
})

export class SpecialtyController {
  private specialtyManager: SpecialtyManager
  constructor({ specialtyManager }: { specialtyManager: SpecialtyManager }) {
    this.specialtyManager = specialtyManager
  }
  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.specialtyManager.getAll()) } catch (error) { next(error) }
  }
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.specialtyManager.getById(req.params.id)) } catch (error) { next(error) }
  }
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(201).json(await this.specialtyManager.create(specialtySchema.parse(req.body))) } catch (error) { next(error) }
  }
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json(await this.specialtyManager.update(req.params.id, specialtySchema.partial().parse(req.body))) } catch (error) { next(error) }
  }
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { await this.specialtyManager.delete(req.params.id); res.json({ message: 'Especialidad eliminada.' }) } catch (error) { next(error) }
  }
}