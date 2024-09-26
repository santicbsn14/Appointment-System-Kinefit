import { describe, it, expect, vi } from 'vitest';
import { NextFunction, Response } from 'express';
import { auth } from 'firebase-admin';
import authMiddleware from '../../Presentation/Middlewares/auth';
import UserManager from '../../Domain/Manager/userManager';
import { IUser } from '../../Data/Models/userSchema';
import { userAuth } from 'typesRequestDtos'; // Asegúrate de importar `CustomRequest` correctamente

// Mockear dependencias
vi.mock('firebase-admin', () => ({
    auth: () => ({
        verifyIdToken: vi.fn().mockResolvedValue({ email: 'user@example.com', uid: 'user-uid' })
    })
}));
vi.mock('Source/Domain/Manager/userManager', () => ({
    default: vi.fn().mockImplementation(() => ({
        getUserByEmail: vi.fn().mockResolvedValue({ role: 'admin' })
    }))
}));

describe('authMiddleware', () => {
    it('should add user info to request and call next if token is valid', async () => {
        const mockToken = 'valid-token';
        const mockEmail = 'user@example.com';
        //@ts-expect-error entorno de testing
        const mockUser: IUser = { role: 'admin' };

        // Crear mocks para req, res y next
        const req = {
            cookies: { authToken: mockToken },
            headers: {},
        } as unknown as CustomRequest<userAuth>; // Asegúrate de proporcionar el tipo correcto

        const res = {} as Response;
        //@ts-expect-error entorno de testing
        const next = vi.fn() as NextFunction;

        await authMiddleware(req, res, next);
        //@ts-expect-error entorno de testing
        expect(req.user).toEqual({
            uid: 'user-uid',
            email: mockEmail,
            role: mockUser.role
        });
        expect(next).toHaveBeenCalled();
    });


    it('should return 401 if no token is provided', async () => {
        const req = {
            cookies: {},
            headers: {},
        } as unknown as CustomRequest;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;
        //@ts-expect-error entorno de testing
        const next = vi.fn() as NextFunction;

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No authentication token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    // it('should return 403 if token is invalid or expired', async () => {
    //     const req = {
    //         cookies: { authToken: 'invalid-token' },
    //         headers: {},
    //     } as unknown as CustomRequest;

    //     const res = {
    //         status: vi.fn().mockReturnThis(),
    //         json: vi.fn()
    //     } as unknown as Response;

    //     const next = vi.fn() as NextFunction;
    //      const authMock = vi.mock('firebase-admin', () => ({
    //         auth: () => ({
    //             verifyIdToken: vi.fn().mockRejectedValue(new Error('Invalid token'))
    //         })
    //     }));


    //     await authMiddleware(req, res, next);

    //     expect(res.status).toHaveBeenCalledWith(403);
    //     expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    //     expect(next).toHaveBeenCalledWith(new Error('Invalid token'));
    // });
});
