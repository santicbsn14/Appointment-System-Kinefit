import PatientManager from "Source/Domain/Manager/patientManager";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
const mockPatientRepository = {
    getAll: vi.fn().mockResolvedValue([]), // Mock de respuesta para getAll
    getPatientById: vi.fn(),
    createPatient: vi.fn(),
    updatePatient: vi.fn(),
    deletePatient: vi.fn()
};
vi.mock('../../container', () => ({
    default: {
        resolve: vi.fn(() => mockPatientRepository)
    }
}));
describe('PatientManager', () => {
    let patientManager;
    beforeEach(() => {
        patientManager = new PatientManager();
        vi.clearAllMocks();
    });
    describe('getAll', () => {
        it('should call patientRepository.getAll with valid data', async () => {
            const criteria = { page: 1, limit: 10 };
            await patientManager.getAll(criteria);
            expect(mockPatientRepository.getAll).toHaveBeenCalledWith(criteria);
        });
    });
    describe('getPatientById', () => {
        it('should call patientRepository.getPatientById with valid data', async () => {
            let pid = new mongoose.Types.ObjectId();
            await patientManager.getPatientById(pid);
            expect(mockPatientRepository.getPatientById).toHaveBeenCalledWith(pid);
        });
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id';
            // @ts-ignore porfa
            await expect(patientManager.getPatientById(invalidId)).rejects.toThrow();
        });
    });
    describe('createPatient', () => {
        it('should call patientRepository.createPatient with valid data', async () => {
            let patient = { _id: new mongoose.Types.ObjectId(),
                user_id: new mongoose.Types.ObjectId(),
                clinical_data: ['Tuvo diabetes']
            };
            // @ts-ignore entorno de testing
            await patientManager.createPatient(patient);
            expect(mockPatientRepository.createPatient).toHaveBeenCalledWith(patient);
        });
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id';
            // @ts-ignore porfa
            await expect(patientManager.createPatient(invalidId)).rejects.toThrow();
        });
    });
    describe('updatePatient', () => {
        it('should call patientRepository.updatePatient with valid data', async () => {
            let uid = new mongoose.Types.ObjectId();
            let patient = { _id: new mongoose.Types.ObjectId(),
                user_id: new mongoose.Types.ObjectId(),
                clinical_data: ['Tuvo diabetes']
            };
            await patientManager.updatePatient(patient, uid);
            expect(mockPatientRepository.updatePatient).toHaveBeenCalledWith(patient, uid);
        });
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id';
            // @ts-ignore porfa
            await expect(patientManager.updatePatient(invalidId)).rejects.toThrow();
        });
    });
    describe('updatePatient', () => {
        it('should call patientRepository.deletePatient with valid data', async () => {
            let uid = new mongoose.Types.ObjectId();
            let patient = { _id: new mongoose.Types.ObjectId(),
                user_id: new mongoose.Types.ObjectId(),
                clinical_data: ['Tuvo diabetes']
            };
            if (patient._id)
                await patientManager.deletePatient(patient._id);
            expect(mockPatientRepository.deletePatient).toHaveBeenCalledWith(patient._id);
        });
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id';
            // @ts-ignore porfa
            await expect(patientManager.deletePatient(invalidId)).rejects.toThrow();
        });
    });
});
