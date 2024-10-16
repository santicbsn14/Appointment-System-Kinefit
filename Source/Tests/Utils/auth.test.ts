import { describe, it, expect, vi, beforeEach } from 'vitest';
import authMiddleware from 'Source/Presentation/Middlewares/auth';
import { Response, NextFunction } from 'express';
import { IUser } from '../../Data/Models/userSchema';
import UserManager from '../../Domain/Manager/userManager';
import * as admin from 'firebase-admin';

vi.mock('firebase-admin', () => {
  const mockVerifyIdToken = vi.fn();
  return {
    apps: [],
    initializeApp: vi.fn(),
    auth: vi.fn(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
    mockVerifyIdToken, // Exportamos la función mock para poder acceder a ella en las pruebas
  };
});

vi.mock('../../Domain/Manager/userManager');

describe('authMiddleware', () => {
  let mockReq: any;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {},
      headers: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    //@ts-ignore entorno de testeo
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    await authMiddleware(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'No authentication token provided' });
  });

  it('should call next if token is invalid and Firebase is not initialized', async () => {
    mockReq.cookies.authToken = 'invalid-token';
    await authMiddleware(mockReq, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should verify token and assign user to request if valid and Firebase is initialized', async () => {
    const mockDecodedToken = { uid: '123', email: 'test@example.com' };
    const mockUser: IUser = { role: 'admin' } as IUser;

    // Mock Firebase initialization
    vi.mocked(admin.apps).push({} as any);
    //@ts-ignore entorno de testing
    vi.mocked(admin.mockVerifyIdToken).mockResolvedValueOnce(mockDecodedToken);
    
    const userManagerMock = vi.mocked(UserManager);
     //@ts-ignore entorno de testing
    userManagerMock.prototype.getUserByEmail.mockResolvedValueOnce(mockUser);

    mockReq.cookies.authToken = 'valid-token';

    await authMiddleware(mockReq, mockRes as Response, mockNext);
     //@ts-ignore entorno de testing
    expect(admin.mockVerifyIdToken).toHaveBeenCalledWith('valid-token');
    expect(userManagerMock.prototype.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockReq.user).toEqual({
      uid: '123',
      email: 'test@example.com',
      role: 'admin',
    });
    expect(mockNext).toHaveBeenCalled();
  });
});