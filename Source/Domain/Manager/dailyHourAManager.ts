import container from "../../container";
import {type DailyHourAvailability } from "../../Data/Models/dailyHourASchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
// import createDailyHourAvailabilityValidation from "../Validations/CreatesValidation/createDailyHourAvailabilityValidation";
import { CreateDailyHourAvailabilityDto } from "typesRequestDtos";
import mongoose from "mongoose";
import dayjs from "dayjs";



class DailyHourAvailabilityManager {
    private dailyHourAvailabilityRepository
    private professionalRepository
    constructor(){
        this.dailyHourAvailabilityRepository = container.resolve('DailyHourAvailabilityRepository');
        this.professionalRepository= container.resolve('ProfessionalRepository')
    }
    async getAll(criteria: Criteria){
       return await this.dailyHourAvailabilityRepository.getAll(criteria)
    }
    async getDailyHourAvailabilityById(id: string){
        await idValidation.parseAsync(id)
        return await this.dailyHourAvailabilityRepository.getDailyHourAvailabilityById(id)
    }
    async createDailyHourAvailability(bodyDto:CreateDailyHourAvailabilityDto){
        const body: DailyHourAvailability = {
            professional_id: bodyDto.professional_id,
            date: dayjs(bodyDto.date).startOf('day'),
            hourly_slots: bodyDto.hourly_slots,
        };
        let verifyProfessional = this.professionalRepository.getProfessionalTById(bodyDto.professional_id)
        if(!verifyProfessional) throw new Error('Professional not found')
        // await createDailyHourAvailabilityValidation.parseAsync(body)
        return await this.dailyHourAvailabilityRepository.createDailyHourAvailability(body)
    }
    async updateDailyHourAvailability(body:DailyHourAvailability, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.dailyHourAvailabilityRepository.updateDailyHourAvailability(body, id)
    }
    async deleteDailyHourAvailability(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.dailyHourAvailabilityRepository.deleteDailyHourAvailability(id)
    }
}
export default DailyHourAvailabilityManager