import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import DbFactory from '../../Data/Factories/dbFactory.js';
import userRouter from '../Routes/userRouter';
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
    private app: express.Express;
    private server: import('http').Server | null = null;

    constructor() {
        // Manejo de errores no capturados
        process.on('uncaughtException', (err) => {
            customLogger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
            process.exit(1);
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            customLogger.error('Unhandled Rejection', { reason });
        });

        this.app = express();
        this.init();
        this.build();
        this.connectDb();
    }

    // Inicializar middlewares
    init() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    // Conectar base de datos
    async connectDb() {
        try {
            const db = DbFactory.create(process.env.DB);
            await db.init(process.env.DB_URI);
            console.log('Conexión a la base de datos exitosa');
        } catch (error) {
            //@ts-expect-error s
            customLogger.error(`Error al conectar con la base de datos: ${error.message}`, { stack: error.stack });
            process.exit(1);  // Si la base de datos no puede conectarse, se puede detener el servidor
        }
    }

    // Callback para devolver la aplicación
    callback() {
        return this.app;
    }

    // Cerrar el servidor
    close() {
        if (this.server) {
            this.server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        }
    }

    // Definir rutas
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

    // Solo escuchamos en un puerto si NO estamos en Vercel
    listen() {
        try {
            if (!process.env.VERCEL) {
                console.log('aca entramos')
                this.server = this.app.listen(process.env.PORT, () => {
                    console.log(`Escuchando en puerto ${process.env.PORT}`);
                });
            }
        } catch (error) {
            console.log(error)
        }

    }

    // Similar a listen, pero puede personalizarse más
    start() {
        if (!process.env.VERCEL) {
            this.server = this.app.listen(process.env.PORT, () => {
                console.log(`Escuchando en puerto ${process.env.PORT}`);
            });
        }
    }
}

export default AppExpress;

// Si estás en Vercel, exporta la aplicación sin llamar a app.listen()
const appExpressInstance = new AppExpress();
export const app = appExpressInstance.callback();