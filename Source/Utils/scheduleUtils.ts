import { DayOfWeek, ISchedule, ISpecialty } from '../Domain/Entities/index'

const DAY_MAP: Record<number, DayOfWeek> = {
  0: DayOfWeek.Sunday,
  1: DayOfWeek.Monday,
  2: DayOfWeek.Tuesday,
  3: DayOfWeek.Wednesday,
  4: DayOfWeek.Thursday,
  5: DayOfWeek.Friday,
  6: DayOfWeek.Saturday,
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function getDayOfWeek(date: Date): DayOfWeek {
  // Usar UTC para evitar desfase de zona horaria
  const utcDay = date.getUTCDay()
  return DAY_MAP[utcDay]
}

export function validateProfessionalSchedule(schedule: ISchedule, date: Date, timeFrom: string, timeTo: string): string | null {
  const day = getDayOfWeek(date)
  const slot = schedule.weeklySlots.find((s) => s.day === day && s.isAvailable)

  if (!slot) return `El profesional no atiende los días ${day}.`

  const slotStart = timeToMinutes(slot.timeFrom)
  const slotEnd = timeToMinutes(slot.timeTo)
  const requestStart = timeToMinutes(timeFrom)
  const requestEnd = timeToMinutes(timeTo)

  if (requestStart < slotStart || requestEnd > slotEnd) {
    return `El profesional atiende de ${slot.timeFrom} a ${slot.timeTo} ese día.`
  }

  return null
}

export function validateSpecialtyRestriction(specialty: ISpecialty, date: Date, timeFrom: string, timeTo: string): string | null {
  const { restriction } = specialty
  if (!restriction.hasRestriction) return null

  const day = getDayOfWeek(date)
  if (!restriction.days.includes(day)) {
    return `La especialidad "${specialty.name}" solo se atiende los días: ${restriction.days.join(', ')}.`
  }

  const restrictionStart = timeToMinutes(restriction.timeFrom)
  const restrictionEnd = timeToMinutes(restriction.timeTo)
  const requestStart = timeToMinutes(timeFrom)
  const requestEnd = timeToMinutes(timeTo)

  if (requestStart < restrictionStart || requestEnd > restrictionEnd) {
    return `La especialidad "${specialty.name}" solo se atiende de ${restriction.timeFrom} a ${restriction.timeTo}.`
  }

  return null
}

export function calculateTimeTo(timeFrom: string, durationMinutes: number): string {
  const totalMinutes = timeToMinutes(timeFrom) + durationMinutes
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function isDateInPast(date: Date): boolean {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const check = new Date(date)
  check.setUTCHours(0, 0, 0, 0)
  return check < today
}