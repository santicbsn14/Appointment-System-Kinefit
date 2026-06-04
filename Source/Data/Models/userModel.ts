import mongoose, { Schema, Document } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { IUser, Role } from '../../Domain/Entities/index'

export type UserDocument = Omit<IUser, '_id'> & Document

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
    phone: { type: String, default: '' },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
)

UserSchema.plugin(mongoosePaginate)

export const UserModel = mongoose.model<UserDocument>('User', UserSchema)