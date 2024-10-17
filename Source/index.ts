//Imports locales
import dotenv from 'dotenv'
import admin from 'firebase-admin';
import AppFactory from './Presentation/Factories/appFactory'

dotenv.config()

// Inicializar Firebase Admin SDK
admin.initializeApp({

  credential: process.env.GOOGLE_APPLICATION_CREDENTIALS,

});

const app = AppFactory.create(process.env.APPLICATION)

app.start()
export default app
