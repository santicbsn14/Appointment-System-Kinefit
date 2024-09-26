import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
export function isAvailable(professionalSchedule, patientRequest) {
    // Convertimos `patientRequest` en un array si no lo es
    const requests = Array.isArray(patientRequest) ? patientRequest : [patientRequest];
    return requests.every((requestedDay) => {
        // Buscamos si el profesional trabaja en el día solicitado
        const matchingDay = professionalSchedule.find((profDay) => profDay.week_day === requestedDay.week_day);
        if (!matchingDay)
            return false;
        // Obtenemos los slots de tiempo tanto del profesional como del paciente
        const reqSlot = requestedDay.time_slots;
        const profSlot = matchingDay.time_slots;
        // Comparamos los horarios utilizando los métodos de dayjs
        const isStartTimeValid = reqSlot.start_time.isSameOrAfter(profSlot.start_time);
        const isEndTimeValid = reqSlot.end_time.isSameOrBefore(profSlot.end_time);
        return isStartTimeValid && isEndTimeValid;
    });
}
