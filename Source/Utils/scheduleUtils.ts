import { DaySchedule } from 'Source/Data/Models/professionalTimeSlotsSchema';



export function isAvailable(
    professionalSchedule: DaySchedule[],
    patientRequest: DaySchedule | DaySchedule[]
  ): boolean {
    // Si patientRequest no es un array, lo convertimos en un array
    const requests = Array.isArray(patientRequest) ? patientRequest : [patientRequest];
  
    return requests.every((requestedDay: DaySchedule) => {
      const matchingDay = professionalSchedule.find(
        (profDay: DaySchedule) => profDay.week_day === requestedDay.week_day
      );
  
      if (!matchingDay) return false;
  
      const reqSlot = requestedDay.time_slots;
      const profSlot = matchingDay.time_slots;
  
      return reqSlot.start_time >= profSlot.start_time && reqSlot.end_time <= profSlot.end_time;
    });
  }