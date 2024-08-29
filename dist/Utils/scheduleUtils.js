export function isAvailable(professionalSchedule, patientRequest) {
    return patientRequest.every((requestedDay) => {
        const matchingDay = professionalSchedule.find((profDay) => profDay.week_day === requestedDay.week_day);
        if (!matchingDay)
            return false;
        const reqSlot = requestedDay.time_slots;
        const profSlot = matchingDay.time_slots;
        return reqSlot.start_time >= profSlot.start_time && reqSlot.end_time <= profSlot.end_time;
    });
}
// Datos de prueba para el horario del profesional
const professionalSchedule = [
    { week_day: "Monday", time_slots: { start_time: "09:00", end_time: "17:00" } },
    { week_day: "Tuesday", time_slots: { start_time: "09:00", end_time: "17:00" } },
];
// Datos de prueba para el horario solicitado por el paciente
const patientRequest = [
    { week_day: "Monday", time_slots: { start_time: "10:00", end_time: "11:00" } },
    { week_day: "Tuesday", time_slots: { start_time: "09:30", end_time: "10:30" } },
];
// Ejecutar la función y mostrar el resultado
const result = isAvailable(professionalSchedule, patientRequest);
console.log(`Is available: ${result}`); // Debería mostrar: true
