import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import PatientMongooseRepository from 'Source/Data/Repositories/patientMongooseRepository';
import { Patient } from 'Source/Data/Models/patientSchema';

describe('PatientMongooseRepository', () => {
    let repository: PatientMongooseRepository;
    let testPatientId: mongoose.Types.ObjectId;
  
    beforeAll(async () => {
      // Conectar a una base de datos de prueba
      await mongoose.connect('mongodb+srv://santicbsn9:9ayNHDJY3GTjdWi2@cluster-sistema-kinefit.gcon33o.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster-Sistema-Kinefit');
      repository = new PatientMongooseRepository();
    });
  
    afterAll(async () => {
      // Limpiar la base de datos y cerrar la conexión
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    });
  
    it('should create a new patient', async () => {
      const patientData: Patient = {
        user_id: new mongoose.Types.ObjectId('66c65b641bb4017c5a0f3d14'),
        clinical_data: ['NUNCA DIABETes']
      };
  
      const result = await repository.createPatient(patientData);
      expect(result).toBeDefined();

      //@ts-ignore entorno de testing
      testPatientId = result?._id;
    });
  
    it('should get a patient by id', async () => {
      const patient = await repository.getPatientById(testPatientId);

      expect(patient).toBeDefined();
      expect(patient?._id).toEqual(testPatientId);
    });
  
    it('should get all patients', async () => {
      const result = await repository.getAll({ page: 1, limit: 10 });
      expect(result).toBeDefined();
      if(result)
      expect(result.docs.length).toBeGreaterThan(0);
    });
  
    it('should update a patient', async () => {
      const updateData = { user_id: new mongoose.Types.ObjectId('66c65b641bb4017c5a0f3d13') };
      // @ts-ignore entorno de testing
      const updatedPatient = await repository.updatePatient(testPatientId, updateData);
      expect(updatedPatient).toBeDefined();
      expect(updatedPatient?.user_id).toEqual(updateData.user_id);
    });
  
    it('should delete a patient', async () => {
      const result = await repository.deletePatient(testPatientId);
      expect(result).toContain('successfully deleted');
    });
  
    it('should throw an error when patient not found', async () => {
      await expect(repository.getPatientById(new mongoose.Types.ObjectId())).rejects.toThrow('Patient could not found');
    });
  });