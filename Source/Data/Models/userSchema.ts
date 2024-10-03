import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Role } from './roleSchema';

export interface IUser  {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  age: number;
  dni: number,
  homeAdress: string,
  phone: number,
  role: mongoose.Types.ObjectId | string | Role;
  status: boolean;
  password: string;
  _id?: mongoose.Types.ObjectId
}

export interface IUserPublic {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  age: number;
  dni: number;
  homeAdress: string | number;
  phone: number;
  role: Role;
  status: boolean;
  password?: string;
  id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, required: true },
  dni: {type: Number, unique: true, required: true},
  role: { type: Schema.Types.ObjectId,index: true, ref: 'roles' },
  homeAdress:{ type:String, required:true},
  phone:{type:Number, required:true},
  status: { type: Boolean, default: true },
  password: { type: String, required: true }
});

userSchema.plugin(paginate);

export interface UserModel extends PaginateModel<IUser> {}

export default mongoose.model<IUser, UserModel>('users', userSchema);
