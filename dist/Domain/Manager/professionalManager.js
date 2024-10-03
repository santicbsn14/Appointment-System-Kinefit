import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
class ProfessionalManager {
    constructor() {
        this.professionalRepository = container.resolve('ProfessionalRepository');
        this.userRepository = container.resolve('UserRepository');
    }
    async getAll(criteria) {
        return await this.professionalRepository.getAll(criteria);
    }
    async getProfessionalById(id) {
        await idValidation.parseAsync(id);
        return await this.professionalRepository.getProfessionalById(id);
    }
    async createProfessional(bodyDto) {
        let body = { ...bodyDto, user_id: bodyDto.user_id };
        await idValidation.parseAsync(body.user_id);
        let verifyUser = await this.userRepository.getUserById(bodyDto.user_id);
        if (!verifyUser)
            throw new Error("User don't exist");
        if (verifyUser.role.name === "patient")
            throw new Error("Los pacientes no pueden ser profesionales");
        let verifyProfessionalExist = await this.professionalRepository.getAll({ user_id: body.user_id });
        if (verifyProfessionalExist.docs.length > 0)
            throw new Error('El usuario ya tiene un perfil de profesional creado');
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
