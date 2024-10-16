import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import PatientMongooseRepository from 'Source/Data/Repositories/patientMongooseRepository';
import userSchema from 'Source/Data/Models/userSchema';
describe('PatientMongooseRepository', () => {
    let repository;
    let testPatientId;
    let mongoServer;
    let userId;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        //@ts-ignore
        await mongoose.connect(uri);
        repository = new PatientMongooseRepository();
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
        userId = user._id; // Guarda el ID del usuario creado
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    it('should create a new patient', async () => {
        const patientData = {
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
        if (result)
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
