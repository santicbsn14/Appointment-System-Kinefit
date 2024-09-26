import mongoose, { PaginateResult } from 'mongoose';
import professionalSchema, {Professional} from '../Models/professionalSchema';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';

interface IProfessionalRepository{
  getAll: (criteria :Criteria)=> Promise<Paginated<Professional>| null>,
  createProfessional: (Professional: Professional)=> Promise<Professional | null>,
  getProfessionalById: (ProfessionalId: IdMongo) => Promise<Professional | null>,
  updateProfessional: (ProfessionalId:IdMongo, body: Partial<Professional>) => Promise<Professional | null>,
  deleteProfessional: (ProfessionalId: IdMongo) => Promise<string>,
}

class ProfessionalRepository implements IProfessionalRepository{
  async getAll(criteria: Criteria):Promise<Paginated<Professional>| null> {
    let { limit = 30, page = 1 } = criteria;
    //@ts-ignore se vera luego...
    const professionalDocuments:PaginateResult<Professional> = await professionalSchema.paginate({}, { 
      limit, 
      page, 
      populate: 'user_id' 
    });

    if(!professionalDocuments) throw new Error('Professionals could not be accessed')
    if(!professionalDocuments.page) professionalDocuments.page = 1

    const mappedProfessionals = professionalDocuments.docs.map((professional) => {
      return {
        user_id: professional.user_id,
        _id: professional._id,
        specialties: professional.specialties
      }
    })
    
    return {
      docs: mappedProfessionals as Professional[],
      totalDocs: professionalDocuments.totalDocs,
      limit: professionalDocuments.limit,
      totalPages:professionalDocuments.totalPages,
      pagingCounter: professionalDocuments.pagingCounter,
      hasPrevPage: professionalDocuments.hasPrevPage,
      hasNextPage: professionalDocuments.hasNextPage,
      page: professionalDocuments.page,
      prevPage: professionalDocuments.prevPage,
      nextPage: professionalDocuments.nextPage,
    };
  }
  async createProfessional(body: Professional):Promise<Professional | null>{
    const newProfessional :Professional = await (await professionalSchema.create(body)).populate('user_id')
    if(!newProfessional) throw new Error('A problem occurred when the Professional was created')
      
    return {
      _id: newProfessional._id,
      user_id: newProfessional.user_id,
      specialties: newProfessional.specialties
    }
  }
  async getProfessionalById(id: IdMongo):Promise<Professional|null>{

    const professional = await professionalSchema.findById(id).populate('user_id')
    if(!professional) throw new Error('Professional could not found')
    return{
      _id: professional._id,
      user_id: professional.user_id,
      specialties: professional.specialties
    }
  }
  async updateProfessional(id: IdMongo, body :Partial<Professional>):Promise<Professional|null>{
    const updatedProfessional = await professionalSchema.findByIdAndUpdate(id, body, 
      { new: true, runValidators: true }).populate('user_id')
    if(!updatedProfessional) throw new Error('A problem occurred when the Professional was updated')
    
    return {
      _id: updatedProfessional._id,
      user_id: updatedProfessional.user_id,
      specialties: updatedProfessional.specialties
    }
  }
  async deleteProfessional(id:IdMongo):Promise<string>{
    const ProfessionalDeleted = await professionalSchema.findByIdAndDelete(id)
    if(!ProfessionalDeleted) throw new Error('A problem occurred when the Professional was deleted')
      return `Professional with ID ${id} has been successfully deleted.`;
  }
}
export default ProfessionalRepository