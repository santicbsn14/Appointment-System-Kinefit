import container from "../../container";
import { Patient } from "../../Data/Models/patientSchema";
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createPatientValidation from "../Validations/CreatesValidation/createPatientValidation";
import { CreatePatientDto } from "typesRequestDtos";


class PatientManager {
    private patientRepository

    constructor(){
        this.patientRepository = container.resolve('PatientRepository');
    }
    async getAll(criteria: Criteria){
       return await this.patientRepository.getAll(criteria)
    }
    async getPatientById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.patientRepository.getPatientById(id)
    }
    async createPatient(body:CreatePatientDto){
        await createPatientValidation.parseAsync(body)
        return await this.patientRepository.createPatient(body)
    }
    async updatePatient(body:Patient, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.patientRepository.updatePatient(body, id)
    }
    async deletePatient(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.patientRepository.deletePatient(id)
    }
}
export default PatientManager