import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const createHash = async (password: string)=>
{
       return await bcrypt.hash(password, 10)
}