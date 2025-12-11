import { DaySchedule } from 'Source/Data/Models/professionalTimeSlotsSchema';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import utc from 'dayjs/plugin/utc.js'; 
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

export function isAvailable(
    professionalSchedule: DaySchedule[],
    patientRequest: DaySchedule | DaySchedule[]
): boolean {
    const requests = Array.isArray(patientRequest) ? patientRequest : [patientRequest];

    return requests.every((requestedDay: DaySchedule) => {
        // Buscamos si el profesional trabaja en el día solicitado
        const matchingDay = professionalSchedule.find(
            (profDay: DaySchedule) => profDay.week_day === requestedDay.week_day
        );

        if (!matchingDay) {
            console.log('❌ El profesional no trabaja el día:', requestedDay.week_day);
            return false;
        }

        // Obtenemos los slots de tiempo tanto del profesional como del paciente
        const reqSlot = requestedDay.time_slots;
        const profSlot = matchingDay.time_slots;

        // CAMBIO CLAVE: usar .utc() para mantener la hora exacta sin conversión de timezone
        const profStartLocal = dayjs.utc(profSlot.start_time);
        const profEndLocal = dayjs.utc(profSlot.end_time);
        const reqSlotStart = dayjs.utc(reqSlot.start_time);
        const reqSlotEnd = dayjs.utc(reqSlot.end_time);
        
        console.log('===== DEBUG VALIDACIÓN HORARIOS =====');
        console.log('Día de la semana:', requestedDay.week_day);
        console.log('Profesional trabaja de:', profStartLocal.format('HH:mm'), 'a', profEndLocal.format('HH:mm'));
        console.log('Paciente solicita de:', reqSlotStart.format('HH:mm'), 'a', reqSlotEnd.format('HH:mm'));
        
        const isStartTimeValid = reqSlotStart.hour() >= profStartLocal.hour() && 
                                 (reqSlotStart.hour() > profStartLocal.hour() || reqSlotStart.minute() >= profStartLocal.minute());

        const isEndTimeValid = reqSlotEnd.hour() <= profEndLocal.hour() && 
                               (reqSlotEnd.hour() < profEndLocal.hour() || reqSlotEnd.minute() <= profEndLocal.minute());

        console.log('✓ Start válido?', isStartTimeValid);
        console.log('✓ End válido?', isEndTimeValid);
        console.log('✓ RESULTADO FINAL:', isStartTimeValid && isEndTimeValid);
        console.log('=====================================');

        return isStartTimeValid && isEndTimeValid;
    });
}