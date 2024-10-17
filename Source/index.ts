//Imports locales
import dotenv from 'dotenv'
import admin from 'firebase-admin';
import AppFactory from './Presentation/Factories/appFactory'


dotenv.config()

const serviceAccount = {
  type: "service_account",
  project_id: "sistema-kinefit",
  private_key_id: "c01f6353f0758d74c62df1c87de6f1285145c6c5",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCNK8sa6GzJ+bee\n8y5jwvU3LPjnYiVnIiFmVLQSXCyEECI091Z237ZmeFPbH4Qw8YgwhOo8TyY6GyXC\nmLbt/NVGfSL42lQdejU06//nbtSOcZFg2Wy999behuKBjsdbe05pwIsDTHU1hkeB\nZSqcCSmxsLNCQeDMX6P2lZgP3xqSsKFNDfqPwD4CURtqIrorKvpL2NGnZ3aYLLaq\nnLUo23FHf/pIfr/hp9LjZEhPMI5+7eZUxvrQH4mnTgkSOw43qwfejQdjRbVaA/Ig\n+tMKFsdh/5aUDkgl9Fyo+MoFzRMtF/uKp6i7n+5VG0inFs+2LBCZUgMaT7t4d9i9\n6BZ0uv6lAgMBAAECgf9Az3/YvIGt3gZQtr2keK+i4V0JzkF7zGvFQ9KVE7wQ5Tkp\nckXlenT3pVVwy3/GvEmNwKTX/DMYH7jb2jGK1MS7ATCytHpD4QRQGmMloMtAIZgk\nKcvCmEINMrKOMbM2iM7+kNBQWQXu9i9HOHYbLLBR8pFKjpm039lXl86STZ64T5I0\ngLl2Zmxpq8Ma+iyYwq9oFGITP7Qj3Do8qYG4vFwcf3m6/Uo3pz+xWilIYwj0vdrW\n9e4codHwVrh8dOCwZQlCG0Tt9Zo+ke6Sf0fedfByTI+/oS2XDZ0mL3US8v8Emo/D\n2wm8Z3yvcN9k7uKj35LTn+aYOAW7pR6QDuWi3wECgYEAwlUpTTOvxuqU0M8VU2a5\n1HN84vpHjwWZCV1qAB7UKHmsR10uddY4XhHl1HWctsiU59my5IGwnDEdVd88d4K4\nPlc8PKX4hBlYedpzwiVYTjdj/mnwKQy/P+0Jbk7HJloV1NPTmMMuDaU9JzUJi52c\nxaMPI98qgfs8IxQzHM6FDwUCgYEAuff9C/5jOmIZs0LTxoKZJoGdvF58o3VJ1+Jz\nlfcMvqFriKbn0gz37B7bBdBwjlEZufKC6CaDk42tFdrXOscwoYo1P6RUvwfq5L8O\n8h0rzMevsW4fLZxrYPhWE8hU9JVac0zaxQIduWmuqTxnoMPhV4gGF6R2ZShePcuH\nxQN7AyECgYEAsYCB8h9U3fckqLmN/BjnghNerh/3Pr7ZMwGdMbD3DmVco+6L4lwi\nLmJgsDghRZ9ey4tAaJHBFFmUNvxpyaufyGl7/tWGcnqIIv0TIPFlgEP91MNE9unK\nwoQrShMwumosaLJ3IqCcryAQBIDgUCNNsAQpbxWHSSSGoG/x480LIlUCgYBvNXxO\nas6+ACIsT99Cy6B4JXTFS5+vRBlnj1TdrkIh0Xfz3ROuSfEMc5s4i+BzSs5eo0Zj\nO3zdhRCnjBm/XZSYVYToTQYcwshWCGcQpB8oM5W+PgNJDEwuTfNzmw4qwRG495Gv\n1EcgNLGtJKE3w0uDQ6WZB9GBRrWssIS9bQpn4QKBgQCGLizA5VZ5GJ7YuX6o5kJF\nEjBAYlQX/WhHfT9ZPFtTJOFr8CU3otKN00CR/8GZlDBRHkaJwuXkjBiRRC5tAekq\nb2jPAC0eODJZjTki7oaQMYa+NqW/EVofIfv+tITM7vCyqFq8l3aiHu0XxMr3So4j\n+0iEdeubnS0IIvqzwDVOqg==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-tx9w2@sistema-kinefit.iam.gserviceaccount.com",
  client_id: "113112190761279313817",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tx9w2%40sistema-kinefit.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
}


admin.initializeApp({
  //@ts-ignore s
  credential: admin.credential.cert(serviceAccount), // Usa el método cert() con el objeto de credenciales
});

const app = AppFactory.create(process.env.APPLICATION)

app.start()
export default app