import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth as getAuthAdmin } from 'firebase-admin/auth';
import scifolio_admin_keys from '../../scifolio-firebase-adminsdk.json' assert { type: "json" };
import admin from 'firebase-admin';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

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

async function createUser(name, email, phone, uid) {
  try {
    const db = getFirestore(appFirebase);
    await setDoc(doc(db, 'Users', uid), {
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
export async function register(email, password, phone, name) {
  try {
    const auth = getAuth(appFirebase);
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    const uid = newUser.user.uid;
    await createUser(name, email, phone, uid);
    return uid;
  } catch (error) {
    throw new Error(error.code);
  }
}

export async function login(email, password) {
  try {
    const auth = getAuth(appFirebase);
    const uid = await signInWithEmailAndPassword(auth, email, password);
    console.log(uid.user.uid);
    return uid.user.uid;
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

export async function recoveryPassword(email) {
  await doesUserExist(email);

  try {
    const auth = getAuth(appFirebase);
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(error.code);
  }
}

export async function uploadInfoPersonal(data) {
  const { uid, imageProfile, birthday, profession, socialMedia } = data;

  try {
    const db = getFirestore(appFirebase);
    const refUser = doc(db, 'Users', uid);


    const user = await getDoc(refUser);
    if (user.exists()) {
      const socialNetworks = [];
      Object.keys(socialMedia).forEach((key) => {
        socialNetworks.push({
          Key: key,
          URL: socialMedia[key] ? socialMedia[key] : ''
        });
      });
      try {
        await updateDoc(refUser, {
          ImgProfile: imageProfile,
          Birth: birthday,
          Profession: profession,
          SocialNetworks: socialNetworks
        });
      } catch (error) {
        throw new Error(error.code);
      }
      // Crea documentos adicionales con datos por defecto
      await setDoc(doc(db, 'Users', uid, 'About', 'Certifications'), {
        Certifications: [
          "Primer certificado"
        ]
      }, { merge: true }); // Usa merge para no sobrescribir datos existentes

      await setDoc(doc(db, 'Users', uid, 'About', 'Hobbies'), {
        Hobbies: [
          {
            Hobbie: "Lectura",
            Key: "Lectura",
            Resume: "Tu primer hobbie"
          }
        ]
      }, { merge: true });
      await setDoc(doc(db, 'Users', uid, 'About', 'Resume'), {
        Text: "Tu resumen profesional"
      }, { merge: true });
      await setDoc(doc(db, 'Users', uid, 'About', 'Testimonials'), {
        Testimonials: [
          {
            Image: "https://res.cloudinary.com/djss53chk/image/upload/v1723684799/Memojis/Male/xauqsfu5uzgr12fs9rjj.svg",
            Name: "Nombre",
            Text: "Breve descripción"
          }
        ]
      }, { merge: true });

      await setDoc(doc(db, 'Users', uid, 'Contact', 'InfoLocation'), {
        AxisX: 19.354485,
        AxisY: -99.315599
      }, { merge: true });
      await setDoc(doc(db, 'Users', uid, 'Portfolio', 'Works'), {
        Works: [
          {
            Category: "Investigation",
            ImgProject: "https://via.placeholder.com/150x120",
            NameProject: "Nombre del proyecto"
          }
        ]
      }, { merge: true });
      await setDoc(doc(db, 'Users', uid, 'Resume', 'Education'), {
        Education: [
          {
            Country: "Ciudad",
            Name: "Nombre de lo que estudiaste",
            School: "Nombre de la escuela",
            State: "Estado",
            YearEnd: "Año de finalización",
            YearStart: "Año de inicio"

          }
        ]
      }, { merge: true });
      await setDoc(doc(db, 'Users', uid, 'Resume', 'Experience'), {
        Experience: [
          {
            Company: "Nombre de la empresa",
            End: "Año de finalización",
            Name: "Nombre del puesto",
            Start: "Año de inicio",
          }
        ]

      }, { merge: true });
      await setDoc(doc(db, 'Users', uid, 'Resume', 'Skills'), {
        Skills: [
          {
            Name: "Nombre de la habilidad",
            Value: 50
          }
        ]
      }, { merge: true });

    } else {
      throw new Error('auth/user-not-found');
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
