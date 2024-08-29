import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import UserMongooseRepository from 'Source/Data/Repositories/userMongooseRepository';
import { IUser } from 'Source/Data/Models/userSchema';

describe('UserMongooseRepository', () => {
    let repository: UserMongooseRepository;
    let testUserId: mongoose.Types.ObjectId;
  
    beforeAll(async () => {
      // Conectar a una base de datos de prueba
      await mongoose.connect('mongodb+srv://santicbsn9:9ayNHDJY3GTjdWi2@cluster-sistema-kinefit.gcon33o.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster-Sistema-Kinefit');
      repository = new UserMongooseRepository();
    });
  
    afterAll(async () => {
      // Limpiar la base de datos y cerrar la conexión
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    });
  
    it('should create a new user', async () => {
      const userData: IUser = {
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
      };
  
      const result = await repository.createUser(userData);
      expect(result).toBeDefined();
      expect(result?.email).toBe(userData.email);
      //@ts-ignore entorno de testing
      testUserId = result?.id;
    });
  
    it('should get a user by id', async () => {
      const user = await repository.getUserById(testUserId);
      expect(user).toBeDefined();
      expect(user?.id).toEqual(testUserId);
    });
  
    it('should get all users', async () => {
      const result = await repository.getAll({ page: 1, limit: 10 });
      expect(result).toBeDefined();
      expect(result.docs.length).toBeGreaterThan(0);
    });
  
    it('should update a user', async () => {
      const updateData = { firstname: 'Jane' };
      const updatedUser = await repository.updateUser(testUserId, updateData);
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.firstname).toBe('Jane');
    });
  
    it('should delete a user', async () => {
      const result = await repository.deleteUser(testUserId);
      expect(result).toContain('successfully deleted');
    });
  
    it('should throw an error when user not found', async () => {
      await expect(repository.getUserById(new mongoose.Types.ObjectId())).rejects.toThrow('User not Found');
    });
  });