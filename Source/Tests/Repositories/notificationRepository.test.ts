import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import NotificationMongooseRepository from 'Source/Data/Repositories/notificationMongooseRepository';
import { Notification } from 'Source/Data/Models/notificationSchema';

describe('NotificationMongooseRepository', () => {
    let repository: NotificationMongooseRepository;
    let testNotificationId: mongoose.Types.ObjectId;
  
    beforeAll(async () => {
      // Conectar a una base de datos de prueba
      await mongoose.connect('mongodb+srv://santicbsn9:9ayNHDJY3GTjdWi2@cluster-sistema-kinefit.gcon33o.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster-Sistema-Kinefit');
      repository = new NotificationMongooseRepository();
    });
  
    afterAll(async () => {
      // Limpiar la base de datos y cerrar la conexión
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    });
  
    it('should create a new notification', async () => {
      const notificationData: Notification = {appointment_id: new mongoose.Types.ObjectId(),
                type: 'confirmacion',
                state:'Pendiente',
                date_send: new Date(),
                note:' Gracias por confirmar el turno'
            }
  
      const result = await repository.createNotification(notificationData);
      expect(result).toBeDefined();

      //@ts-ignore entorno de testing
      testNotificationId = result?._id;
    });
  
    it('should get a notification by id', async () => {
      const notification = await repository.getNotificationById(testNotificationId);
      console.log(notification)
      expect(notification).toBeDefined();
      expect(notification?._id).toEqual(testNotificationId);
    });
  
    it('should get all notifications', async () => {
      const result = await repository.getAll({ page: 1, limit: 10 });
      expect(result).toBeDefined();
      if(result)
      expect(result.docs.length).toBeGreaterThan(0);
    });
  
    it('should update a notification', async () => {
      const updateData = { state:'Enviada' };
      // @ts-ignore entorno de testing
      const updatedNotification = await repository.updateNotification(testNotificationId, updateData);
      expect(updatedNotification).toBeDefined();
      expect(updatedNotification?.state).toEqual(updateData.state);
    });
  
    it('should delete a notification', async () => {
      const result = await repository.deleteNotification(testNotificationId);
      expect(result).toContain('successfully deleted');
    });
  
    it('should throw an error when notification not found', async () => {
      await expect(repository.getNotificationById(new mongoose.Types.ObjectId())).rejects.toThrow('Notification could not found');
    });
  });