import { NextFunction, Response } from "express";
import pkg from "firebase-admin";
import SessionManager from "../../Domain/Manager/sessionManager";
import { CreateUserDto, userLogin } from "typesRequestDtos";
import { createHash } from "../../Utils/hashService";

const {auth} = pkg
export const signup = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userDto = req.body
        let manager = new SessionManager()
        const { password, ...userData } = req.body;
        
        const hashedPassword = await createHash(password);
        
        const user = {
            ...userData,
            password: hashedPassword
        };
        let userResponse = await  manager.signup(user)
;
        res.status(201).json({
            user: userResponse
        });
    } catch (error) {
        console.error('Error creating new user:', error);
        next(error);
    }
};
export const login = async (req: CustomRequest<userLogin>, res:Response, next:NextFunction) => {
    try{
        let user = req.body
        let manager = new SessionManager()
        let response = await manager.login(user)

    } catch (error) {
        next(error)
    }
}