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
    async createProfessionalTimeSlots(bodyDto:CreateProfessionalTimeSlotsDto){
        let body   = {...bodyDto, professional_id: bodyDto.professional_id}
        const formattedSchedule = body.schedule.map(slot => ({
            week_day: slot.week_day,
            time_slot: {
                start_time: dayjs(slot.time_slots.start_time).toDate(), 
                end_time: dayjs(slot.time_slots.end_time).toDate(),     
            },
        }));
        // await createProfessionalTimeSlotsValidation.parseAsync(body)
        let verifyProfessional = this.professionalRepository.getProfessionalTById(bodyDto.professional_id)
        if(!verifyProfessional) throw new Error('Professional not found')
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