import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import MedicalRecordMongooseRepository from 'Source/Data/Repositories/medicalRecMongooseRepository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MedicalRecord } from 'Source/Data/Models/medicalRecSchema';

describe('MedicalRecordMongooseRepository', () => {
    let repository: MedicalRecordMongooseRepository;
    let testMedicalRecordId: mongoose.Types.ObjectId;
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      //@ts-ignore
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      repository = new MedicalRecordMongooseRepository();
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });
    it('should create a new medicalRecord', async () => {
      const medicalRecordData: MedicalRecord = { pacient_id: new mongoose.Types.ObjectId(),
        last_update: new Date(),
        notes: 'string',
        attachments: 'string'
    }
  
      const result = await repository.createMedicalRecord(medicalRecordData);
      expect(result).toBeDefined();

      //@ts-ignore entorno de testing
      testMedicalRecordId = result?._id;
    });
  
    it('should get a medicalRecord by id', async () => {
      const medicalRecord = await repository.getMedicalRecordById(testMedicalRecordId);
      console.log(medicalRecord)
      expect(medicalRecord).toBeDefined();
      expect(medicalRecord?._id).toEqual(testMedicalRecordId);
    });
  
    it('should get all medicalRecords', async () => {
      const result = await repository.getAll({ page: 1, limit: 10 });
      expect(result).toBeDefined();
      if(result)
      expect(result.docs.length).toBeGreaterThan(0);
    });
  
    it('should update a medicalRecord', async () => {
      const updateData = { notes:'Diagnostico de diabetes' };
      // @ts-ignore entorno de testing
      const updatedMedicalRecord = await repository.updateMedicalRecord(testMedicalRecordId, updateData);
      expect(updatedMedicalRecord).toBeDefined();
      expect(updatedMedicalRecord?.notes).toEqual(updateData.notes);
    });
  
    it('should delete a medicalRecord', async () => {
      const result = await repository.deleteMedicalRecord(testMedicalRecordId);
      expect(result).toContain('successfully deleted');
    });
  
    it('should throw an error when medicalRecord not found', async () => {
      await expect(repository.getMedicalRecordById(new mongoose.Types.ObjectId())).rejects.toThrow('MedicalRecord could not found');
    });
  });