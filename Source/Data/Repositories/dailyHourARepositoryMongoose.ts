import dailyHourAvailabilitySchema, { DailyHourAvailability } from "../Models/dailyHourASchema";
import mongoose, { PaginateResult } from 'mongoose';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';
import dayjs from "dayjs";

interface IDailyHourAvailabilityRepository{
    getAll: (criteria :Criteria)=> Promise<Paginated<DailyHourAvailability>| null>,
    createDailyHourAvailability: (DailyHourAvailability: DailyHourAvailability)=> Promise<DailyHourAvailability | null>,
    getDailyHourAvailabilityById: (DailyHourAvailabilityId: IdMongo) => Promise<DailyHourAvailability | null>,
    getDailyHourAvailabilityByDate: (date: dayjs.Dayjs) => Promise<DailyHourAvailability| null| string>,
    updateDailyHourAvailability: (DailyHourAvailabilityId:IdMongo, body: Partial<DailyHourAvailability>) => Promise<DailyHourAvailability | null>,
    deleteDailyHourAvailability: (DailyHourAvailabilityId: IdMongo) => Promise<string>,
}

class DailyHourAvailabilityRepository implements IDailyHourAvailabilityRepository{
    async getAll(criteria: Criteria):Promise<Paginated<DailyHourAvailability>| null> {
      let { limit = 30, page = 1 } = criteria;
      //@ts-ignore se vera luego...
      const dailyHourAvailabilityDocuments:PaginateResult<DailyHourAvailability> = await dailyHourAvailabilitySchema.paginate({}, { limit, page });
  
      if(!dailyHourAvailabilityDocuments) throw new Error('DailyHourAvailabilitys could not be accessed')
      if(!dailyHourAvailabilityDocuments.page) dailyHourAvailabilityDocuments.page = 1
  
      const mappedDailyHourAvailabilitys = dailyHourAvailabilityDocuments.docs.map((dailyHourAvailability) => {
        return {
            _id: dailyHourAvailability._id,
            professional_id: dailyHourAvailability.professional_id,
            date: dailyHourAvailability.date,
            hourly_slots: dailyHourAvailability.hourly_slots
        }
      })
      return {
        docs: mappedDailyHourAvailabilitys ,
        totalDocs: dailyHourAvailabilityDocuments.totalDocs,
        limit: dailyHourAvailabilityDocuments.limit,
        totalPages:dailyHourAvailabilityDocuments.totalPages,
        pagingCounter: dailyHourAvailabilityDocuments.pagingCounter,
        hasPrevPage: dailyHourAvailabilityDocuments.hasPrevPage,
        hasNextPage: dailyHourAvailabilityDocuments.hasNextPage,
        page: dailyHourAvailabilityDocuments.page,
        prevPage: dailyHourAvailabilityDocuments.prevPage,
        nextPage: dailyHourAvailabilityDocuments.nextPage,
      };
    }
    async createDailyHourAvailability(body: DailyHourAvailability):Promise<DailyHourAvailability | null>{
      const newDailyHourAvailability :DailyHourAvailability = await dailyHourAvailabilitySchema.create(body)
      if(!newDailyHourAvailability) throw new Error('A problem occurred when the DailyHourAvailability was created')
        return {
            _id: newDailyHourAvailability._id,
            professional_id:newDailyHourAvailability.professional_id,
            date: newDailyHourAvailability.date,
            hourly_slots: newDailyHourAvailability.hourly_slots
        }
    }
    async getDailyHourAvailabilityById(id: IdMongo):Promise<DailyHourAvailability|null>{
  
      const dailyHourAvailability = await dailyHourAvailabilitySchema.findById(id)
      if(!dailyHourAvailability) throw new Error('DailyHourAvailability could not found')
        return {
            _id: dailyHourAvailability._id,
            professional_id: dailyHourAvailability.professional_id,
            date: dailyHourAvailability.date,
            hourly_slots: dailyHourAvailability.hourly_slots
        }
    }
    async getDailyHourAvailabilityByDate(date: dayjs.Dayjs, professional_id?: IdMongo):Promise<DailyHourAvailability|null|string>{
      let dateOfDay = date.startOf('day')
      let dailyHourAvailability = await dailyHourAvailabilitySchema.findOne({date: dateOfDay})
      
      if(!dailyHourAvailability) {
          if (!professional_id) {
            throw new Error("professional_id is required to create a new DailyHourAvailability");
          }
             dailyHourAvailability = await dailyHourAvailabilitySchema.create({
             professional_id: professional_id,
             date:dayjs(date),
             hourly_slots:[{hour: date.toDate().getUTCHours(),
               max_sessions:6,
               current_sessions:1
             }]
           })
      }
        return {
            _id: dailyHourAvailability._id,
            professional_id: dailyHourAvailability.professional_id,
            date: dailyHourAvailability.date,
            hourly_slots: dailyHourAvailability.hourly_slots
        }
    }
    async updateDailyHourAvailability(id: IdMongo, body :Partial<DailyHourAvailability>):Promise<DailyHourAvailability|null>{
      const updatedDailyHourAvailability = await dailyHourAvailabilitySchema.findByIdAndUpdate(id, body, 
        { new: true, runValidators: true })
      if(!updatedDailyHourAvailability) throw new Error('A problem occurred when the DailyHourAvailability was updated')
        return {
            _id: updatedDailyHourAvailability._id,
            professional_id: updatedDailyHourAvailability.professional_id,
            date: updatedDailyHourAvailability.date,
            hourly_slots: updatedDailyHourAvailability.hourly_slots
        }
    }
    async deleteDailyHourAvailability(id:IdMongo):Promise<string>{
      const dailyHourAvailabilityDeleted = await dailyHourAvailabilitySchema.findByIdAndDelete(id)
      if(!dailyHourAvailabilityDeleted) throw new Error('A problem occurred when the DailyHourAvailability was deleted')
        return `DailyHourAvailability with ID ${id} has been successfully deleted.`;
    }
  }
  export default DailyHourAvailabilityRepository
