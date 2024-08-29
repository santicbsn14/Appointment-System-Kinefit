import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import ScheduledSessionsMongooseRepository from 'Source/Data/Repositories/scheduledSessionsMongooseRepository';
describe('ScheduledSessionsMongooseRepository', () => {
    let repository;
    let testScheduledSessionsId;
    beforeAll(async () => {
        // Conectar a una base de datos de prueba
        await mongoose.connect('mongodb+srv://santicbsn9:9ayNHDJY3GTjdWi2@cluster-sistema-kinefit.gcon33o.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster-Sistema-Kinefit');
        repository = new ScheduledSessionsMongooseRepository();
    });
    afterAll(async () => {
        // Limpiar la base de datos y cerrar la conexión
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
    it('should create a new scheduledSessions', async () => {
        const scheduledSessionsData = { pacient_id: new mongoose.Types.ObjectId(),
            professional_id: new mongoose.Types.ObjectId(),
            session_dates: [{ week_day: 'Monday', time_slots: { start_time: '8:00hs', end_time: '15:00hs' } }],
            start_date: new Date(),
            number_sessions: 8,
            state: 'string',
            frequency: 'string'
        };
        const result = await repository.createScheduledSessions(scheduledSessionsData);
        expect(result).toBeDefined();
        //@ts-ignore entorno de testing
        testScheduledSessionsId = result?._id;
    });
    it('should get a scheduledSessions by id', async () => {
        const scheduledSessions = await repository.getScheduledSessionsById(testScheduledSessionsId);
        console.log(scheduledSessions);
        expect(scheduledSessions).toBeDefined();
        expect(scheduledSessions?._id).toEqual(testScheduledSessionsId);
    });
    it('should get all scheduledSessionss', async () => {
        const result = await repository.getAll({ page: 1, limit: 10 });
        expect(result).toBeDefined();
        if (result)
            expect(result.docs.length).toBeGreaterThan(0);
    });
    it('should update a scheduledSessions', async () => {
        const updateData = { state: 'pendiente' };
        // @ts-ignore entorno de testing
        const updatedScheduledSessions = await repository.updateScheduledSessions(testScheduledSessionsId, updateData);
        expect(updatedScheduledSessions).toBeDefined();
        expect(updatedScheduledSessions?.state).toEqual(updateData.state);
    });
    it('should delete a scheduledSessions', async () => {
        const result = await repository.deleteScheduledSessions(testScheduledSessionsId);
        expect(result).toContain('successfully deleted');
    });
    it('should throw an error when scheduledSessions not found', async () => {
        await expect(repository.getScheduledSessionsById(new mongoose.Types.ObjectId())).rejects.toThrow('ScheduledSessions could not found');
    });
});
