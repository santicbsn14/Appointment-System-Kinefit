import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createProfessionalTimeSlotsValidation from "../Validations/CreatesValidation/createProfessionalTimesSlots.js";
import mongoose from "mongoose";
class ProfessionalTimeSlotsManager {
    constructor() {
        this.professionalTimeSlotsRepository = container.resolve('ProfessionalTimeSlotsRepository');
    }
    async getAll(criteria) {
        return await this.professionalTimeSlotsRepository.getAll(criteria);
    }
    async getProfessionalTimeSlotsById(id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.getProfessionalTimeSlotsById(id);
    }
    async createProfessionalTimeSlots(bodyDto) {
        let body = { ...bodyDto, professional_id: new mongoose.Types.ObjectId(bodyDto.professional_id) };
        await createProfessionalTimeSlotsValidation.parseAsync(body);
        return await this.professionalTimeSlotsRepository.createProfessionalTimeSlots(body);
    }
    async updateProfessionalTimeSlots(body, id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.updateProfessionalTimeSlots(body, id);
    }
    async deleteProfessionalTimeSlots(id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.deleteProfessionalTimeSlots(id);
    }
}
export default ProfessionalTimeSlotsManager;
