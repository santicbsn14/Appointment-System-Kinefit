import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import DbFactory from '../../Data/Factories/dbFactory.js';
import userRouter from '../Routes/userRouter.js';
import professionalRouter from '../Routes/professionalRouter.js';
import patientRouter from '../Routes/patientRouter.js';
import appointmentRouter from '../Routes/appointmentRouter.js';
import medicalRecordRouter from '../Routes/medicalRecRouter.js';
import professionalTimeSlotsRouter from '../Routes/professionalTimeSlotsRouter.js';
import notificationRouter from '../Routes/notificationRouter.js';
import dailyHourAvailabilityRouter from '../Routes/dailyHourARouter.js';
import sessionRouter from '../Routes/sessionRouter.js';
import errorHandler from '../Middlewares/errorHandler.js';
import customLogger from '../../Services/logger.js';
import roleRouter from '../Routes/roleRouter.js';
class AppExpress {
    constructor() {
        this.server = null; // Cambiado el tipo de server
        process.on('uncaughtException', (err) => {
            customLogger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
            process.exit(1); // Dependiendo de la gravedad, podrías querer reiniciar el proceso
        });
        process.on('unhandledRejection', (reason, promise) => {
            customLogger.error('Unhandled Rejection', { reason });
            // Puedes decidir si quieres cerrar el servidor o manejarlo de otra forma
        });
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
            this.server.close(async () => {
                console.log('Server closed');
                process.exit(0);
            });
        }
    }
    build() {
        this.app.use('/api/users', userRouter);
        this.app.use('/api/professionals', professionalRouter);
        this.app.use('/api/patients', patientRouter);
        this.app.use('/api/appointments', appointmentRouter);
        this.app.use('/api/medicalRecords', medicalRecordRouter);
        this.app.use('/api/professionalTimeSlots', professionalTimeSlotsRouter);
        this.app.use('/api/notifications', notificationRouter);
        this.app.use('/api/dailyHourAvailability', dailyHourAvailabilityRouter);
        this.app.use('/api/session', sessionRouter);
        this.app.use('/api/roles', roleRouter);
        this.app.use(errorHandler);
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
