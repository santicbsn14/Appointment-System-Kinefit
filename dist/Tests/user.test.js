import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserManager from 'Source/Domain/Manager/userManager';
import mongoose from 'mongoose';
// Mock del UserRepository
const mockUserRepository = {
    getAll: vi.fn().mockResolvedValue([]), // Mock de respuesta para getAll
    getUserById: vi.fn(),
    getUserByEmail: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn()
};
// Mock del container
vi.mock('../container', () => ({
    default: {
        resolve: vi.fn(() => mockUserRepository)
    }
}));
describe('UserManager', () => {
    let userManager;
    beforeEach(() => {
        userManager = new UserManager();
        vi.clearAllMocks();
    });
    describe('getAll', () => {
        it('should call userRepository.getAll with correct criteria', async () => {
            const criteria = { page: 1, limit: 10 };
            await userManager.getAll(criteria);
            expect(mockUserRepository.getAll).toHaveBeenCalledWith(criteria);
        });
    });
    describe('getUserById', () => {
        it('should call userRepository.getUserById with valid id', async () => {
            const id = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
            await userManager.getUserById(id);
            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(id);
        });
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id';
            // @ts-ignore porfa
            await expect(userManager.getUserById(invalidId)).rejects.toThrow();
        });
    });
    describe('getUserByEmail', () => {
        it('should call userRepository.getUserByEmail with valid email', async () => {
            const email = 'test@example.com';
            await userManager.getUserByEmail(email);
            expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(email);
        });
        it('should throw an error with invalid email', async () => {
            const invalidEmail = 'invalid-email';
            await expect(userManager.getUserByEmail(invalidEmail)).rejects.toThrow();
        });
    });
    describe('createUser', () => {
        it('should call userRepository.createUser with valid user data', async () => {
            const userData = {
                firstname: 'Johnexx',
                lastname: 'Doerexx',
                username: 'johndoe',
                email: 'johndoe@example.com',
                age: 30,
                dni: 12345678,
                homeAdress: '123 Main St',
                phone: 1234567890,
                role: new mongoose.Types.ObjectId('66c65b641bb4017c5a0f3d14'),
                status: true,
                password: 'password123',
                _id: new mongoose.Types.ObjectId('66c65b651bb4017c5a0f3d15'),
            };
            await userManager.createUser(userData);
            expect(mockUserRepository.createUser).toHaveBeenCalledWith(userData);
        });
        it('should throw an error with invalid user data', async () => {
            const invalidUserData = { name: 'John' };
            // @ts-ignore porfa
            await expect(userManager.createUser(invalidUserData)).rejects.toThrow();
        });
    });
    describe('updateUser', () => {
        it('should call userRepository.updateUser with valid user data', async () => {
            const userData = {
                firstname: 'Johnexx',
                lastname: 'Doerexx',
                username: 'johndoe',
                email: 'johndoe@example.com',
                age: 30,
                dni: 12345678,
                homeAdress: '123 Main St',
                phone: 1234567890,
                role: new mongoose.Types.ObjectId('66c65b641bb4017c5a0f3d14'),
                status: true,
                password: 'password123',
                _id: new mongoose.Types.ObjectId('66c65b651bb4017c5a0f3d15'),
            };
            await userManager.updateUser(userData, userData._id);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userData, userData._id);
        });
        it('should throw an error with invalid user data', async () => {
            const invalidUserData = { name: 'John' };
            // @ts-ignore porfa
            await expect(userManager.createUser(invalidUserData)).rejects.toThrow();
        });
    });
    describe('deleteUser', () => {
        it('should call userRepository.deleteUser with valid user id', async () => {
            const userId = new mongoose.Types.ObjectId('66c65b651bb4017c5a0f3d15');
            await userManager.deleteUser(userId);
            expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
        });
        it('should throw an error with invalid user data', async () => {
            const invalidUserData = { name: 'John' };
            // @ts-ignore porfa
            await expect(userManager.createUser(invalidUserData)).rejects.toThrow();
        });
    });
});
