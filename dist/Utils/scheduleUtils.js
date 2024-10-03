import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

export function isAvailable(professionalSchedule, patientRequest) {
    // Asumimos que la zona horaria del sistema es la que queremos usar
    const systemTimezone = dayjs.tz.guess();

    // Convertimos `patientRequest` en un array si no lo es
    const requests = Array.isArray(patientRequest) ? patientRequest : [patientRequest];

    return requests.every((requestedDay) => {
        const matchingDay = professionalSchedule.find((profDay) => profDay.week_day === requestedDay.week_day);
        if (!matchingDay)
            return false;
        
        const reqSlot = requestedDay.time_slots;
        const profSlot = matchingDay.time_slots;
        
        // Convertimos las fechas UTC del profesional a la zona horaria local
        const profStartLocal = dayjs(profSlot.start_time).tz(systemTimezone)
        const profEndLocal = dayjs(profSlot.end_time).tz(systemTimezone)
        const reqSlotStart = dayjs(reqSlot.start_time).tz(systemTimezone)
        const reqSlotEnd = dayjs(reqSlot.end_time).tz(systemTimezone)
        
        const isStartTimeValid = reqSlotStart.hour() > profStartLocal.hour() || 
                                 (reqSlotStart.hour() === profStartLocal.hour() && reqSlotStart.minute() >= profStartLocal.minute());

        const isEndTimeValid = reqSlotEnd.hour() < profEndLocal.hour() || 
                               (reqSlotEnd.hour() === profEndLocal.hour() && reqSlotEnd.minute() <= profEndLocal.minute());

        return isStartTimeValid && isEndTimeValid;
    });
}