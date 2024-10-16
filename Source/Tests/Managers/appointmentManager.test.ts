import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Criteria, IdMongo } from 'Source/Utils/Types/typesMongoose'
import AppointmentManager from '../../Domain/Manager/appointmentManager';
import { ProfessionalTimeSlots } from '../../Data/Models/professionalTimeSlotsSchema';
import { DailyHourAvailability, HourlySlot } from '../../Data/Models/dailyHourASchema';
import { CreateAppointmentDto } from 'typesRequestDtos';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { Appointment, appointmentState } from 'Source/Data/Models/appointmentSchema';


const mockAppointmentRepository = {
    getAll: vi.fn().mockResolvedValue([]),
    getAppointmentById: vi.fn(),
    createAppointment: vi.fn().mockResolvedValue({
        pacient_id: '60d21b4667d0d8992e610c85',
        professional_id: '60d21b4667d0d8992e610c86',
        date_time: new Date(),
        schedule: {
          week_day: 1,
          time_slots: {
            start_time: dayjs(new Date("2024-08-30T09:00:00Z")),
            end_time: dayjs(new Date("2024-08-30T10:00:00Z"))
          }
        },
        session_type: 'Type1',
        order_photo:'url://httpjjs.com',
        state: 'Confirmado'
      }),
    updateAppointment: vi.fn(),
    deleteAppointment: vi.fn(),
  };
  
  const mockProfessionalTimeSlotRepository = {
    getProfessionalTimeSlotsByPro: vi.fn()
  };
  
  const mockDailyHourAvailabilityRepository = {
    getDailyHourAvailabilityByDate: vi.fn(),
    updateDailyHourAvailability: vi.fn(),
  };
  
  // Mock container
  vi.mock('../../container', () => ({
    default: {
      resolve: vi.fn((name: string) => {
        switch (name) {
          case 'AppointmentRepository':
            return mockAppointmentRepository;
          case 'ProfessionalTimeSlotsRepository':
            return mockProfessionalTimeSlotRepository;
          case 'DailyHourAvailabilityRepository':
            return mockDailyHourAvailabilityRepository;
          default:
            throw new Error(`Unknown repository: ${name}`);
        }
      })
    }
  }));
  
  vi.mock('../Validations/idValidation', () => ({
    parseAsync: vi.fn()
  }));
  
  vi.mock('../Validations/CreatesValidation/createAppointmentValidation', () => ({
    parseAsync: vi.fn()
  }));
  
  vi.mock('../../Utils/scheduleUtils', () => ({
    isAvailable: vi.fn().mockImplementation((schedule, slot) => {
        return true;
      })
  }));
  
  describe('AppointmentManager', () => {
    let manager: AppointmentManager;
  
    beforeEach(() => {
      manager = new AppointmentManager();
      vi.clearAllMocks();
    });
    it('should call appointmentRepository.getAll with valid data', async () => {
        const criteria = { page: 1, limit: 10 }
        await manager.getAll(criteria)
        expect(mockAppointmentRepository.getAll).toHaveBeenCalledWith(criteria)
    })
    it('should create an appointment by appointment', async () => {
      const dto: CreateAppointmentDto = {
        pacient_id: '60d21b4667d0d8992e610c85',
        professional_id: '60d21b4667d0d8992e610c86',
        date_time: new Date(),
        schedule: {
          week_day: 1,
          time_slots: {
            start_time: dayjs(new Date("2024-08-30T09:00:00Z")),
            end_time: dayjs(new Date("2024-08-30T10:00:00Z"))
          }
        },
        order_photo:'url://httpjjs.com',
        session_type: 'Type1',
        state: 'Solicitado'
      };
  
      const mockProTimeSlots: ProfessionalTimeSlots = {
        professional_id:'60d21b4667d0d8992e610c86' as unknown as IdMongo,
        schedule:[{week_day:1, time_slots:{start_time:dayjs("2024-08-30T08:00:00Z"), end_time:dayjs("2024-08-30T13:00:00Z")}}],
        state:'Disponible'
      };
  
      const mockHourlySlots: DailyHourAvailability = {
        date:dayjs("2024-08-30T09:00:00Z"),
        professional_id:'60d21b4667d0d8992e610c86' as unknown as IdMongo,
        hourly_slots:[{hour:8, max_sessions:6, current_sessions:2}]
      };
  
      (mockProfessionalTimeSlotRepository.getProfessionalTimeSlotsByPro ).mockResolvedValue(mockProTimeSlots);
      (mockDailyHourAvailabilityRepository.getDailyHourAvailabilityByDate ).mockResolvedValue(mockHourlySlots);
      vi.spyOn(manager, 'isHourlySlotAvailable' as never).mockResolvedValue(true);
  
      const result = await manager.createAppointmentByPatient(dto);
      expect(result).toBeDefined();
    });
    it('should return true and update availability if slot is available and not full', async () => {
        const date = dayjs("2024-08-30T09:00:00Z");
        const startTime = dayjs("2024-08-30T09:00:00Z");
        const professional_id = '60d21b4667d0d8992e610c86' as unknown as IdMongo;

        const mockHourlySlots: DailyHourAvailability = {
            _id: new mongoose.Types.ObjectId(),
            date,
            professional_id,
            hourly_slots: [{ hour: 9, max_sessions: 6, current_sessions: 2 }]
        };

        mockDailyHourAvailabilityRepository.getDailyHourAvailabilityByDate.mockResolvedValue(mockHourlySlots);

        const result = await manager.isHourlySlotAvailable(date, startTime, professional_id);

        expect(result).toBe(true);
        expect(mockDailyHourAvailabilityRepository.updateDailyHourAvailability).toHaveBeenCalledWith(
            mockHourlySlots._id,
            expect.objectContaining({
                hourly_slots: [{ hour: 9, max_sessions: 6, current_sessions: 3 }]
            })
        );
    });
    it('should return true and update availability if slot is not present and needs to be created', async () => {
        const date = dayjs("2024-08-30T09:00:00Z");
        const startTime = dayjs("2024-08-30T10:00:00Z");
        const professional_id = '60d21b4667d0d8992e610c86' as unknown as IdMongo;

        const mockHourlySlots: DailyHourAvailability = {
            _id: new mongoose.Types.ObjectId(),
            date,
            professional_id,
            hourly_slots: [{ hour: 9, max_sessions: 6, current_sessions: 2 }]
        };

        mockDailyHourAvailabilityRepository.getDailyHourAvailabilityByDate.mockResolvedValue(mockHourlySlots);

        const result = await manager.isHourlySlotAvailable(date, startTime, professional_id);

        expect(result).toBe(true);
        expect(mockDailyHourAvailabilityRepository.updateDailyHourAvailability).toHaveBeenCalledWith(
            mockHourlySlots._id,
            expect.objectContaining({
                hourly_slots: [
                    { hour: 9, max_sessions: 6, current_sessions: 2 },
                    { hour: 10, max_sessions: 6, current_sessions: 1 }
                ]
            })
        );
    });
    it('should return false if slot is not available and full', async () => {
        const date = dayjs("2024-08-30T09:00:00Z");
        const startTime = dayjs("2024-08-30T09:00:00Z");
        const professional_id = '60d21b4667d0d8992e610c86' as unknown as IdMongo;

        const mockHourlySlots: DailyHourAvailability = {
            _id: new mongoose.Types.ObjectId(),
            date,
            professional_id,
            hourly_slots: [{ hour: 9, max_sessions: 2, current_sessions: 2 }]
        };

        mockDailyHourAvailabilityRepository.getDailyHourAvailabilityByDate.mockResolvedValue(mockHourlySlots);

        const result = await manager.isHourlySlotAvailable(date, startTime, professional_id);

        expect(result).toBe(false);
        expect(mockDailyHourAvailabilityRepository.updateDailyHourAvailability).not.toHaveBeenCalled();
    });
    describe('getAppointmentById', () => {
        it('should call appointmentRepository.getAppointmentById with valid data', async () => {
            let id :IdMongo = new mongoose.Types.ObjectId()
            await manager.getAppointmentById(id as unknown as string)
            expect(mockAppointmentRepository.getAppointmentById).toHaveBeenCalledWith(id)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(manager.getAppointmentById(invalidId as IdMongo)).rejects.toThrow()
          })
    })
    describe('updateAppointment', () => {
        it('should call appointmentRepository.updateAppointment with valid data', async () =>{
            let id : IdMongo = new mongoose.Types.ObjectId()
            const dto= {
                pacient_id: '60d21b4667d0d8992e610c85' as unknown as IdMongo,
                professional_id: '60d21b4667d0d8992e610c86'as unknown as IdMongo,
                date_time: dayjs(new Date()),
                schedule: {
                  week_day: 1,
                  time_slots: {
                    start_time: dayjs(new Date("2024-08-30T09:00:00Z")),
                    end_time: dayjs(new Date("2024-08-30T10:00:00Z"))
                  }
                },
                order_photo:'url://httpjjs.com',
                session_type: 'Type1',
                state: 'Solicitado' as appointmentState
              };
            await manager.updateAppointment(dto, id)
            expect(mockAppointmentRepository.updateAppointment).toHaveBeenCalledWith(dto,id)
        })
        it('should throw an error with invalid id', async () => {
            const invalidId = 'invalid-id'
            // @ts-ignore porfa
            await expect(manager.updateAppointment(invalidId as IdMongo)).rejects.toThrow()
          })
    })
    describe('deleteAppointment', () => {
      it('should call appointmentRepository.deleteAppointment with valid data', async () =>{
          let id : IdMongo = new mongoose.Types.ObjectId()
          let appointment = {
            pacient_id: '60d21b4667d0d8992e610c85' as unknown as IdMongo,
            professional_id: '60d21b4667d0d8992e610c86'as unknown as IdMongo,
            date_time: dayjs(new Date()),
            schedule: {
              week_day: 1,
              time_slots: {
                start_time: dayjs(new Date("2024-08-30T09:00:00Z")),
                end_time: dayjs(new Date("2024-08-30T10:00:00Z"))
              },
            },
            _id:id}
          await manager.deleteAppointment(id)
          expect(mockAppointmentRepository.deleteAppointment).toHaveBeenCalledWith(appointment._id)
      })
      it('should throw an error with invalid id', async () => {
          const invalidId = 'invalid-id'
          // @ts-ignore porfa
          await expect(manager.deleteAppointment(invalidId as IdMongo)).rejects.toThrow()
        })
  })
  });