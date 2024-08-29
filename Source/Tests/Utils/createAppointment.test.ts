import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppointmentManager from 'Source/Domain/Manager/appointmentManager';
import mongoose from 'mongoose';

// Importaciones de tipos (asumiendo que están en archivos separados)
import { CreateAppointmentDto, Appointment, appointmentState, DaySchedule, TimeSlots, ProfessionalTimeSlots, DailyHourAvailability } from './types';

// Mocks
vi.mock('../../container', () => ({
  default: {
    resolve: vi.fn(() => ({
      getAll: vi.fn(),
      getAppointmentById: vi.fn(),
      createAppointment: vi.fn(),
      updateAppointment: vi.fn(),
      deleteAppointment: vi.fn(),
      getProfessionalTimeSlotsByPro: vi.fn(),
      getDailyHourAvailabilityByDate: vi.fn(),
    })),
  },
}));

describe('AppointmentManager', () => {
  let appointmentManager: AppointmentManager;

  beforeEach(() => {
    appointmentManager = new AppointmentManager();
  });

  describe('createAppointmentByPatient', () => {
    it('should create an appointment successfully', async () => {
      // Arrange
      const mockCreateAppointmentDto: CreateAppointmentDto = {
        pacient_id: '507f1f77bcf86cd799439011',
        professional_id: '507f1f77bcf86cd799439012',
        date_time: new Date('2024-08-30T10:00:00Z'),
        schedule: {
          week_day: 'Lunes',
          time_slots: {
            start_time: '10:00',
            end_time: '11:00',
          },
        },
        state: 'Solicitado',
        session_type: 'Consulta',
      };

      const mockProfessionalTimeSlots: ProfessionalTimeSlots = {
        professional_id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        schedule: [
          {
            week_day: 'Lunes',
            time_slots: {
              start_time: '09:00',
              end_time: '18:00',
            },
          },
        ],
        state: 'Disponible',
      };

      const mockDailyHourAvailability: DailyHourAvailability = {
        professional_id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        date: new Date('2024-08-30'),
        hourly_slots: [
          { hour: 10, max_sessions: 3, current_sessions: 0 },
        ],
      };

      // Mock de los métodos del repositorio
      appointmentManager.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro = vi.fn().mockResolvedValue(mockProfessionalTimeSlots);
      appointmentManager.dailyHourAvailabilityRepository.getDailyHourAvailabilityByDate = vi.fn().mockResolvedValue(mockDailyHourAvailability);
      appointmentManager.appointmentRepository.createAppointment = vi.fn().mockImplementation((appointment: Appointment) => Promise.resolve({ ...appointment, _id: new mongoose.Types.ObjectId() }));

      // Act
      const result = await appointmentManager.createAppointmentByPatient(mockCreateAppointmentDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.state).toBe('Confirmado');
      expect(appointmentManager.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro).toHaveBeenCalledWith(expect.any(mongoose.Types.ObjectId));
      expect(appointmentManager.dailyHourAvailabilityRepository.getDailyHourAvailabilityByDate).toHaveBeenCalledWith(mockCreateAppointmentDto.date_time);
      expect(appointmentManager.appointmentRepository.createAppointment).toHaveBeenCalledWith(expect.objectContaining({
        pacient_id: expect.any(mongoose.Types.ObjectId),
        professional_id: expect.any(mongoose.Types.ObjectId),
        date_time: mockCreateAppointmentDto.date_time,
        schedule: mockCreateAppointmentDto.schedule,
        state: 'Confirmado',
        session_type: mockCreateAppointmentDto.session_type,
      }));
    });

    it('should throw an error if professional is not found', async () => {
      // Arrange
      const mockCreateAppointmentDto: CreateAppointmentDto = {
        pacient_id: '507f1f77bcf86cd799439011',
        professional_id: '507f1f77bcf86cd799439012',
        date_time: new Date('2024-08-30T10:00:00Z'),
        schedule: {
          week_day: 'Lunes',
          time_slots: {
            start_time: '10:00',
            end_time: '11:00',
          },
        },
        state: 'Solicitado',
        session_type: 'Consulta',
      };

      appointmentManager.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro = vi.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(appointmentManager.createAppointmentByPatient(mockCreateAppointmentDto)).rejects.toThrow('Professional not found');
    });

    it('should throw an error if the professional does not work in that time slot', async () => {
      // Arrange
      const mockCreateAppointmentDto: CreateAppointmentDto = {
        pacient_id: '507f1f77bcf86cd799439011',
        professional_id: '507f1f77bcf86cd799439012',
        date_time: new Date('2024-08-30T20:00:00Z'),
        schedule: {
          week_day: 'Lunes',
          time_slots: {
            start_time: '20:00',
            end_time: '21:00',
          },
        },
        state: 'Solicitado',
        session_type: 'Consulta',
      };

      const mockProfessionalTimeSlots: ProfessionalTimeSlots = {
        professional_id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        schedule: [
          {
            week_day: 'Lunes',
            time_slots: {
              start_time: '09:00',
              end_time: '18:00',
            },
          },
        ],
        state: 'Disponible',
      };

      appointmentManager.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro = vi.fn().mockResolvedValue(mockProfessionalTimeSlots);

      // Act & Assert
      await expect(appointmentManager.createAppointmentByPatient(mockCreateAppointmentDto)).rejects.toThrow('The professional does not work in that time slot');
    });

    it('should throw an error if no slots are available', async () => {
      // Arrange
      const mockCreateAppointmentDto: CreateAppointmentDto = {
        pacient_id: '507f1f77bcf86cd799439011',
        professional_id: '507f1f77bcf86cd799439012',
        date_time: new Date('2024-08-30T10:00:00Z'),
        schedule: {
          week_day: 'Lunes',
          time_slots: {
            start_time: '10:00',
            end_time: '11:00',
          },
        },
        state: 'Solicitado',
        session_type: 'Consulta',
      };

      const mockProfessionalTimeSlots: ProfessionalTimeSlots = {
        professional_id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        schedule: [
          {
            week_day: 'Lunes',
            time_slots: {
              start_time: '09:00',
              end_time: '18:00',
            },
          },
        ],
        state: 'Disponible',
      };

      const mockDailyHourAvailability: DailyHourAvailability = {
        professional_id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        date: new Date('2024-08-30'),
        hourly_slots: [
          { hour: 10, max_sessions: 3, current_sessions: 3 },
        ],
      };

      appointmentManager.professionalTimeSlotRepository.getProfessionalTimeSlotsByPro = vi.fn().mockResolvedValue(mockProfessionalTimeSlots);
      appointmentManager.dailyHourAvailabilityRepository.getDailyHourAvailabilityByDate = vi.fn().mockResolvedValue(mockDailyHourAvailability);

      // Act & Assert
      await expect(appointmentManager.createAppointmentByPatient(mockCreateAppointmentDto)).rejects.toThrow('No available slots for the selected time');
    });
  });
})
