import container from "../../container";
import { type ScheduledSessions } from "../../Data/Models/scheduledSessionsSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createScheduledSessionsValidation from "../Validations/CreatesValidation/createScheduledSessions";
import mongoose from "mongoose";
import { CreateScheduledSessionsDto } from "typesRequestDtos";
import { ProfessionalTimeSlots } from "Source/Data/Models/professionalTimeSlotsSchema";
import { isAvailable } from "../../Utils/scheduleUtils";


class ScheduledSessionsManager {
    private scheduledSessionsRepository
    private professionalTimeSlotRepository

    constructor(){
        this.scheduledSessionsRepository = container.resolve('ScheduledSessionsRepository');
        this.professionalTimeSlotRepository = container.resolve('ProfessionalTimeSlotRepository')
        
    }
    async getAll(criteria: Criteria){
       return await this.scheduledSessionsRepository.getAll(criteria)
    }
    async getScheduledSessionsById(id: IdMongo){
        let sid = new mongoose.Types.ObjectId(id)
        await idValidation.parseAsync(sid)
        return await this.scheduledSessionsRepository.getScheduledSessionsById(sid)
    }
    async createScheduledSessions(bodyDto: CreateScheduledSessionsDto) {
        let body: ScheduledSessions = {
            ...bodyDto,
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id),
            state: 'Pending',
            next_date: new Date(bodyDto.start_date)
        };

        await createScheduledSessionsValidation.parseAsync(body);

        let proTimeSlots: ProfessionalTimeSlots | null = await this.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro(body.professional_id);
        if (!proTimeSlots) throw new Error('Professional not found');

        const isAvailableSlot  = isAvailable(proTimeSlots.schedule, body.session_dates);
        if (!isAvailableSlot) throw new Error('The professional is not work in that times');

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