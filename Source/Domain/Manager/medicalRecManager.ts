import container from "../../container";
import { type MedicalRecord } from "../../Data/Models/medicalRecSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createMedicalRecordValidation from "../Validations/CreatesValidation/createMedicalRecValidation";
import { CreateMedicalRecordDto } from "typesRequestDtos";
import mongoose from "mongoose";



class MedicalRecordManager {
    private notificationRepository

    constructor(){
        this.notificationRepository = container.resolve('MedicalRecordRepository');
    }
    async getAll(criteria: Criteria){
       return await this.notificationRepository.getAll(criteria)
    }
    async getMedicalRecordById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.notificationRepository.getMedicalRecordById(id)
    }
    async createMedicalRecord(bodyDto:CreateMedicalRecordDto){
        let body : MedicalRecord = {...bodyDto, pacient_id: new mongoose.Types.ObjectId(bodyDto.pacient_id)}
        await createMedicalRecordValidation.parseAsync(body)
        return await this.notificationRepository.createMedicalRecord(body)
    }
    async updateMedicalRecord(body:MedicalRecord, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.notificationRepository.updateMedicalRecord(body, id)
    }
    async deleteMedicalRecord(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.notificationRepository.deleteMedicalRecord(id)
    }
}
export default MedicalRecordManager