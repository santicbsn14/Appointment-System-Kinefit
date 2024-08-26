import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createPatientValidation from "../Validations/CreatesValidation/createPatientValidation.js";
class PatientManager {
    constructor() {
        this.patientRepository = container.resolve('PatientRepository');
    }
    async getAll(criteria) {
        return await this.patientRepository.getAll(criteria);
    }
    async getPatientById(id) {
        await idValidation.parseAsync(id);
        return await this.patientRepository.getPatientById(id);
    }
    async createPatient(body) {
        await createPatientValidation.parseAsync(body);
        return await this.patientRepository.createPatient(body);
    }
    async updatePatient(body, id) {
        await idValidation.parseAsync(id);
        return await this.patientRepository.updatePatient(body, id);
    }
    async deletePatient(id) {
        await idValidation.parseAsync(id);
        return await this.patientRepository.deletePatient(id);
    }
}
export default PatientManager;
