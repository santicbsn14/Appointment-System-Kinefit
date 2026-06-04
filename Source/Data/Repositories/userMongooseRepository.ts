import { UserModel } from '../Models/userModel'
import { IUserRepository } from './Interfaces/index'
import { IUser, PaginationOptions, PaginatedResult } from '../../Domain/Entities/index'

export class UserMongooseRepository implements IUserRepository {
  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<IUser>> {
    const { page = 1, limit = 10 } = options
    const result = await (UserModel as any).paginate({}, { page, limit, lean: true })
    return result
  }
  async getById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).lean()
  }
  async getByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).lean()
  }
  async create(data: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser> {
    const user = await UserModel.create(data)
    return user.toObject()
  }
  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).lean()
  }
  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id)
    return result !== null
  }
}