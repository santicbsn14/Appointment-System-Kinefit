import mongoose, { PaginateResult } from 'mongoose';
import patientSchema, {Patient} from '../Models/patientSchema';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';

interface IPatientRepository{
  getAll: (criteria :Criteria)=> Promise<Paginated<Patient>| null>,
  createPatient: (Patient: Patient)=> Promise<Patient | null>,
  getPatientById: (PatientId: IdMongo) => Promise<Patient | null>,
  updatePatient: (PatientId:IdMongo, body: Partial<Patient>) => Promise<Patient | null>,
  deletePatient: (PatientId: IdMongo) => Promise<string>,
}

class PatientRepository implements IPatientRepository{
  async getAll(criteria: Criteria):Promise<Paginated<Patient>| null> {
    let { limit = 30, page = 1 } = criteria;
    //@ts-ignore se vera luego...
    const patientDocuments:PaginateResult<Patient> = await patientSchema.paginate({}, { limit, page });

    if(!patientDocuments) throw new Error('Patients could not be accessed')
    if(!patientDocuments.page) patientDocuments.page = 1

    const mappedPatients = patientDocuments.docs.map((patient) => {
      return {
        _id: patient._id,
        user_id: patient._id,
        mutual: patient.mutual ? patient.mutual : null,
        clinical_data: patient.clinical_data
      }
    })
    return {
      docs: mappedPatients as Patient[],
      totalDocs: patientDocuments.totalDocs,
      limit: patientDocuments.limit,
      totalPages:patientDocuments.totalPages,
      pagingCounter: patientDocuments.pagingCounter,
      hasPrevPage: patientDocuments.hasPrevPage,
      hasNextPage: patientDocuments.hasNextPage,
      page: patientDocuments.page,
      prevPage: patientDocuments.prevPage,
      nextPage: patientDocuments.nextPage,
    };
  }
  async createPatient(body: Patient):Promise<Patient | null>{
    const newPatient :Patient = await patientSchema.create(body)
    if(!newPatient) throw new Error('A problem occurred when the patient was created')
    return {
      _id: newPatient._id,
      user_id: newPatient.user_id,
      mutual: newPatient.mutual ? newPatient.mutual : undefined,
      clinical_data: newPatient.clinical_data
    }
  }
  async getPatientById(id: IdMongo):Promise<Patient|null>{

    const patient = await patientSchema.findById(id)
    if(!patient) throw new Error('Patient could not found')
    return{
      _id: patient._id,
      user_id: patient.user_id,
      mutual: patient.mutual ? patient.mutual : undefined,
      clinical_data: patient.clinical_data
    }
  }
  async updatePatient(id: IdMongo, body :Partial<Patient>):Promise<Patient|null>{
    const updatedPatient = await patientSchema.findByIdAndUpdate(id, body, 
      { new: true, runValidators: true })
    if(!updatedPatient) throw new Error('A problem occurred when the patient was updated')
    
    return {
      _id: updatedPatient._id,
      user_id: updatedPatient.user_id,
      mutual: updatedPatient.mutual ? updatedPatient.mutual : undefined,
      clinical_data: updatedPatient.clinical_data
    }
  }
  async deletePatient(id:IdMongo):Promise<string>{
    const patientDeleted = await patientSchema.findByIdAndDelete(id)
    if(!patientDeleted) throw new Error('A problem occurred when the patient was deleted')
      return `Patient with ID ${id} has been successfully deleted.`;
  }
}
export default PatientRepository