import dotenv from 'dotenv'
dotenv.config()
import { createContainer, asClass, Lifetime } from 'awilix'
import UserRepository from './Data/Repositories/userMongooseRepository'
import ProfessionalRepository from './Data/Repositories/professionalMongooseRepository'
import PatientRepository from './Data/Repositories/patientMongooseRepository'
import NotificationRepository from './Data/Repositories/notificationMongooseRepository'
import AppointmentRepository from './Data/Repositories/appointmentMoongooseRepository'
import ProfessionalTimesSlotsRepository from './Data/Repositories/proTimeSlotsMongooseRepository'
import MedicalRecordRepository from './Data/Repositories/medicalRecMongooseRepository'
import ScheduledSessionsRepository from './Data/Repositories/scheduledSessionsMongooseRepository'
import DailyHourAvailabilityRepository from './Data/Repositories/dailyHourARepositoryMongoose'
const container = createContainer()

container.register({
    UserRepository: asClass(UserRepository, { lifetime: Lifetime.SINGLETON }),
    ProfessionalRepository: asClass(ProfessionalRepository, { lifetime: Lifetime.SINGLETON }),
    PatientRepository: asClass(PatientRepository, { lifetime: Lifetime.SINGLETON }),
    NotificationRepository: asClass(NotificationRepository, {lifetime: Lifetime.SINGLETON}),
    AppointmentRepository: asClass(AppointmentRepository, {lifetime: Lifetime.SINGLETON}),
    ProfessionalTimeSlotsRepository: asClass(ProfessionalTimesSlotsRepository,{lifetime: Lifetime.SINGLETON}),
    MedicalRecordRepository: asClass(MedicalRecordRepository, {lifetime: Lifetime.SINGLETON}),
    ScheduledSessionsRepository: asClass(ScheduledSessionsRepository, {lifetime: Lifetime.SINGLETON}),
    DailyHourAvailabilityRepository: asClass( DailyHourAvailabilityRepository, {lifetime: Lifetime.SINGLETON})
});




export default container