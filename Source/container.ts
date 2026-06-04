import { createContainer, asClass, InjectionMode } from 'awilix'

import { UserMongooseRepository } from './Data/Repositories/userMongooseRepository'
import { PatientMongooseRepository } from './Data/Repositories/patientMongooseRepository'
import { SpecialtyMongooseRepository } from './Data/Repositories/specialtyMongooseRepository'
import { ScheduleMongooseRepository } from './Data/Repositories/scheduleMongooseRepository'
import { ProfessionalMongooseRepository } from './Data/Repositories/professionalMongooseRepository'
import { AppointmentMongooseRepository } from './Data/Repositories/appointmentMongooseRepository'

import { AuthManager } from './Domain/Manager/authManager'
import { AppointmentManager } from './Domain/Manager/appointmentManager'
import { ProfessionalManager } from './Domain/Manager/professionalManager'
import { SpecialtyManager } from './Domain/Manager/specialtyManager'
import { PatientManager } from './Domain/Manager/patientManager'

import { AuthController } from './Presentation/Controllers/authController'
import { AppointmentController } from './Presentation/Controllers/appointmentController'
import { ProfessionalController } from './Presentation/Controllers/professionalController'
import { SpecialtyController } from './Presentation/Controllers/specialtyController'
import { PatientController } from './Presentation/Controllers/patientController'
import { UserController } from './Presentation/Controllers/userController'

export function buildContainer() {
  const container = createContainer({ injectionMode: InjectionMode.PROXY })

  container.register({
    userRepository: asClass(UserMongooseRepository).singleton(),
    patientRepository: asClass(PatientMongooseRepository).singleton(),
    specialtyRepository: asClass(SpecialtyMongooseRepository).singleton(),
    scheduleRepository: asClass(ScheduleMongooseRepository).singleton(),
    professionalRepository: asClass(ProfessionalMongooseRepository).singleton(),
    appointmentRepository: asClass(AppointmentMongooseRepository).singleton(),

    authManager: asClass(AuthManager).singleton(),
    appointmentManager: asClass(AppointmentManager).singleton(),
    professionalManager: asClass(ProfessionalManager).singleton(),
    specialtyManager: asClass(SpecialtyManager).singleton(),
    patientManager: asClass(PatientManager).singleton(),

    authController: asClass(AuthController).singleton(),
    appointmentController: asClass(AppointmentController).singleton(),
    professionalController: asClass(ProfessionalController).singleton(),
    specialtyController: asClass(SpecialtyController).singleton(),
    patientController: asClass(PatientController).singleton(),
    userController: asClass(UserController).singleton(),
    
  })

  return container
}