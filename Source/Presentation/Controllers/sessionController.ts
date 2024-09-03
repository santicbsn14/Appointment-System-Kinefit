import { NextFunction, Response } from "express";
import pkg from "firebase-admin";
import SessionManager from "Source/Domain/Manager/sessionManager";
import { CreateUserDto, userLogin } from "typesRequestDtos";
const {auth} = pkg
export const signup = async (req: CustomRequest<CreateUserDto>, res: Response, next: NextFunction) => {
    try {
        const userDto = req.body
        let manager = new SessionManager()
        let userResponse = await  manager.signup(userDto)

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