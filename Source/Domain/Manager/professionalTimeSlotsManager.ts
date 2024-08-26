import container from "../../container";
import { type ProfessionalTimesSlots } from "../../Data/Models/professionalTimeSlotsSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createProfessionalTimesSlotsValidation from "../Validations/CreatesValidation/createProfessionalTimesSlots";



class ProfessionalTimesSlotsManager {
    private professionalTimeSlotsRepository

    constructor(){
        this.professionalTimeSlotsRepository = container.resolve('ProfessionalTimesSlotsRepository');
    }
    async getAll(criteria: Criteria){
       return await this.professionalTimeSlotsRepository.getAll(criteria)
    }
    async getProfessionalTimesSlotsById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.getProfessionalTimesSlotsById(id)
    }
    async createProfessionalTimesSlots(body:ProfessionalTimesSlots){
        await createProfessionalTimesSlotsValidation.parseAsync(body)
        return await this.professionalTimeSlotsRepository.createProfessionalTimesSlots(body)
    }
    async updateProfessionalTimesSlots(body:ProfessionalTimesSlots, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.updateProfessionalTimesSlots(body, id)
    }
    async deleteProfessionalTimesSlots(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.deleteProfessionalTimesSlots(id)
    }
}
export default ProfessionalTimesSlotsManager