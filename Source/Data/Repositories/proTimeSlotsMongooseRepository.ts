import mongoose, { PaginateResult } from 'mongoose';
import professionalTimesSlotsSchema, {ProfessionalTimesSlots} from '../Models/professionalTimeSlotsSchema';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';

interface IProfessionalTimeSlotsRepository{
    getAll: (criteria :Criteria)=> Promise<Paginated<ProfessionalTimesSlots>| null>,
    createProfessionalTimesSlots: (professionalTimesSlots: ProfessionalTimesSlots)=> Promise<ProfessionalTimesSlots | null>,
    getProfessionalTimesSlotsById: (professionalTimesSlotsId: IdMongo) => Promise<ProfessionalTimesSlots | null>,
    updateProfessionalTimesSlots: (professionalTimesSlotsId:IdMongo, body: Partial<ProfessionalTimesSlots>) => Promise<ProfessionalTimesSlots | null>,
    deleteProfessionalTimesSlots: (professionalTimesSlotsId: IdMongo) => Promise<string>,
}

class ProfessionalTimesSlotsRepository implements IProfessionalTimeSlotsRepository{
    async getAll(criteria: Criteria):Promise<Paginated<ProfessionalTimesSlots>| null> {
      let { limit = 30, page = 1 } = criteria;
      //@ts-ignore se vera luego...
      const professionalTimesSlotsDocuments:PaginateResult<ProfessionalTimesSlots> = await professionalTimesSlotsSchema.paginate({}, { limit, page });
  
      if(!professionalTimesSlotsDocuments) throw new Error('ProfessionalTimesSlotss could not be accessed')
      if(!professionalTimesSlotsDocuments.page) professionalTimesSlotsDocuments.page = 1
  
      const mappedProfessionalTimesSlots = professionalTimesSlotsDocuments.docs.map((professionalTimesSlot) => {
        return {
            _id: professionalTimesSlot._id,
            professional_id: professionalTimesSlot.professional_id,
            week_day: professionalTimesSlot.week_day,
            start_time: professionalTimesSlot.start_time,
            end_time: professionalTimesSlot.end_time,
            state: professionalTimesSlot.state
        }
      })
      return {
        docs: mappedProfessionalTimesSlots ,
        totalDocs: professionalTimesSlotsDocuments.totalDocs,
        limit: professionalTimesSlotsDocuments.limit,
        totalPages:professionalTimesSlotsDocuments.totalPages,
        pagingCounter: professionalTimesSlotsDocuments.pagingCounter,
        hasPrevPage: professionalTimesSlotsDocuments.hasPrevPage,
        hasNextPage: professionalTimesSlotsDocuments.hasNextPage,
        page: professionalTimesSlotsDocuments.page,
        prevPage: professionalTimesSlotsDocuments.prevPage,
        nextPage: professionalTimesSlotsDocuments.nextPage,
      };
    }
    async createProfessionalTimesSlots(body: ProfessionalTimesSlots):Promise<ProfessionalTimesSlots | null>{
      const newProfessionalTimesSlot :ProfessionalTimesSlots = await professionalTimesSlotsSchema.create(body)
      if(!newProfessionalTimesSlot) throw new Error('A problem occurred when the ProfessionalTimesSlots was created')
        return {
            _id: newProfessionalTimesSlot._id,
            professional_id: newProfessionalTimesSlot.professional_id,
            week_day: newProfessionalTimesSlot.week_day,
            start_time: newProfessionalTimesSlot.start_time,
            end_time: newProfessionalTimesSlot.end_time,
            state: newProfessionalTimesSlot.state
        }
    }
    async getProfessionalTimesSlotsById(id: IdMongo):Promise<ProfessionalTimesSlots|null>{
  
      const ProfessionalTimesSlot = await professionalTimesSlotsSchema.findById(id)
      if(!ProfessionalTimesSlot) throw new Error('ProfessionalTimesSlots could not found')
        return {
            _id: ProfessionalTimesSlot._id,
            professional_id: ProfessionalTimesSlot.professional_id,
            week_day: ProfessionalTimesSlot.week_day,
            start_time: ProfessionalTimesSlot.start_time,
            end_time: ProfessionalTimesSlot.end_time,
            state: ProfessionalTimesSlot.state
        }
    }
    async updateProfessionalTimesSlots(id: IdMongo, body :Partial<ProfessionalTimesSlots>):Promise<ProfessionalTimesSlots|null>{
      const updatedProfessionalTimesSlot = await professionalTimesSlotsSchema.findByIdAndUpdate(id, body)
      if(!updatedProfessionalTimesSlot) throw new Error('A problem occurred when the ProfessionalTimesSlots was updated')
      
        return {
            _id: updatedProfessionalTimesSlot._id,
            professional_id: updatedProfessionalTimesSlot.professional_id,
            week_day: updatedProfessionalTimesSlot.week_day,
            start_time: updatedProfessionalTimesSlot.start_time,
            end_time: updatedProfessionalTimesSlot.end_time,
            state: updatedProfessionalTimesSlot.state
        }
    }
    async deleteProfessionalTimesSlots(id:IdMongo):Promise<string>{
      const ProfessionalTimesSlotsDeleted = await professionalTimesSlotsSchema.findByIdAndDelete(id)
      if(!ProfessionalTimesSlotsDeleted) throw new Error('A problem occurred when the ProfessionalTimesSlots was deleted')
        return `ProfessionalTimesSlots with ID ${id} has been successfully deleted.`;
    }
  }
  export default ProfessionalTimesSlotsRepository