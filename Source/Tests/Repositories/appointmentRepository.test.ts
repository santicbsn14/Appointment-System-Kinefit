import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose, {model} from 'mongoose';
import AppointmentMongooseRepository from 'Source/Data/Repositories/appointmentMoongooseRepository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Appointment } from 'Source/Data/Models/appointmentSchema';
import dayjs from 'dayjs';
import patientSchema from 'Source/Data/Models/patientSchema';
import userSchema from 'Source/Data/Models/userSchema';

describe('AppointmentMongooseRepository', () => {
    let repository: AppointmentMongooseRepository;
    let testAppointmentId: mongoose.Types.ObjectId;
    let mongoServer: MongoMemoryServer;
    let userId: mongoose.Types.ObjectId;
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      //@ts-ignore
      await mongoose.connect(uri);
      repository = new AppointmentMongooseRepository();
      const user = await userSchema.create({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        age: 30,
        dni: 12345678,
        homeAdress: '123 Main St',
        phone: 1234567890,
        role: new mongoose.Types.ObjectId(),
        status: true,
        password: 'password123'
      });
      userId = user._id; 
  
      // Crea un paciente referenciando el usuario creado
      await patientSchema.create({
        user_id: userId,
        mutual: 'someMutual',
        clinical_data: []
      });
      
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });
  
    it('should create a new appointment', async () => {
      const appointmentData: Appointment = { pacient_id: new mongoose.Types.ObjectId(),
        professional_id: new mongoose.Types.ObjectId(),
        date_time: dayjs(new Date()),
        schedule:{week_day:1, time_slots:{start_time: dayjs(new Date()), end_time:dayjs(new Date())}},
        state: 'Solicitado',
        order_photo:'url://httpjjs.com',
        session_type: 'string'
            }
  
      const result = await repository.createAppointment(appointmentData);
      expect(result).toBeDefined();

      //@ts-ignore entorno de testing
      testAppointmentId = result?._id;
    });
  
    it('should get a appointment by id', async () => {
      const appointment = await repository.getAppointmentById(testAppointmentId);

      expect(appointment).toBeDefined();
      expect(appointment?._id).toEqual(testAppointmentId);
    });
  
    it('should get all appointments', async () => {
      const result = await repository.getAll({ page: 1, limit: 10 });
      expect(result).toBeDefined();
      if (result) expect(result.docs.length).toBeGreaterThan(0);
  });

  it('should update a appointment', async () => {
      const updateData = { state: 'pendiente' };
      console.log(testAppointmentId)
      // @ts-ignore entorno de testing
      const updatedAppointment = await repository.updateAppointment(updateData, testAppointmentId);
      expect(updatedAppointment).toBeDefined();
      expect(updatedAppointment?.state).toEqual(updateData.state);
  });
  
    it('should delete a appointment', async () => {
      const result = await repository.deleteAppointment(testAppointmentId);
      expect(result).toContain('successfully deleted');
    });
  
    it('should throw an error when appointment not found', async () => {
      await expect(repository.getAppointmentById(new mongoose.Types.ObjectId())).rejects.toThrow('Appointment could not found');
    });
  });