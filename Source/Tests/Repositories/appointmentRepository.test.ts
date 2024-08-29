import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import AppointmentMongooseRepository from 'Source/Data/Repositories/appointmentMoongooseRepository';
import { Appointment } from 'Source/Data/Models/appointmentSchema';

describe('AppointmentMongooseRepository', () => {
    let repository: AppointmentMongooseRepository;
    let testAppointmentId: mongoose.Types.ObjectId;
  
    beforeAll(async () => {
      // Conectar a una base de datos de prueba
      await mongoose.connect('mongodb+srv://santicbsn9:9ayNHDJY3GTjdWi2@cluster-sistema-kinefit.gcon33o.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster-Sistema-Kinefit');
      repository = new AppointmentMongooseRepository();
    });
  
    afterAll(async () => {
      // Limpiar la base de datos y cerrar la conexión
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    });
  
    it('should create a new appointment', async () => {
      const appointmentData: Appointment = { pacient_id: new mongoose.Types.ObjectId(),
        professional_id: new mongoose.Types.ObjectId(),
        date_time: new Date(),
        schedule:{week_day:'Monday', time_slots:{start_time:'8:00hs', end_time:'15:00hs'}},
        state: 'Solicitado',
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
      if(result)
      expect(result.docs.length).toBeGreaterThan(0);
    });
  
    it('should update a appointment', async () => {
      const updateData = { state:'pendiente' };
      // @ts-ignore entorno de testing
      const updatedAppointment = await repository.updateAppointment(testAppointmentId, updateData);
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