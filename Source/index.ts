//Imports locales
import dotenv from 'dotenv'
import admin from 'firebase-admin';
import AppFactory from './Presentation/Factories/appFactory'
import { cert } from 'firebase-admin/app';

dotenv.config()
//@ts-ignore s
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: cert(serviceAccount), // Usa el método cert() con el objeto de credenciales
});

const app = AppFactory.create(process.env.APPLICATION)

app.start()
export default app