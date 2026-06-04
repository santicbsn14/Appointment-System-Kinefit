import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '../../Domain/Entities/index'
import { AppError } from '../../Utils/AppError'

export interface AuthPayload {
  userId: string
  role: Role
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw new AppError('Token no proporcionado.', 401)

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET no configurado.')

    const payload = jwt.verify(token, secret) as AuthPayload
    req.user = payload
    next()
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(401).json({ error: 'Token inválido o expirado.' })
    }
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) { res.status(401).json({ error: 'No autenticado.' }); return }
    if (!roles.includes(req.user.role)) { res.status(403).json({ error: 'No tenés permisos para realizar esta acción.' }); return }
    next()
  }
}