import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { buildContainer } from './container'
import { createRouter } from './Presentation/Routes/index'
import { errorHandler } from './Presentation/Middlewares/errorHandler'

const app = express()
const PORT = process.env.PORT ?? 8080

app.use(cors())
app.use(express.json())
app.use(cookieParser())

const container = buildContainer()
app.use('/api', createRouter(container))
app.use(errorHandler)

async function main() {
  const mongoUri = process.env.MONGO_URI
  if (!mongoUri) throw new Error('MONGO_URI no configurada.')

  await mongoose.connect(mongoUri)
  console.log('✅ Conectado a MongoDB')

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error('❌ Error al iniciar el servidor:', err)
  process.exit(1)
})