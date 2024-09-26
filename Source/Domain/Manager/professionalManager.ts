import container from "../../container";
import { Professional } from "../../Data/Models/professionalSchema";
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import { CreateProfessionalDto } from "typesRequestDtos";
import mongoose from "mongoose";
import customLogger from "Source/Services/logger";
import { IUser, IUserPublic } from "Source/Data/Models/userSchema";


class ProfessionalManager {
    private professionalRepository
    private userRepository
    constructor(){
        this.professionalRepository = container.resolve('ProfessionalRepository');
        this.userRepository = container.resolve('UserRepository')
    }
    async getAll(criteria: Criteria){
       return await this.professionalRepository.getAll(criteria)
    }
    async getProfessionalById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalRepository.getProfessionalById(id)
    }
    async createProfessional(bodyDto: CreateProfessionalDto){
        
        let body : Professional =  {...bodyDto, user_id: bodyDto.user_id}
        await idValidation.parseAsync(body.user_id)
        let verifyUser :IUserPublic = await this.userRepository.getUserById(bodyDto.user_id)
        if(!verifyUser)  throw new Error("User don't exist")
        if(verifyUser.role.name === "patient") throw new Error("Los pacientes no pueden ser profesionales")
        return await this.professionalRepository.createProfessional(body)
    }
    async updateProfessional(body:Professional, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalRepository.updateProfessional(body, id)
    }
    async deleteProfessional(id: IdMongo | string){
        await idValidation.parseAsync(id)
        return await this.professionalRepository.deleteProfessional(id)
    }
}
export default ProfessionalManager