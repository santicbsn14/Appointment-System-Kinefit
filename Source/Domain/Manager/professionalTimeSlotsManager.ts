import container from "../../container";
import { type ProfessionalTimeSlots } from "../../Data/Models/professionalTimeSlotsSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createProfessionalTimeSlotsValidation from "../Validations/CreatesValidation/createProfessionalTimesSlots";
import { CreateProfessionalTimeSlotsDto } from "typesRequestDtos";
import mongoose from "mongoose";



class ProfessionalTimeSlotsManager {
    private professionalTimeSlotsRepository

    constructor(){
        this.professionalTimeSlotsRepository = container.resolve('ProfessionalTimeSlotsRepository');
    }
    async getAll(criteria: Criteria){
       return await this.professionalTimeSlotsRepository.getAll(criteria)
    }
    async getProfessionalTimeSlotsById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.getProfessionalTimeSlotsById(id)
    }
    async createProfessionalTimeSlots(bodyDto:CreateProfessionalTimeSlotsDto){
        let body  = {...bodyDto, professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id)}
        await createProfessionalTimeSlotsValidation.parseAsync(body)
        return await this.professionalTimeSlotsRepository.createProfessionalTimeSlots(body)
    }
    async updateProfessionalTimeSlots(body:ProfessionalTimeSlots, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.updateProfessionalTimeSlots(body, id)
    }
    async deleteProfessionalTimeSlots(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.deleteProfessionalTimeSlots(id)
    }
}
export default ProfessionalTimeSlotsManager