import NotificationManager from "Source/Domain/Manager/notificationManager";
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Criteria, IdMongo } from 'Source/Utils/Types/typesMongoose'
import mongoose from 'mongoose'
import { type Notification } from "Source/Data/Models/notificationSchema";


const mockNotificationRepository = {
    getAll: vi.fn().mockResolvedValue([]), // Mock de respuesta para getAll
    getNotificationById: vi.fn(),
    createNotification: vi.fn(),
    updateNotification: vi.fn(),
    deleteNotification: vi.fn()
}

vi.mock('../../container', () => ({
    default: {
      resolve: vi.fn(() => mockNotificationRepository)
    }
  }))

describe('NotificationManager', () =>{
    let notificationManager: NotificationManager
    beforeEach(()=>{
        notificationManager = new NotificationManager()
        vi.clearAllMocks()
    })

    describe('getAll', () =>{
        it('should call notificationRepository.getAll with valid data', async () => {
            const criteria = { page: 1, limit: 10 }
            await notificationManager.getAll(criteria)
            expect(mockNotificationRepository.getAll).toHaveBeenCalledWith(criteria)
        })
    })
    
    describe('getNotificationById', () => {
        it('should call notificationRepository.getNotificationById with valid data', async () => {
            let pid :IdMongo = new mongoose.Types.ObjectId()
            await notificationManager.getNotificationById(pid)
            expect(mockNotificationRepository.getNotificationById).toHaveBeenCalledWith(pid)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(notificationManager.getNotificationById(invalidId as IdMongo)).rejects.toThrow()
          })
    })
    
    describe('createNotification', () => {
        it('should call notificationRepository.createNotification with valid data', async () =>{
            let notification : Notification = {appointment_id: new mongoose.Types.ObjectId(),
                type: 'confirmacion',
                state:'Pendiente',
                date_send: new Date(),
                note:' Gracias por confirmar el turno'
            }
            // @ts-ignore entorno testing
            await notificationManager.createNotification(notification)
            expect(mockNotificationRepository.createNotification).toHaveBeenCalledWith(notification)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(notificationManager.createNotification(invalidId as IdMongo)).rejects.toThrow()
          })
    })
    describe('updateNotification', () => {
        it('should call notificationRepository.updateNotification with valid data', async () =>{
            let uid : IdMongo = new mongoose.Types.ObjectId()
            let notification : Notification = {appointment_id: new mongoose.Types.ObjectId(),
                type: 'confirmacion',
                state:'Pendiente',
                date_send: new Date(),
                note:' Gracias por confirmar el turno'
            }
            await notificationManager.updateNotification(notification, uid)
            expect(mockNotificationRepository.updateNotification).toHaveBeenCalledWith(notification,uid)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(notificationManager.updateNotification(invalidId as IdMongo)).rejects.toThrow()
          })
    })
    describe('updateNotification', () => {
        it('should call notificationRepository.deleteNotification with valid data', async () =>{
            let id : IdMongo = new mongoose.Types.ObjectId()
            let notification : Notification = {appointment_id: new mongoose.Types.ObjectId(),
                type: 'confirmacion',
                state:'Pendiente',
                date_send: new Date(),
                note:' Gracias por confirmar el turno',
                _id:id
            }
            await notificationManager.deleteNotification(id)
            expect(mockNotificationRepository.deleteNotification).toHaveBeenCalledWith(notification._id)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(notificationManager.deleteNotification(invalidId as IdMongo)).rejects.toThrow()
          })
    })
})