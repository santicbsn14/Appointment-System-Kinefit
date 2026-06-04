import { Request, Response, NextFunction } from 'express'
import { AuthManager } from '../../Domain/Manager/authManager'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  dni: z.string().min(7),
  phone: z.string().min(8),
  birthDate: z.coerce.date(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export class AuthController {
  private authManager: AuthManager
  constructor({ authManager }: { authManager: AuthManager }) {
    this.authManager = authManager
  }
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body)
      const result = await this.authManager.register(data)
      res.status(201).json(result)
    } catch (error) { next(error) }
  }
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body)
      const result = await this.authManager.login(data)
      res.json(result)
    } catch (error) { next(error) }
  }
}