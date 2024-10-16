import container from "../../container";
import { type ProfessionalTimeSlots } from "../../Data/Models/professionalTimeSlotsSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createProfessionalTimeSlotsValidation from "../Validations/CreatesValidation/createProfessionalTimesSlots";
import { CreateProfessionalTimeSlotsDto } from "typesRequestDtos";
import mongoose from "mongoose";
import dayjs from "dayjs";



class ProfessionalTimeSlotsManager {
    private professionalTimeSlotsRepository
    private professionalRepository
    constructor(){
        this.professionalTimeSlotsRepository = container.resolve('ProfessionalTimeSlotsRepository');
        this.professionalRepository= container.resolve('ProfessionalRepository')
    }
    async getAll(criteria: Criteria){
       return await this.professionalTimeSlotsRepository.getAll(criteria)
    }
    async getProfessionalTimeSlotsById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.getProfessionalTimeSlotsById(id)
    }
    async getProfessionalTimeSlotsByPro(id: IdMongo){
        await idValidation.parseAsync(id)
        let proTimeSlots = await this.professionalTimeSlotsRepository.getProfessionalTimeSlotsByPro(id)
        if(!proTimeSlots) throw new Error('No se han configurado los horarios de este profesional')
        return proTimeSlots
    }
    async createProfessionalTimeSlots(bodyDto:CreateProfessionalTimeSlotsDto){
        let body   = {...bodyDto, professional_id: bodyDto.professional_id}

        let verifyProfessional = await this.professionalRepository.getProfessionalById(bodyDto.professional_id)
        if(!verifyProfessional) throw new Error('Professional not found')
        
        let verifyProTimeSlot = await this.professionalTimeSlotsRepository.getProfessionalTimeSlotsByPro(bodyDto.professional_id)
        if(verifyProTimeSlot) throw new Error('El profesional ya tiene un horario creado')
        return await this.professionalTimeSlotsRepository.createProfessionalTimeSlots(body)
    }
    async updateProfessionalTimeSlots(body:ProfessionalTimeSlots, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.updateProfessionalTimeSlots(id, body)
    }
    async deleteProfessionalTimeSlots(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.professionalTimeSlotsRepository.deleteProfessionalTimeSlots(id)
    }
}
export default ProfessionalTimeSlotsManager