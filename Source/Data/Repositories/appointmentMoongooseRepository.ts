import mongoose, { PaginateResult } from 'mongoose';
import appointmentSchema, {Appointment} from '../Models/appointmentSchema';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';
import { populate } from 'dotenv';

interface IAppointmentRepository{
    getAll: (criteria :Criteria)=> Promise<Paginated<Appointment>| null>,
    createAppointment: (Appointment: Appointment)=> Promise<Appointment | null>,
    getAppointmentById: (AppointmentId: IdMongo) => Promise<Appointment | null>,
    updateAppointment: (body: Partial<Appointment>, AppointmentId:IdMongo, ) => Promise<Appointment | null>,
    deleteAppointment: (AppointmentId: IdMongo) => Promise<string>,
}

class AppointmentRepository implements IAppointmentRepository{
    async getAll(criteria: Criteria):Promise<Paginated<Appointment>| null> {
      let { limit = 30, page = 1, ...filters } = criteria; // Extrae los filtros
      //@ts-ignore se vera luego...
      const appointmentDocuments:PaginateResult<Appointment> = await appointmentSchema.paginate(filters, { limit, page,
        populate:[{ path: 'pacient_id' },
          { 
              path: 'professional_id',
              populate: {
                  path: 'user_id', // Asegúrate de que este campo es el correcto
                  model: 'users' // El nombre del modelo que deseas poblar
              }
          }]
       });
  
      if(!appointmentDocuments) throw new Error('Appointments could not be accessed')
      if(!appointmentDocuments.page) appointmentDocuments.page = 1
  
      const mappedAppointments = appointmentDocuments.docs.map((appointment) => {
        return {
            _id: appointment._id,
            pacient_id: appointment.pacient_id,
            professional_id: appointment.professional_id,
            date_time: appointment.date_time,
            schedule: appointment.schedule,
            state: appointment.state,
            order_photo:appointment.order_photo,
            session_type: appointment.session_type
        }
      })
      return {
        docs: mappedAppointments ,
        totalDocs: appointmentDocuments.totalDocs,
        limit: appointmentDocuments.limit,
        totalPages:appointmentDocuments.totalPages,
        pagingCounter: appointmentDocuments.pagingCounter,
        hasPrevPage: appointmentDocuments.hasPrevPage,
        hasNextPage: appointmentDocuments.hasNextPage,
        page: appointmentDocuments.page,
        prevPage: appointmentDocuments.prevPage,
        nextPage: appointmentDocuments.nextPage,
      };
    }
    async createAppointment(body: Appointment):Promise<Appointment | null>{
      const newAppointment :Appointment = await appointmentSchema.create(body)
      if(!newAppointment) throw new Error('A problem occurred when the Appointment was created')
        return {
            _id: newAppointment._id,
            pacient_id: newAppointment.pacient_id,
            professional_id: newAppointment.professional_id,
            date_time: newAppointment.date_time,
            schedule: newAppointment.schedule,
            state: newAppointment.state,
            order_photo:newAppointment.order_photo,
            session_type: newAppointment.session_type
        }
    }
    async getAppointmentById(id: IdMongo):Promise<Appointment|null>{
  
      const appointment = await appointmentSchema.findById(id).populate(['pacient_id','professional_id'])
      if(!appointment) throw new Error('Appointment could not found')
        return {
            _id: appointment._id,
            pacient_id: appointment.pacient_id,
            professional_id: appointment.professional_id,
            date_time: appointment.date_time,
            schedule: appointment.schedule,
            state: appointment.state,
            order_photo:appointment.order_photo,
            session_type: appointment.session_type
        }
    }
    async updateAppointment(body :Partial<Appointment>, id: IdMongo):Promise<Appointment|null>{
      const updatedAppointment = await appointmentSchema.findByIdAndUpdate(id, body, 
        { new: true, runValidators: true })
      if(!updatedAppointment) throw new Error('A problem occurred when the Appointment was updated')
      
        return {
            _id: updatedAppointment._id,
            pacient_id: updatedAppointment.pacient_id,
            professional_id: updatedAppointment.professional_id,
            date_time: updatedAppointment.date_time,
            schedule: updatedAppointment.schedule,
            state: updatedAppointment.state,
            order_photo:updatedAppointment.order_photo,
            session_type: updatedAppointment.session_type
        }
    }
    async deleteAppointment(id:IdMongo):Promise<string>{
      const appointmentDeleted = await appointmentSchema.findByIdAndDelete(id)
      if(!appointmentDeleted) throw new Error('A problem occurred when the Appointment was deleted')
        return `Appointment with ID ${id} has been successfully deleted.`;
    }
  }
  export default AppointmentRepository