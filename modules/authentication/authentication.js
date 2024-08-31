import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword , sendPasswordResetEmail , createUserWithEmailAndPassword} from 'firebase/auth';
import { getAuth as getAuthAdmin } from 'firebase-admin/auth';
import scifolio_admin_keys from '../../scifolio-firebase-adminsdk.json' assert { type: "json" };
import admin from 'firebase-admin';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

import dotenv from 'dotenv';

dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

// Initialize Firebase Admin

const appFirebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(scifolio_admin_keys)
});

async function createUser (name, email, phone, uid) {
  try {
    const db = getFirestore(appFirebase);
    await setDoc(doc(db, 'Users', uid),{
      Name: name,
      Phone: phone,
      Email: email,
      Birth: '',
      ImgProfile: '',
      Profession: '',
      SocialNetworks: []
    })
  } catch (error) {
    throw new Error(error.code);
  }
}
export async function register (email, password, phone, name) {
  try {
    const auth = getAuth(appFirebase);
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    const uid = newUser.user.uid;
    await createUser(name, email, phone, uid);
    return uid;
  } catch (error){
    throw new Error(error.code);
  }
}

export async function login(email, password) {
  try {
    const auth = getAuth(appFirebase);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.code);
  }
}

async function doesUserExist(email) {
  try {
    const auth = getAuthAdmin(appFirebaseAdmin);
    await auth.getUserByEmail(email);
  } catch (error) {
    throw new Error(error.code);
  }
}

export async function recoveryPassword (email) {
  await doesUserExist(email);

  try {  
    const auth = getAuth(appFirebase);
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(error.code);
  }
}
