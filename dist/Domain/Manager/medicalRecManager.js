import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createMedicalRecordValidation from "../Validations/CreatesValidation/createMedicalRecValidation.js";
class MedicalRecordManager {
    constructor() {
        this.notificationRepository = container.resolve('MedicalRecordRepository');
    }
    async getAll(criteria) {
        return await this.notificationRepository.getAll(criteria);
    }
    async getMedicalRecordById(id) {
        await idValidation.parseAsync(id);
        return await this.notificationRepository.getMedicalRecordById(id);
    }
    async createMedicalRecord(bodyDto) {
        let body = { ...bodyDto, pacient_id: bodyDto.pacient_id };
        await createMedicalRecordValidation.parseAsync(body);
        return await this.notificationRepository.createMedicalRecord(body);
    }
    async updateMedicalRecord(body, id) {
        await idValidation.parseAsync(id);
        return await this.notificationRepository.updateMedicalRecord(body, id);
    }
    async deleteMedicalRecord(id) {
        await idValidation.parseAsync(id);
        return await this.notificationRepository.deleteMedicalRecord(id);
    }
}
export default MedicalRecordManager;
