import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import mongoose from "mongoose";
class ProfessionalManager {
    constructor() {
        this.professionalRepository = container.resolve('ProfessionalRepository');
    }
    async getAll(criteria) {
        return await this.professionalRepository.getAll(criteria);
    }
    async getProfessionalById(id) {
        await idValidation.parseAsync(id);
        return await this.professionalRepository.getProfessionalById(id);
    }
    async createProfessional(bodyDto) {
        let body = { ...bodyDto, user_id: new mongoose.Types.ObjectId(bodyDto.user_id) };
        await idValidation.parseAsync(body.user_id);
        return await this.professionalRepository.createProfessional(body);
    }
    async updateProfessional(body, id) {
        await idValidation.parseAsync(id);
        return await this.professionalRepository.updateProfessional(body, id);
    }
    async deleteProfessional(id) {
        await idValidation.parseAsync(id);
        return await this.professionalRepository.deleteProfessional(id);
    }
}
export default ProfessionalManager;
