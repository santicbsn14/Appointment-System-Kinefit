import dotenv from 'dotenv'
import { auth, initializeApp } from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

dotenv.config() 


const app = initializeApp({
  credential: applicationDefault()
});

// const db = getFirestore(app);
