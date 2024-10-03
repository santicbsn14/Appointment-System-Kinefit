import container from "../../container";
import { IUser } from "../../Data/Models/userSchema";
import { Criteria, IdMongo, Paginated } from "../../Utils/Types/typesMongoose";
import emailValidation from "../Validations/emailValidation";
import idValidation from "../Validations/idValidation";
import createUserValidation from "../Validations/CreatesValidation/createUserValidation";
import updateUserValidation from "../Validations/UserValidations/updateUserValidation";
import { validPassword } from "Source/Utils/hashService";

class UserManager {
    private userRepository

    constructor(){
        this.userRepository = container.resolve('UserRepository');
    }
    async getAll(criteria: Criteria){
       return await this.userRepository.getAll(criteria)
    }
    async getUserById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.userRepository.getUserById(id)
    }
    async getUserByEmail(email: string){
        await emailValidation.parseAsync({email})
        return await this.userRepository.getUserByEmail(email)
    }
    async createUser(body:Partial<IUser>){
        await createUserValidation.parseAsync(body)
        return await this.userRepository.createUser(body)
    }
    async updateUser(body:IUser, id:IdMongo){
        await updateUserValidation.parseAsync({...body, id})
        let user: IUser = await this.userRepository.getUserByEmail(body.email)
        const isHashedPassword = validPassword(body.password, user.password)
        if (!isHashedPassword)
            {
                throw new Error('Updated failed, invalid password.');
            }
        
        return await this.userRepository.updateUser(id, body)
    }
    async deleteUser(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.userRepository.deleteUser(id)
    }
}
export default UserManager