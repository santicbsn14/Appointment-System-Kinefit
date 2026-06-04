import { Router } from 'express'
import { AwilixContainer } from 'awilix'
import { authenticate, authorize } from '../Middlewares/auth'
import { Role } from '../../Domain/Entities/index'
import { AuthController } from '../Controllers/authController'
import { AppointmentController } from '../Controllers/appointmentController'
import { ProfessionalController } from '../Controllers/professionalController'
import { SpecialtyController } from '../Controllers/specialtyController'
import { PatientController } from '../Controllers/patientController'
import { UserController } from '../Controllers/userController'
export function createRouter(container: AwilixContainer): Router {
  const router = Router()

  const auth = container.resolve<AuthController>('authController')
  const appointment = container.resolve<AppointmentController>('appointmentController')
  const professional = container.resolve<ProfessionalController>('professionalController')
  const specialty = container.resolve<SpecialtyController>('specialtyController')
  const patient = container.resolve<PatientController>('patientController')
  const user = container.resolve<UserController>('userController')
  router.post('/auth/register', auth.register)
  router.post('/auth/login', auth.login)
  router.post('/auth/forgot-password', auth.forgotPassword)
  router.post('/auth/reset-password', auth.resetPassword)

  router.get('/specialties', authenticate, specialty.getAll)
  router.get('/specialties/:id', authenticate, specialty.getById)
  router.post('/specialties', authenticate, authorize(Role.Admin, Role.Secretary), specialty.create)
  router.put('/specialties/:id', authenticate, authorize(Role.Admin, Role.Secretary), specialty.update)
  router.delete('/specialties/:id', authenticate, authorize(Role.Admin), specialty.delete)

  router.get('/professionals', authenticate, professional.getAll)
  router.get('/professionals/:id', authenticate, professional.getById)
  router.post('/professionals', authenticate, authorize(Role.Admin), professional.create)
  router.post('/professionals/:id/specialties', authenticate, authorize(Role.Admin), professional.addSpecialty)
  router.delete('/professionals/:id/specialties/:specialtyId', authenticate, authorize(Role.Admin), professional.removeSpecialty)
  router.put('/professionals/:id/schedule', authenticate, authorize(Role.Admin, Role.Secretary, Role.Professional), professional.setSchedule)
  router.delete('/professionals/:id', authenticate, authorize(Role.Admin), professional.delete)

  router.get('/appointments/mine', authenticate, authorize(Role.Patient), appointment.getMyAppointments)
  router.post('/appointments', authenticate, authorize(Role.Patient), appointment.create)
  router.patch('/appointments/:id/cancel', authenticate, authorize(Role.Patient), appointment.cancelByPatient)

  router.get('/appointments', authenticate, authorize(Role.Secretary, Role.Admin), appointment.getAll)
  router.get('/appointments/:id', authenticate, authorize(Role.Secretary, Role.Admin, Role.Professional), appointment.getById)
  router.get('/appointments/professional/:professionalId', authenticate, authorize(Role.Secretary, Role.Admin, Role.Professional), appointment.getByProfessional)
  router.patch('/appointments/:id/approve', authenticate, authorize(Role.Secretary, Role.Admin), appointment.approve)
  router.patch('/appointments/:id/reject', authenticate, authorize(Role.Secretary, Role.Admin), appointment.reject)
  router.patch('/appointments/:id/cancel-secretary', authenticate, authorize(Role.Secretary, Role.Admin), appointment.cancelBySecretary)

  router.get('/patients', authenticate, authorize(Role.Secretary, Role.Admin), patient.getAll)
router.get('/patients/:id', authenticate, authorize(Role.Secretary, Role.Admin, Role.Professional), patient.getById)
router.put('/patients/:id', authenticate, authorize(Role.Secretary, Role.Admin), patient.update),

router.post('/users', authenticate, authorize(Role.Admin, Role.Secretary), user.create)
router.get('/users', authenticate, authorize(Role.Admin, Role.Secretary), user.getAll)
router.delete('/users/:id', authenticate, authorize(Role.Admin), user.delete)
router.put('/users/:id/password', authenticate, user.updatePassword)

  return router
}