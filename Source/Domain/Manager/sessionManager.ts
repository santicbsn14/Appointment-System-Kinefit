import container from "../../container";
import { IUser } from "../../Data/Models/userSchema";
import { Criteria, IdMongo, Paginated } from "../../Utils/Types/typesMongoose";
import pkg, { auth } from "firebase-admin";
import emailValidation from "../Validations/emailValidation";
import idValidation from "../Validations/idValidation";
import createUserValidation from "../Validations/CreatesValidation/createUserValidation";
import updateUserValidation from "../Validations/UserValidations/updateUserValidation";
import { CreateUserDto, userLogin } from "typesRequestDtos";

class UserManager {
    private userRepository

    constructor(){
        this.userRepository = container.resolve('UserRepository');
    }
    async getUserByEmail(email: string){
        await emailValidation.parseAsync({email})
        return await this.userRepository.getUserByEmail(email)
    }
    async signup(bodyUser: CreateUserDto){
        const {auth} = pkg
        let userResponse = await auth().createUser({
            email: bodyUser.email,
            password: bodyUser.password,
            emailVerified: false,
            disabled: false
        });
        

        let user :IUser = await this.userRepository.createUser(bodyUser)
        return user 
    }
    async login(logindto: userLogin){
        let userResponse = await auth().getUserByEmail(logindto.email)

    }
    async updateUser(body:IUser, id:IdMongo){
        await updateUserValidation.parseAsync({...body, id})
        return await this.userRepository.updateUser(body, id)
    }
    async deleteUser(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.userRepository.deleteUser(id)
    }
}
export default UserManager