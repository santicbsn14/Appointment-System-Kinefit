import mongoose, { PaginateResult } from 'mongoose';
import scheduledSessionsSchema, {ScheduledSessions} from '../Models/scheduledSessionsSchema';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';

interface IScheduledSessionsRepository{
    getAll: (criteria :Criteria)=> Promise<Paginated<ScheduledSessions>| null>,
    createScheduledSessions: (scheduledSessions: ScheduledSessions)=> Promise<ScheduledSessions | null>,
    getScheduledSessionsById: (scheduledSessionsId: IdMongo) => Promise<ScheduledSessions | null>,
    updateScheduledSessions: (scheduledSessionsId:IdMongo, body: Partial<ScheduledSessions>) => Promise<ScheduledSessions | null>,
    deleteScheduledSessions: (scheduledSessionsId: IdMongo) => Promise<string>,
}

class ScheduledSessionsRepository implements IScheduledSessionsRepository{
    async getAll(criteria: Criteria):Promise<Paginated<ScheduledSessions>| null> {
      let { limit = 30, page = 1 } = criteria;
      //@ts-ignore se vera luego...
      const scheduledSessionsDocuments:PaginateResult<ScheduledSessions> = await scheduledSessionsSchema.paginate({}, { limit, page });
  
      if(!scheduledSessionsDocuments) throw new Error('ScheduledSessionss could not be accessed')
      if(!scheduledSessionsDocuments.page) scheduledSessionsDocuments.page = 1
  
      const mappedScheduledSessionss = scheduledSessionsDocuments.docs.map((scheduledSessions) => {
        return {
            _id: scheduledSessions._id,
            professional_id: scheduledSessions.professional_id,
            pacient_id: scheduledSessions.pacient_id,
            week_day: scheduledSessions.week_day,
            start_date: scheduledSessions.start_date,
            number_sessions: scheduledSessions.number_sessions,
            state: scheduledSessions.state,
            frequency: scheduledSessions.frequency
        }
      })
      return {
        docs: mappedScheduledSessionss ,
        totalDocs: scheduledSessionsDocuments.totalDocs,
        limit: scheduledSessionsDocuments.limit,
        totalPages:scheduledSessionsDocuments.totalPages,
        pagingCounter: scheduledSessionsDocuments.pagingCounter,
        hasPrevPage: scheduledSessionsDocuments.hasPrevPage,
        hasNextPage: scheduledSessionsDocuments.hasNextPage,
        page: scheduledSessionsDocuments.page,
        prevPage: scheduledSessionsDocuments.prevPage,
        nextPage: scheduledSessionsDocuments.nextPage,
      };
    }
    async createScheduledSessions(body: ScheduledSessions):Promise<ScheduledSessions | null>{
      const newScheduledSessions :ScheduledSessions = await scheduledSessionsSchema.create(body)
      if(!newScheduledSessions) throw new Error('A problem occurred when the ScheduledSessions was created')
        return {
            _id: newScheduledSessions._id,
            professional_id: newScheduledSessions.professional_id,
            pacient_id: newScheduledSessions.pacient_id,
            week_day: newScheduledSessions.week_day,
            start_date: newScheduledSessions.start_date,
            number_sessions: newScheduledSessions.number_sessions,
            state: newScheduledSessions.state,
            frequency: newScheduledSessions.frequency
        }
    }
    async getScheduledSessionsById(id: IdMongo):Promise<ScheduledSessions|null>{
  
      const scheduledSessions = await scheduledSessionsSchema.findById(id)
      if(!scheduledSessions) throw new Error('ScheduledSessions could not found')
        return {
            _id: scheduledSessions._id,
            professional_id: scheduledSessions.professional_id,
            pacient_id: scheduledSessions.pacient_id,
            week_day: scheduledSessions.week_day,
            start_date: scheduledSessions.start_date,
            number_sessions: scheduledSessions.number_sessions,
            state: scheduledSessions.state,
            frequency: scheduledSessions.frequency
        }
    }
    async updateScheduledSessions(id: IdMongo, body :Partial<ScheduledSessions>):Promise<ScheduledSessions|null>{
      const updatedScheduledSessions = await scheduledSessionsSchema.findByIdAndUpdate(id, body)
      if(!updatedScheduledSessions) throw new Error('A problem occurred when the ScheduledSessions was updated')
      
        return {
            _id: updatedScheduledSessions._id,
            professional_id: updatedScheduledSessions.professional_id,
            pacient_id: updatedScheduledSessions.pacient_id,
            week_day: updatedScheduledSessions.week_day,
            start_date: updatedScheduledSessions.start_date,
            number_sessions: updatedScheduledSessions.number_sessions,
            state: updatedScheduledSessions.state,
            frequency: updatedScheduledSessions.frequency
        }
    }
    async deleteScheduledSessions(id:IdMongo):Promise<string>{
      const scheduledSessionsDeleted = await scheduledSessionsSchema.findByIdAndDelete(id)
      if(!scheduledSessionsDeleted) throw new Error('A problem occurred when the ScheduledSessions was deleted')
        return `ScheduledSessions with ID ${id} has been successfully deleted.`;
    }
  }
  export default ScheduledSessionsRepository