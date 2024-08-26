import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createProfessionalTimesSlotsValidation from "../Validations/CreatesValidation/createProfessionalTimesSlots.js";
class ProfessionalTimesSlotsManager {
    constructor() {
        this.professionalTimeSlotsRepository = container.resolve('ProfessionalTimesSlotsRepository');
    }
    async getAll(criteria) {
        return await this.professionalTimeSlotsRepository.getAll(criteria);
    }
    async getProfessionalTimesSlotsById(id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.getProfessionalTimesSlotsById(id);
    }
    async createProfessionalTimesSlots(body) {
        await createProfessionalTimesSlotsValidation.parseAsync(body);
        return await this.professionalTimeSlotsRepository.createProfessionalTimesSlots(body);
    }
    async updateProfessionalTimesSlots(body, id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.updateProfessionalTimesSlots(body, id);
    }
    async deleteProfessionalTimesSlots(id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.deleteProfessionalTimesSlots(id);
    }
}
export default ProfessionalTimesSlotsManager;
