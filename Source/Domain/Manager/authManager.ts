import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IUserRepository } from '../../Data/Repositories/Interfaces/index'
import { IPatientRepository } from '../../Data/Repositories/Interfaces/index'
import { Role } from '../Entities/index'
import { AppError } from '../../Utils/AppError'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '../../Services/mailService'
interface RegisterDTO {
  name: string
  email: string
  password: string
  dni: string
  phone: string
  birthDate: Date
}

interface LoginDTO {
  email: string
  password: string
}

interface AuthManagerDeps {
  userRepository: IUserRepository
  patientRepository: IPatientRepository
}

export class AuthManager {
  private userRepository: IUserRepository
  private patientRepository: IPatientRepository

  constructor({ userRepository, patientRepository }: AuthManagerDeps) {
    this.userRepository = userRepository
    this.patientRepository = patientRepository
  }

  async register(dto: RegisterDTO) {
    const existing = await this.userRepository.getByEmail(dto.email)
    if (existing) throw new AppError('El email ya está registrado.')

    const hashedPassword = await bcrypt.hash(dto.password, 10)
const user = await this.userRepository.create({
  name: dto.name,
  email: dto.email,
  password: hashedPassword,
  role: Role.Patient,
  phone: dto.phone,
})

    await this.patientRepository.create({
      userId: user._id as string,
      dni: dto.dni,
      phone: dto.phone,
      birthDate: dto.birthDate,
    })

    const token = this.generateToken(user._id as string, user.role)
    return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token }
  }

  async login(dto: LoginDTO) {
    const user = await this.userRepository.getByEmail(dto.email)
    if (!user) throw new AppError('Credenciales inválidas.', 401)

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new AppError('Credenciales inválidas.', 401)

    const token = this.generateToken(user._id as string, user.role)
    return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token }
  }

  private generateToken(userId: string, role: Role): string {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET no configurado.')
    return jwt.sign({ userId, role }, secret, { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any })
  }

async forgotPassword(email: string): Promise<void> {
  console.log('=== FORGOT PASSWORD ===')
  console.log('Email:', email)
  
  const user = await this.userRepository.getByEmail(email)
  console.log('Usuario encontrado:', user ? 'SI' : 'NO')
  
  if (!user) return

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 60 * 60 * 1000)

  await this.userRepository.update(user._id as string, {
    resetPasswordToken: token,
    resetPasswordExpires: expires,
  })

  console.log('Token guardado, enviando mail...')
  await sendPasswordResetEmail(email, token)
  console.log('Mail enviado')
}

async resetPassword(token: string, newPassword: string): Promise<void> {
  const users = await this.userRepository.getAll({ limit: 1000 })
  const user = users.docs.find(
    u => u.resetPasswordToken === token &&
    u.resetPasswordExpires &&
    new Date(u.resetPasswordExpires) > new Date()
  )

  if (!user) throw new AppError('El token es inválido o ya expiró.', 400)

  const hashed = await bcrypt.hash(newPassword, 10)

  await this.userRepository.update(user._id as string, {
    password: hashed,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
  })
}
}