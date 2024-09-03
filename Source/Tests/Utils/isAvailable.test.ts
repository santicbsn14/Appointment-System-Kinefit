import dayjs from 'dayjs'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import { DaySchedule } from '../../Data/Models/professionalTimeSlotsSchema'
import { isAvailable } from 'Source/Utils/scheduleUtils';
describe('isAvailable', () => {
    it('should return true when the patient request fits within the professional\'s schedule', () => {
        const professionalSchedule: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T08:00:00Z"),
                    end_time: dayjs("2024-09-02T17:00:00Z")
                }
            }
        ];

        const patientRequest: DaySchedule = {
            week_day: 1, // Monday
            time_slots: {
                start_time: dayjs("2024-09-02T09:00:00Z"),
                end_time: dayjs("2024-09-02T10:00:00Z")
            }
        };

        const result = isAvailable(professionalSchedule, patientRequest);
        expect(result).toBe(true);
    });

    it('should return false when the professional does not work on the requested day', () => {
        const professionalSchedule: DaySchedule[] = [
            {
                week_day: 2, // Tuesday
                time_slots: {
                    start_time: dayjs("2024-09-03T08:00:00Z"),
                    end_time: dayjs("2024-09-03T17:00:00Z")
                }
            }
        ];

        const patientRequest: DaySchedule = {
            week_day: 1, // Monday
            time_slots: {
                start_time: dayjs("2024-09-02T09:00:00Z"),
                end_time: dayjs("2024-09-02T10:00:00Z")
            }
        };

        const result = isAvailable(professionalSchedule, patientRequest);
        expect(result).toBe(false);
    });

    it('should return false when the patient request starts before the professional\'s available time', () => {
        const professionalSchedule: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T08:00:00Z"),
                    end_time: dayjs("2024-09-02T17:00:00Z")
                }
            }
        ];

        const patientRequest: DaySchedule = {
            week_day: 1, // Monday
            time_slots: {
                start_time: dayjs("2024-09-02T07:00:00Z"),
                end_time: dayjs("2024-09-02T09:00:00Z")
            }
        };

        const result = isAvailable(professionalSchedule, patientRequest);
        expect(result).toBe(false);
    });

    it('should return false when the patient request ends after the professional\'s available time', () => {
        const professionalSchedule: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T08:00:00Z"),
                    end_time: dayjs("2024-09-02T17:00:00Z")
                }
            }
        ];

        const patientRequest: DaySchedule = {
            week_day: 1, // Monday
            time_slots: {
                start_time: dayjs("2024-09-02T16:00:00Z"),
                end_time: dayjs("2024-09-02T18:00:00Z")
            }
        };

        const result = isAvailable(professionalSchedule, patientRequest);
        expect(result).toBe(false);
    });

    it('should return true when multiple patient requests fit within the professional\'s schedule', () => {
        const professionalSchedule: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T08:00:00Z"),
                    end_time: dayjs("2024-09-02T17:00:00Z")
                }
            }
        ];

        const patientRequests: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T09:00:00Z"),
                    end_time: dayjs("2024-09-02T10:00:00Z")
                }
            },
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T11:00:00Z"),
                    end_time: dayjs("2024-09-02T12:00:00Z")
                }
            }
        ];

        const result = isAvailable(professionalSchedule, patientRequests);
        expect(result).toBe(true);
    });

    it('should return false when any of the multiple patient requests do not fit within the professional\'s schedule', () => {
        const professionalSchedule: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T08:00:00Z"),
                    end_time: dayjs("2024-09-02T17:00:00Z")
                }
            }
        ];

        const patientRequests: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T09:00:00Z"),
                    end_time: dayjs("2024-09-02T10:00:00Z")
                }
            },
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T16:00:00Z"),
                    end_time: dayjs("2024-09-02T18:00:00Z")
                }
            }
        ];

        const result = isAvailable(professionalSchedule, patientRequests);
        expect(result).toBe(false);
    });
    it('should return false when the pacient request a day that  the professional not work', () => {
        const professionalSchedule: DaySchedule[] = [
            {
                week_day: 1, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T08:00:00Z"),
                    end_time: dayjs("2024-09-02T17:00:00Z")
                }
            }
        ];

        const patientRequests: DaySchedule[] = [
            {
                week_day: 2, // Monday
                time_slots: {
                    start_time: dayjs("2024-09-02T09:00:00Z"),
                    end_time: dayjs("2024-09-02T10:00:00Z")
                }
            },
        ];

        const result = isAvailable(professionalSchedule, patientRequests);
        expect(result).toBe(false);
    });
});