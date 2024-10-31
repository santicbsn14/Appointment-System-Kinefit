//Imports locales
import dotenv from 'dotenv'
import admin from 'firebase-admin';
import AppFactory from './Presentation/Factories/appFactory'
import serviceAccount from "../firebase.key.json" assert { type: "json" };

dotenv.config()


admin.initializeApp({
  //@ts-ignore s
  credential: admin.credential.cert(serviceAccount), 
});

const app = AppFactory.create(process.env.APPLICATION)

app.start()
export default app