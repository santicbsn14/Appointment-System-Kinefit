//Imports locales
import dotenv from 'dotenv'
dotenv.config()
import AppFactory from './Presentation/Factories/appFactory'



const app = AppFactory.create(process.env.APPLICATION)

app.start()
export default app