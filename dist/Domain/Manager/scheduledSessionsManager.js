import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createScheduledSessionsValidation from "../Validations/CreatesValidation/createScheduledSessions.js";
import mongoose from "mongoose";
class ScheduledSessionsManager {
    constructor() {
        this.scheduledSessionsRepository = container.resolve('ScheduledSessionsRepository');
    }
    async getAll(criteria) {
        return await this.scheduledSessionsRepository.getAll(criteria);
    }
    async getScheduledSessionsById(id) {
        let sid = new mongoose.Types.ObjectId(id);
        await idValidation.parseAsync(sid);
        return await this.scheduledSessionsRepository.getScheduledSessionsById(sid);
    }
    async createScheduledSessions(bodyDto) {
        let body = { ...bodyDto,
            pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id),
            professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id)
        };
        await createScheduledSessionsValidation.parseAsync(body);
        return await this.scheduledSessionsRepository.createScheduledSessions(body);
    }
    async updateScheduledSessions(body, id) {
        await idValidation.parseAsync(id);
        return await this.scheduledSessionsRepository.updateScheduledSessions(body, id);
    }
    async deleteScheduledSessions(id) {
        await idValidation.parseAsync(id);
        return await this.scheduledSessionsRepository.deleteScheduledSessions(id);
    }
}
export default ScheduledSessionsManager;
