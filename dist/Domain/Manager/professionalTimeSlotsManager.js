import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
class ProfessionalTimeSlotsManager {
    constructor() {
        this.professionalTimeSlotsRepository = container.resolve('ProfessionalTimeSlotsRepository');
        this.professionalRepository = container.resolve('ProfessionalRepository');
    }
    async getAll(criteria) {
        return await this.professionalTimeSlotsRepository.getAll(criteria);
    }
    async getProfessionalTimeSlotsById(id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.getProfessionalTimeSlotsById(id);
    }
    async getProfessionalTimeSlotsByPro(id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.getProfessionalTimeSlotsByPro(id);
    }
    async createProfessionalTimeSlots(bodyDto) {
        let body = { ...bodyDto, professional_id: bodyDto.professional_id };
        let verifyProfessional = this.professionalRepository.getProfessionalById(bodyDto.professional_id);
        if (!verifyProfessional)
            throw new Error('Professional not found');
        let verifyProTimeSlot = this.professionalTimeSlotsRepository.getProfessionalTimeSlotsByPro(bodyDto.professional_id);
        if (verifyProTimeSlot)
            throw new Error('El profesional ya tiene un horario creado');
        return await this.professionalTimeSlotsRepository.createProfessionalTimeSlots(body);
    }
    async updateProfessionalTimeSlots(body, id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.updateProfessionalTimeSlots(id, body);
    }
    async deleteProfessionalTimeSlots(id) {
        await idValidation.parseAsync(id);
        return await this.professionalTimeSlotsRepository.deleteProfessionalTimeSlots(id);
    }
}
export default ProfessionalTimeSlotsManager;
