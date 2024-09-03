//Imports locales
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import AppFactory from './Presentation/Factories/appFactory.js';
dotenv.config();
// Inicializar Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Si tienes una configuración específica de tu proyecto, puedes agregarla aquí
    // databaseURL: "https://your-project-id.firebaseio.com"
});
const app = AppFactory.create(process.env.APPLICATION);
app.start();
export default app;
