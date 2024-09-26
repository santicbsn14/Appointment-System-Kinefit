import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createPatientValidation from "../Validations/CreatesValidation/createPatientValidation.js";
import dayjs from "dayjs";
class PatientManager {
    constructor() {
        this.patientRepository = container.resolve('PatientRepository');
        this.medicalRecordRepository = container.resolve('MedicalRecordRepository');
        this.userRepository = container.resolve('UserRepository');
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
        let patient = await this.patientRepository.createPatient(body);
        let verifyUser = this.userRepository.getUserById(body.user_id);
        if (!verifyUser)
            throw new Error("User don't exist");
        let medicalRecord = await this.medicalRecordRepository.createMedicalRecord({ patient_id: patient._id,
            last_update: dayjs(new Date()),
            notes: patient.clinical_data,
            attachments: ''
        });
        return patient;
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
