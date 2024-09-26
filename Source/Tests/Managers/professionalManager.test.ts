import ProfessionalManager from 'Source/Domain/Manager/professionalManager'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Criteria, IdMongo } from 'Source/Utils/Types/typesMongoose'
import mongoose from 'mongoose'
import { Professional } from 'Source/Data/Models/professionalSchema'

const mockProfessionalRepository = {
    getAll: vi.fn().mockResolvedValue([]), // Mock de respuesta para getAll
    getProfessionalById: vi.fn(),
    createProfessional: vi.fn(),
    updateProfessional: vi.fn(),
    deleteProfessional: vi.fn()
  }

  vi.mock('../../container', () => ({
    default: {
      resolve: vi.fn(() => mockProfessionalRepository)
    }
  }))

describe('ProfessionalManager', () =>{
    let professionalManager: ProfessionalManager
    beforeEach(()=>{
        professionalManager = new ProfessionalManager()
        vi.clearAllMocks()
    })

    describe('getAll', () =>{
        it('should call professionalRepository.getAll with valid data', async () => {
            const criteria = { page: 1, limit: 10 }
            await professionalManager.getAll(criteria)
            expect(mockProfessionalRepository.getAll).toHaveBeenCalledWith(criteria)
        })
    })
    
    describe('getProfessionalById', () => {
        it('should call professionalRepository.getProfessionalById with valid data', async () => {
            let pid :IdMongo = new mongoose.Types.ObjectId()
            await professionalManager.getProfessionalById(pid)
            expect(mockProfessionalRepository.getProfessionalById).toHaveBeenCalledWith(pid)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(professionalManager.getProfessionalById(invalidId as IdMongo)).rejects.toThrow()
          })
    })
    
    describe('createProfessional', () => {
        it('should call professionalRepository.createProfessional with valid data', async () =>{
            let uid : IdMongo = new mongoose.Types.ObjectId('66c65b641bb4017c5a0f3d14')
             let professional = {user_id: uid, specialties:['Terapia de manos', 'Terapia de choque']}
             // @ts-ignore entorno de testing
            await professionalManager.createProfessional(professional)
            expect(mockProfessionalRepository.createProfessional).toHaveBeenCalledWith({
                ...uid, 
                user_id: expect.any(mongoose.Types.ObjectId),
                specialties:['Terapia de manos', 'Terapia de choque']
            })
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(professionalManager.createProfessional({ user_id: invalidId } as CreateProfessionalDto)).rejects.toThrow()
          })
    })
    describe('updateProfessional', () => {
        it('should call professionalRepository.updateProfessional with valid data', async () =>{
            let uid : IdMongo = new mongoose.Types.ObjectId()
            let pid : Professional = {user_id: new mongoose.Types.ObjectId(), _id: uid, specialties:['Terapia de manos']}
            await professionalManager.updateProfessional(pid, uid)
            expect(mockProfessionalRepository.updateProfessional).toHaveBeenCalledWith(pid,uid)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(professionalManager.updateProfessional(invalidId as IdMongo)).rejects.toThrow()
          })
    })
    describe('updateProfessional', () => {
        it('should call professionalRepository.deleteProfessional with valid data', async () =>{
            let uid : IdMongo = new mongoose.Types.ObjectId()
            let pid : Professional = {user_id: new mongoose.Types.ObjectId(), _id: uid, specialties:['Terapia de manos']}
            await professionalManager.deleteProfessional(pid.user_id)
            expect(mockProfessionalRepository.deleteProfessional).toHaveBeenCalledWith(pid.user_id)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(professionalManager.deleteProfessional(invalidId as IdMongo)).rejects.toThrow()
          })
    })
})