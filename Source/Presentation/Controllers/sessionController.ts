import { NextFunction, Response } from "express";
import pkg from "firebase-admin";
import SessionManager from "../../Domain/Manager/sessionManager";
import { CreateUserDto, userLogin } from "typesRequestDtos";
import { IdMongo } from "typesMongoose";


const {auth} = pkg
export const signup = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
export const updatedUser = async (req: CustomRequest, res: Response, next:NextFunction) => {
    try {
        let data = req.body
        let id = req.params.id as unknown as IdMongo
        let manager = new SessionManager()
        let response = await manager.updateUser(data, id)
        return response
    } catch (error) {
        next(error)
    }
}