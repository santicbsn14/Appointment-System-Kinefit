import container from "../../container";
import { Patient } from "../../Data/Models/patientSchema";
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createPatientValidation from "../Validations/CreatesValidation/createPatientValidation";
import { CreatePatientDto } from "typesRequestDtos";
import { MedicalRecord } from "Source/Data/Models/medicalRecSchema";
import dayjs from "dayjs";
import { IUser, IUserPublic } from "Source/Data/Models/userSchema";


class PatientManager {
    private patientRepository
    private medicalRecordRepository
    private userRepository
    constructor(){
        this.patientRepository = container.resolve('PatientRepository');
        this.medicalRecordRepository = container.resolve('MedicalRecordRepository')
        this.userRepository = container.resolve('UserRepository')
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
        let verifyUser :IUserPublic = await this.userRepository.getUserById(body.user_id)
        if(!verifyUser)  throw new Error("User don't exist")
        if(verifyUser.role.name === "professional") throw new Error("Los profesionales no pueden ser pacientes")
        let verifyPatientExist = await this.patientRepository.getAll({user_id: body.user_id})
        if(verifyPatientExist.docs.length > 0) throw new Error('El usuario ya tiene un perfil de paciente creado')
        let patient  :Patient= await this.patientRepository.createPatient(body)
        return patient
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