import { initializeApp } from 'firebase/app';
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

export async function extractImagesProfiles(){
  try {
    const db = getFirestore(appFirebase);
    const imgs = doc(db, 'system', 'imagesProfile');
    const urlsImages = await getDoc(imgs);
    //console.log(urlsImages.data());

    return urlsImages.data();
  } catch (error) {
    throw new Error(error.code);
  }
}