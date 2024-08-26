import mongoose, { PaginateResult } from 'mongoose';
import medicalRecordSchema, {MedicalRecord} from '../Models/medicalRecSchema';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';

interface IMedicalRecordRepository{
    getAll: (criteria :Criteria)=> Promise<Paginated<MedicalRecord>| null>,
    createMedicalRecord: (MedicalRecord: MedicalRecord)=> Promise<MedicalRecord | null>,
    getMedicalRecordById: (MedicalRecordId: IdMongo) => Promise<MedicalRecord | null>,
    updateMedicalRecord: (MedicalRecordId:IdMongo, body: Partial<MedicalRecord>) => Promise<MedicalRecord | null>,
    deleteMedicalRecord: (MedicalRecordId: IdMongo) => Promise<string>,
}

class MedicalRecordRepository implements IMedicalRecordRepository{
    async getAll(criteria: Criteria):Promise<Paginated<MedicalRecord>| null> {
      let { limit = 30, page = 1 } = criteria;
      //@ts-ignore se vera luego...
      const medicalRecordDocuments:PaginateResult<MedicalRecord> = await medicalRecordSchema.paginate({}, { limit, page });
  
      if(!medicalRecordDocuments) throw new Error('MedicalRecords could not be accessed')
      if(!medicalRecordDocuments.page) medicalRecordDocuments.page = 1
  
      const mappedMedicalRecords = medicalRecordDocuments.docs.map((medicalRecord) => {
        return {
            _id: medicalRecord._id,
            pacient_id: medicalRecord.pacient_id,
            last_update: medicalRecord.last_update,
            notes: medicalRecord.notes,
            attachments: medicalRecord.attachments
        }
      })
      return {
        docs: mappedMedicalRecords ,
        totalDocs: medicalRecordDocuments.totalDocs,
        limit: medicalRecordDocuments.limit,
        totalPages:medicalRecordDocuments.totalPages,
        pagingCounter: medicalRecordDocuments.pagingCounter,
        hasPrevPage: medicalRecordDocuments.hasPrevPage,
        hasNextPage: medicalRecordDocuments.hasNextPage,
        page: medicalRecordDocuments.page,
        prevPage: medicalRecordDocuments.prevPage,
        nextPage: medicalRecordDocuments.nextPage,
      };
    }
    async createMedicalRecord(body: MedicalRecord):Promise<MedicalRecord | null>{
      const newMedicalRecord :MedicalRecord = await medicalRecordSchema.create(body)
      if(!newMedicalRecord) throw new Error('A problem occurred when the MedicalRecord was created')
        return {
            _id: newMedicalRecord._id,
            pacient_id: newMedicalRecord.pacient_id,
            last_update: newMedicalRecord.last_update,
            notes: newMedicalRecord.notes,
            attachments: newMedicalRecord.attachments
        }
    }
    async getMedicalRecordById(id: IdMongo):Promise<MedicalRecord|null>{
  
      const medicalRecord = await medicalRecordSchema.findById(id)
      if(!medicalRecord) throw new Error('MedicalRecord could not found')
        return {
            _id: medicalRecord._id,
            pacient_id: medicalRecord.pacient_id,
            last_update: medicalRecord.last_update,
            notes: medicalRecord.notes,
            attachments: medicalRecord.attachments
        }
    }
    async updateMedicalRecord(id: IdMongo, body :Partial<MedicalRecord>):Promise<MedicalRecord|null>{
      const updatedMedicalRecord = await medicalRecordSchema.findByIdAndUpdate(id, body)
      if(!updatedMedicalRecord) throw new Error('A problem occurred when the MedicalRecord was updated')
      
        return {
            _id: updatedMedicalRecord._id,
            pacient_id: updatedMedicalRecord.pacient_id,
            last_update: updatedMedicalRecord.last_update,
            notes: updatedMedicalRecord.notes,
            attachments: updatedMedicalRecord.attachments
        }
    }
    async deleteMedicalRecord(id:IdMongo):Promise<string>{
      const medicalRecordDeleted = await medicalRecordSchema.findByIdAndDelete(id)
      if(!medicalRecordDeleted) throw new Error('A problem occurred when the MedicalRecord was deleted')
        return `MedicalRecord with ID ${id} has been successfully deleted.`;
    }
  }
  export default MedicalRecordRepository