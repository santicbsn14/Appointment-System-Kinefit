import bcrypt from 'bcryptjs'
import { Role } from '../../Domain/Entities/index'
import { IUserRepository } from '../../Data/Repositories/Interfaces/index'
import { IPatientRepository } from '../../Data/Repositories/Interfaces/index'
import { AppError } from '../../Utils/AppError'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

export class UserController {
  private userRepository: IUserRepository
  private patientRepository: IPatientRepository

  constructor({ userRepository, patientRepository }: {
    userRepository: IUserRepository
    patientRepository: IPatientRepository
  }) {
    this.userRepository = userRepository
    this.patientRepository = patientRepository
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      const result = await this.userRepository.getAll({ page, limit })
      res.json(result)
    } catch (error) { next(error) }
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role, dni, phone, birthDate } = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.nativeEnum(Role),
        dni: z.string().optional(),
        phone: z.string().optional(),
        birthDate: z.coerce.date().optional(),
      }).parse(req.body)

      const existing = await this.userRepository.getByEmail(email)
      if (existing) throw new AppError('El email ya está registrado.')

      const hashed = await bcrypt.hash(password, 10)
      const user = await this.userRepository.create({ name, email, password: hashed, role })

      // Si es paciente, crear también el perfil de paciente
      if (role === Role.Patient) {
        if (!dni || !phone || !birthDate) {
          throw new AppError('Para crear un paciente se requiere DNI, teléfono y fecha de nacimiento.')
        }
        await this.patientRepository.create({
          userId: user._id as string,
          dni,
          phone,
          birthDate,
        })
      }

      res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role })
    } catch (error) { next(error) }
  }

delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await this.userRepository.getById(req.params.id)
    if (!user) throw new AppError('Usuario no encontrado.', 404)

    // Si es paciente, eliminar también su perfil
    if (user.role === Role.Patient) {
      const patient = await this.patientRepository.getByUserId(req.params.id)
      if (patient) await this.patientRepository.delete(patient._id as string)
    }

    await this.userRepository.delete(req.params.id)
    res.json({ message: 'Usuario eliminado.' })
  } catch (error) { next(error) }
}

  updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { password } = z.object({ password: z.string().min(6) }).parse(req.body)
      if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
        throw new AppError('No tenés permisos para cambiar esta contraseña.', 403)
      }
      const hashed = await bcrypt.hash(password, 10)
      const updated = await this.userRepository.update(req.params.id, { password: hashed })
      if (!updated) throw new AppError('Usuario no encontrado.', 404)
      res.json({ message: 'Contraseña actualizada.' })
    } catch (error) { next(error) }
  }
}