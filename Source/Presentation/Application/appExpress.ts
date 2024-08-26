import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import DbFactory from '../../Data/Factories/dbFactory.js';
import userRouter from '../Routes/userRouter';
import professionalRouter from '../Routes/professionalRouter.js';

class AppExpress {
    private app: express.Express;
    private server: import('http').Server | null = null;  // Cambiado el tipo de server

    constructor() {
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
        this.app.use('/api/users', userRouter)
        this.app.use('/api/professionals', professionalRouter)
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
