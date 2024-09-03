import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ProfessionalMongooseRepository from 'Source/Data/Repositories/professionalMongooseRepository';
import { Professional } from 'Source/Data/Models/professionalSchema';

describe('ProfessionalMongooseRepository', () => {
    let repository: ProfessionalMongooseRepository;
    let testProfessionalId: mongoose.Types.ObjectId;
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      //@ts-ignore
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      repository = new ProfessionalMongooseRepository();
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });
  
  
    it('should create a new professional', async () => {
      const professionalData: Professional = {
        user_id: new mongoose.Types.ObjectId('66c65b641bb4017c5a0f3d14')
      };
  
      const result = await repository.createProfessional(professionalData);
      expect(result).toBeDefined();

      //@ts-ignore entorno de testing
      testProfessionalId = result?._id;
    });
  
    it('should get a professional by id', async () => {
      const professional = await repository.getProfessionalById(testProfessionalId);
      expect(professional).toBeDefined();
      expect(professional?._id).toEqual(testProfessionalId);
    });
  
    it('should get all professionals', async () => {
      const result = await repository.getAll({ page: 1, limit: 10 });
      expect(result).toBeDefined();
      if(result)
      expect(result.docs.length).toBeGreaterThan(0);
    });
  
    it('should update a professional', async () => {
      const updateData = { user_id: new mongoose.Types.ObjectId('66c65b641bb4017c5a0f3d13') };
      // @ts-ignore entorno de testing
      const updatedProfessional = await repository.updateProfessional(testProfessionalId, updateData);
      expect(updatedProfessional).toBeDefined();
      expect(updatedProfessional?.user_id).toEqual(updateData.user_id);
    });
  
    it('should delete a professional', async () => {
      const result = await repository.deleteProfessional(testProfessionalId);
      expect(result).toContain('successfully deleted');
    });
  
    it('should throw an error when professional not found', async () => {
      await expect(repository.getProfessionalById(new mongoose.Types.ObjectId())).rejects.toThrow('Professional could not found');
    });
  });