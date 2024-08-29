import container from "../../container";
import {type DailyHourAvailability } from "../../Data/Models/dailyHourASchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
// import createDailyHourAvailabilityValidation from "../Validations/CreatesValidation/createDailyHourAvailabilityValidation";
import { CreateDailyHourAvailabilityDto } from "typesRequestDtos";
import mongoose from "mongoose";



class DailyHourAvailabilityManager {
    private dailyHourAvailabilityRepository

    constructor(){
        this.dailyHourAvailabilityRepository = container.resolve('DailyHourAvailabilityRepository');
    }
    async getAll(criteria: Criteria){
       return await this.dailyHourAvailabilityRepository.getAll(criteria)
    }
    async getDailyHourAvailabilityById(id: string){
        let aid = new mongoose.Types.ObjectId(id)
        await idValidation.parseAsync(aid)
        return await this.dailyHourAvailabilityRepository.getDailyHourAvailabilityById(aid)
    }
    async createDailyHourAvailability(bodyDto:CreateDailyHourAvailabilityDto){
        const body: DailyHourAvailability = {
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            date: bodyDto.date,
            hourly_slots: bodyDto.hourly_slots,
        };
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