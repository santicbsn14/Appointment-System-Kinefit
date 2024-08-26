import container from "../../container";
import { type ScheduledSessions } from "../../Data/Models/scheduledSessionsSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createScheduledSessionsValidation from "../Validations/CreatesValidation/createScheduledSessions";
import mongoose from "mongoose";
import { CreateScheduledSessionsDto } from "typesRequestDtos";



class ScheduledSessionsManager {
    private scheduledSessionsRepository

    constructor(){
        this.scheduledSessionsRepository = container.resolve('ScheduledSessionsRepository');
    }
    async getAll(criteria: Criteria){
       return await this.scheduledSessionsRepository.getAll(criteria)
    }
    async getScheduledSessionsById(id: IdMongo){
        let sid = new mongoose.Types.ObjectId(id)
        await idValidation.parseAsync(sid)
        return await this.scheduledSessionsRepository.getScheduledSessionsById(sid)
    }
    async createScheduledSessions(bodyDto:CreateScheduledSessionsDto){
        let body = {...bodyDto,
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id)
        }
        await createScheduledSessionsValidation.parseAsync(body)
        return await this.scheduledSessionsRepository.createScheduledSessions(body)
    }
    async updateScheduledSessions(body:ScheduledSessions, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.scheduledSessionsRepository.updateScheduledSessions(body, id)
    }
    async deleteScheduledSessions(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.scheduledSessionsRepository.deleteScheduledSessions(id)
    }
}
export default ScheduledSessionsManager