import container from "../../container.js";
import idValidation from "../Validations/idValidation.js";
import createPatientValidation from "../Validations/CreatesValidation/createPatientValidation.js";
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
        let verifyUser = await this.userRepository.getUserById(body.user_id);
        if (!verifyUser)
            throw new Error("User don't exist");
        if (verifyUser.role.name === "professional")
            throw new Error("Los profesionales no pueden ser pacientes");
        let verifyPatientExist = await this.patientRepository.getAll({ user_id: body.user_id });
        if (verifyPatientExist.docs.length > 0)
            throw new Error('El usuario ya tiene un perfil de paciente creado');
        let patient = await this.patientRepository.createPatient(body);
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
