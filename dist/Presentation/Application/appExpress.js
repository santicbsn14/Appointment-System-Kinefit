import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import DbFactory from '../../Data/Factories/dbFactory.js';
import userRouter from '../Routes/userRouter.js';
import professionalRouter from '../Routes/professionalRouter.js';
import patientRouter from '../Routes/patientRouter.js';
import scheduledSessionsRouter from '../Routes/scheduledSessionsRouter.js';
import appointmentRouter from '../Routes/appointmentRouter.js';
import medicalRecordRouter from '../Routes/medicalRecRouter.js';
import professionalTimeSlotsRouter from '../Routes/professionalTimeSlotsRouter.js';
import notificationRouter from '../Routes/notificationRouter.js';
import dailyHourAvailabilityRouter from '../Routes/dailyHourARouter.js';
import sessionRouter from '../Routes/sessionRouter.js';
class AppExpress {
    constructor() {
        this.server = null; // Cambiado el tipo de server
        this.app = express();
        this.init();
        this.build();
        this.connectDb();
    }
    init() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }
    callback() {
        return this.app;
    }
    async connectDb() {
        const db = DbFactory.create(process.env.DB);
        await db.init(process.env.DB_URI);
    }
    close() {
        if (this.server) {
            this.server.close(() => {
                console.log('Server closed');
            });
        }
    }
    build() {
        this.app.use('/api/users', userRouter);
        this.app.use('/api/professionals', professionalRouter);
        this.app.use('/api/patients', patientRouter);
        this.app.use('/api/scheduledSessions', scheduledSessionsRouter);
        this.app.use('/api/appointments', appointmentRouter);
        this.app.use('/api/medicalRecords', medicalRecordRouter);
        this.app.use('/api/professionalTimeSlots', professionalTimeSlotsRouter);
        this.app.use('/api/notifications', notificationRouter);
        this.app.use('/api/dailyHourAvailability', dailyHourAvailabilityRouter);
        this.app.use('/api/session', sessionRouter);
    }
    listen() {
        this.server = this.app.listen(process.env.PORT, () => {
            console.log(`Escuchando en puerto ${process.env.PORT}`);
        });
    }
    start() {
        this.server = this.app.listen(process.env.PORT, () => {
            console.log(`Escuchando en puerto ${process.env.PORT}`);
        });
    }
}
export default AppExpress;
