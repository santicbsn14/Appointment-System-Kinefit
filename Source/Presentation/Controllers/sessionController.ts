import { NextFunction, Response } from "express";
import pkg from "firebase-admin";
const {auth} = pkg
export const signup = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userResponse = await auth().createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled:false
    })
    
    res.status(201).json(userResponse)
}