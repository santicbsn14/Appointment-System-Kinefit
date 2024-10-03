import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
export const createHash = async (password) => {
    return await bcrypt.hash(password, 10);
};
export const validPassword = async (password, userpasswordhash) => {
    return await bcrypt.compare(password, userpasswordhash);
};
