import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../Utils/AppError'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }
  console.error('[Unhandled Error]', err)
  res.status(500).json({ error: 'Error interno del servidor.' })
}