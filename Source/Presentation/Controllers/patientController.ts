import { Request, Response, NextFunction } from 'express'
import { PatientManager } from '../../Domain/Manager/patientManager'
import { z } from 'zod'

const updateSchema = z.object({
  medicalHistory: z.string().optional(),
})

export class PatientController {
  private patientManager: PatientManager

  constructor({ patientManager }: { patientManager: PatientManager }) {
    this.patientManager = patientManager
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      const result = await this.patientManager.getAll({ page, limit })
      res.json(result)
    } catch (error) { next(error) }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.patientManager.getById(req.params.id)
      res.json(result)
    } catch (error) { next(error) }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = updateSchema.parse(req.body)
      const result = await this.patientManager.update(req.params.id, data)
      res.json(result)
    } catch (error) { next(error) }
  }
}