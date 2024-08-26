import container from "../../container";
import { Professional } from "../../Data/Models/professionalSchema";
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import { CreateProfessionalDto } from "typesRequestDtos";
import mongoose from "mongoose";


class ProfessionalManager {
    private professionalRepository

    constructor(){
        this.professionalRepository = container.resolve('ProfessionalRepository');
    }
    async getAll(criteria: Criteria){
       return await this.professionalRepository.getAll(criteria)
    }
    async getProfessionalById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalRepository.getProfessionalById(id)
    }
    async createProfessional(bodyDto: CreateProfessionalDto){
        let body : Professional =  {...bodyDto, user_id: new mongoose.Types.ObjectId(bodyDto.user_id)}
        await idValidation.parseAsync(body.user_id)
        return await this.professionalRepository.createProfessional(body)
    }
    async updateProfessional(body:Professional, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalRepository.updateProfessional(body, id)
    }
    async deleteProfessional(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalRepository.deleteProfessional(id)
    }
}
export default ProfessionalManager