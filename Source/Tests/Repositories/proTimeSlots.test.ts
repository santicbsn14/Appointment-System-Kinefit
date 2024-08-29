import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import ProfessionalTimeSlotsMongooseRepository from 'Source/Data/Repositories/proTimeSlotsMongooseRepository';
import { ProfessionalTimeSlots } from 'Source/Data/Models/professionalTimeSlotsSchema';


describe('ProfessionalTimeSlotsMongooseRepository', () => {
    let repository: ProfessionalTimeSlotsMongooseRepository;
    let testProfessionalTimeSlotsId: mongoose.Types.ObjectId;
  
    beforeAll(async () => {
      // Conectar a una base de datos de prueba
      await mongoose.connect('mongodb+srv://santicbsn9:9ayNHDJY3GTjdWi2@cluster-sistema-kinefit.gcon33o.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster-Sistema-Kinefit');
      repository = new ProfessionalTimeSlotsMongooseRepository();
    });
  
    afterAll(async () => {
      // Limpiar la base de datos y cerrar la conexión
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    });
  
    it('should create a new professionalTimeSlots', async () => {
      const professionalTimeSlotsData: ProfessionalTimeSlots = {
        professional_id: new mongoose.Types.ObjectId(),
        schedule:[{week_day:'Monday', time_slots:{start_time:'8:00hs', end_time:'15:00hs'}}],
        state: 'Disponible'
    }
  
      const result = await repository.createProfessionalTimeSlots(professionalTimeSlotsData);
      expect(result).toBeDefined();

      //@ts-ignore entorno de testing
      testProfessionalTimeSlotsId = result?._id;
    });
  
    it('should get a professionalTimeSlots by id', async () => {
      const professionalTimeSlots = await repository.getProfessionalTimeSlotsById(testProfessionalTimeSlotsId);
      console.log(professionalTimeSlots)
      expect(professionalTimeSlots).toBeDefined();
      expect(professionalTimeSlots?._id).toEqual(testProfessionalTimeSlotsId);
    });
  
    it('should get all professionalTimeSlotss', async () => {
      const result = await repository.getAll({ page: 1, limit: 10 });
      expect(result).toBeDefined();
      if(result)
      expect(result.docs.length).toBeGreaterThan(0);
    });
  
    it('should update a professionalTimeSlots', async () => {
      const updateData = { state:'Vacaciones' };
      // @ts-ignore entorno de testing
      const updatedProfessionalTimeSlots = await repository.updateProfessionalTimeSlots(testProfessionalTimeSlotsId, updateData);
      expect(updatedProfessionalTimeSlots).toBeDefined();
      expect(updatedProfessionalTimeSlots?.state).toEqual(updateData.state);
    });
  
    it('should delete a professionalTimeSlots', async () => {
      const result = await repository.deleteProfessionalTimeSlots(testProfessionalTimeSlotsId);
      expect(result).toContain('successfully deleted');
    });
  
    it('should throw an error when professionalTimeSlots not found', async () => {
      await expect(repository.getProfessionalTimeSlotsById(new mongoose.Types.ObjectId())).rejects.toThrow('ProfessionalTimeSlots could not found');
    });
  });