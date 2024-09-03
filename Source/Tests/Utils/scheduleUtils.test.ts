// import { type DaySchedule } from "Source/Data/Models/professionalTimeSlotsSchema";
// import { isAvailable } from "Source/Utils/scheduleUtils";
// import { describe, it } from "vitest";


// describe('isAvailable', () => {
//     it('should return true if patient request is within professional schedule', () => {
//         const professionalSchedule: DaySchedule[] = [
//             { week_day: "Monday", time_slots: { start_time: "09:00", end_time: "17:00" } },
//             { week_day: "Tuesday", time_slots: { start_time: "09:00", end_time: "17:00" } },
//         ];
        
//         const patientRequest: DaySchedule[] = [
//             { week_day: "Monday", time_slots: { start_time: "10:00", end_time: "11:00" } },
//             { week_day: "Tuesday", time_slots: { start_time: "09:30", end_time: "10:30" } },
//         ];
        
//         const result = isAvailable(professionalSchedule, patientRequest);
//         expect(result).toBe(true);
//     });

//     it('should return false if patient request is outside professional schedule', () => {
//         const professionalSchedule: DaySchedule[] = [
//             { week_day: "Monday", time_slots: { start_time: "09:00", end_time: "17:00" } },
//             { week_day: "Tuesday", time_slots: { start_time: "09:00", end_time: "17:00" } },
//         ];
        
//         const patientRequest: DaySchedule[] = [
//             { week_day: "Monday", time_slots: { start_time: "18:00", end_time: "19:00" } },  // Fuera del horario disponible
//         ];
        
//         const result = isAvailable(professionalSchedule, patientRequest);
//         expect(result).toBe(false);
//     });

//     it('should return false if no matching day is found in professional schedule', () => {
//         const professionalSchedule: DaySchedule[] = [
//             { week_day: "Monday", time_slots: { start_time: "09:00", end_time: "17:00" } },
//             // No Tuesday
//         ];
        
//         const patientRequest: DaySchedule[] = [
//             { week_day: "Tuesday", time_slots: { start_time: "09:30", end_time: "10:30" } },
//         ];
        
//         const result = isAvailable(professionalSchedule, patientRequest);
//         expect(result).toBe(false);
//     });

//     it('should return true if multiple time slots are within the professional schedule', () => {
//         const professionalSchedule: DaySchedule[] = [
//             { week_day: "Monday", time_slots: { start_time: "09:00", end_time: "17:00" } },
//         ];
        
//         const patientRequest: DaySchedule[] = [
//             { week_day: "Monday", time_slots: { start_time: "10:00", end_time: "11:00" } },
//             { week_day: "Monday", time_slots: { start_time: "14:00", end_time: "15:00" } },
//         ];
        
//         const result = isAvailable(professionalSchedule, patientRequest);
//         expect(result).toBe(true);
//     });
// });