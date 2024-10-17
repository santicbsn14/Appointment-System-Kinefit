//Imports locales
import dotenv from 'dotenv'
import admin from 'firebase-admin';
import AppFactory from './Presentation/Factories/appFactory'


dotenv.config()

const serviceAccount = {
  type: "service_account",
  project_id: "sistema-kinefit",
  private_key_id: "e8acbd2ff7debe4eb3bd27d80f258803cda70541",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0EGJqE3rvNKmX\nhigUX78dJ2OInlZZIN61z9VnGrpEKuET1n1RT4gAHDDtKSws+eZeVjwOutWFVzGo\nWR2DwirNgIEb/0HAAqwy7RuXrno9vC+3tIqAFj6MBv4AR6dagJ52tHqo0fG3MSbB\ngrkC2NY8IpYktjvLU4Noaxt572udLW7thbw6nSkYnxhym3whrG7c2qYfq9AJ4Gxd\nRbcctpqIH+iGlz+Tvc7SzTy7E/kbJZzXNtpD7W0A7GwWYJJK5DJF4iHFdyX7Nnd7\nY4YKHSJaPAdjKhv/XejiUjVILl3IjKryVdxjHcYka3b6GClauRjV+ii4f3iIR+Jp\nC+89ZIdTAgMBAAECggEAVZtsjq4QRmWtM4LuzzDuNbgiVDOjLeC4wYu8E7bbU8ln\nFP1mux+qsxK0GCz4+bEd2z/4cbBWD3zy+OzVYW0Q2H794weqhNVAdT3RXn3vVCaC\nMT6+kkMBHaW9YPiwEhEQRbNslZKq7sOJf3rc5wOcZx6yb2XMa9Caqyww9fnkGedR\ngCdjHxueggacje2xK541EUPJCIMqOXzA7M6XqDF6LJmZKEFmjFCge3XdJ0hmqTc8\n72rgidrIzf5BttvBVGfqQil1x0njncBfbGSpGkq1ohnSztj7ehA5TdiXCXgaLSE0\nzA6rwhZZfbQevQBgt4Wo8bKXJ7j8V+Qg/mk4EvbI0QKBgQDfxx5mkYSSk+4AcbZw\niJEeMS/9NBjpt1OkPzR2FK7/00uIRLDljD7zrU+WN0IozdEAGdSgpSKjxVbIcDNh\n9IqMfxhyF0Dtq56TMBhRbVOVcP5CQEWpnmUbLddoQFZmUuJlm2cj+zYbxCttvqoS\nrhR5S0KexPC1QVscbq/EGWwStQKBgQDN/eP66riLO3GHT93fK6wUJ4sXPqd/9bck\nF9O6NrRrrR/q6j6zs/4zTjDjyCYpWi50fdMmE4Acp050481i8pyjDFDG/e2Qo0zJ\nQa4duxLfUBRek4m8xqhr6lRXhbCY+tJd0D2dGwAjBaUseGr3/vdXB/Ow2CGA3do2\nw+8rJ8rO5wKBgDoHpc+NXuav6+E7m8b080T0FnC/6NH603rdVRpl5Le8sHKm9YSh\naNXCFMhsjgCM1u0Cxcve5uu3Sfjyd7CoPKGQd+NmOlUn0xhyOWwsQKeZRKYjiq0g\nwTFaIukK/hzM057rvMRs6awro+NytSHg+Lg3lxAbHBy01Q67eWMOAKOdAoGADevD\nlXh5YkdxI7DdELD13yLQ/pAoZ7hmWRUXJPV/eetoRcrw09otKrB1E1+6XH8QtqSu\nOVuGA+m2nqWqgq5csZQqfVg5ztWKYeuDZdT3sInL5pxX6Z8PUMO0UXnidmQ1BUwG\nbfCeML+36up0aDAd7Q7HhEMG+JuFnL/fEO6OgS8CgYEAggTUwv1iWuh4QbzMJBDV\ncDNldSmHDuLqnMsYWxkhqoDhGdg2LUiymFVkKzLc9DrC5ISFMQySo59TY6juNwdr\n58UcmygEUoCupE5V9pfHiokbYP198jmkmF09cnSdhexjwiEbZdrIGUwVroZLQQfS\nM8smHMGBNy5k8JLEtqiQXcs=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-tx9w2@sistema-kinefit.iam.gserviceaccount.com",
  client_id: "113112190761279313817",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tx9w2%40sistema-kinefit.iam.gserviceaccount.com",
  
}

admin.initializeApp({
  //@ts-ignore s
  credential: admin.credential.cert(serviceAccount), 
});

const app = AppFactory.create(process.env.APPLICATION)

app.start()
export default app