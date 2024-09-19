import express from 'express';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

import cors from "cors";
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

import { login, recoveryPassword, register, uploadInfoPersonal } from './modules/authentication/authentication.js';
import { extractImagesProfiles } from './modules/system/images/images.js';

import { updateAboutMe, updateResume, updatePortfolio, updateContact, deleteHobbie, deleteTestimonial, deleteCertification, deleteEducation, deleteExperience, deleteSkill, deleteWork } from './modules/UpdateInfo/updateInfo.js';
import { default as twilio } from 'twilio';
import axios from 'axios';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_GMAIL,
    pass: process.env.PASSWORD_GMAIL
  }
});


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);



app.get('/', async (req, res) => {
  console.log(PORT);
  console.log(firebaseConfig);
  const Test = collection(db, 'Test');

  //console.log(Test);

  const TestSnapshot = await getDocs(Test);
  TestSnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
  res.send('Hello World');
}
);



app.post('/register', async (req, res) => {
  const { email, password, phone, name } = req.body;
  console.log(email, password, phone, name);
  try {
    const uid = await register(email, password, phone, name);
    res.status(200).json({ uid });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const uid = await login(email, password);
    res.json({ uid });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});


app.post('/resetPassword', async (req, res) => {
  const { email } = req.body;

  try {
    await recoveryPassword(email);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/uploadInfoPersonal', async (req, res) => {
  const { birthday, imageProfile, profession, socialMedia, uid } = req.body;
  try {
    await uploadInfoPersonal({ birthday, imageProfile, profession, socialMedia, uid });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});




app.post('/uploadAbout', async (req, res) => {
  const { uid, resume, certificates, hobbies, testimonials } = req.body;
  console.log(uid, resume);
  try {
    await updateAboutMe({ uid, resume, certificates, hobbies, testimonials });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }


});

app.post('/uploadResume', async (req, res) => {
  const { uid, education, experience, skills } = req.body;
  console.log(uid, education, experience, skills);
  try {
    await updateResume({ uid, education, experience, skills });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }


});

app.post('/uploadPortfolio', async (req, res) => {
  const { uid, portfolio } = req.body;
  console.log(uid);
  console.log(portfolio);
  try {
    await updatePortfolio({ uid, portfolio });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }


});


app.get('/InfoUser/:email', async (req, res) => {
  const email = req.params.email;
  console.log(email);

  const docRef = doc(db, 'Users', email);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    res.status(404).send();
    return;
  }

  console.log(docSnap.data());
  res.send(docSnap.data());
});



app.get('/About/:email', async (req, res) => {
  const email = req.params.email;

  const collectionRef = collection(db, 'Users', email, 'About'); // Reference to the collection
  const dataAbout = await getDocs(collectionRef); // Get the data of the collection

  // If the collection is empty, return a 404 status
  if (dataAbout.empty) {
    res.status(404).send();
    return;
  }

  const data = {};

  // Loop through the data and add it to the object
  dataAbout.forEach((doc) => {
    data[doc.id] = doc.data();
  });

  res.send(data); // Send the data
});

app.get('/Resume/:email', async (req, res) => {
  const email = req.params.email;

  const collectionRef = collection(db, 'Users', email, 'Resume'); // Reference to the collection
  const dataResume = await getDocs(collectionRef); // Get the data of the collection

  // If the collection is empty, return a 404 status
  if (dataResume.empty) {
    res.status(404).send();
    return;
  }

  const data = {};

  // Loop through the data and add it to the object
  dataResume.forEach((doc) => {
    data[doc.id] = doc.data();
  });

  res.send(data); // Send the data
});

app.get('/Portfolio/:email', async (req, res) => {
  const email = req.params.email;

  const collectionRef = collection(db, 'Users', email, 'Portfolio'); // Reference to the collection
  const dataPortfolio = await getDocs(collectionRef); // Get the data of the collection

  // If the collection is empty, return a 404 status
  if (dataPortfolio.empty) {
    res.status(404).send();
    return;
  }

  const data = {};

  // Loop through the data and add it to the object
  dataPortfolio.forEach((doc) => {
    data[doc.id] = doc.data();
  });

  res.send(data); // Send the data
});

app.get('/Contact/:email', async (req, res) => {

  const email = req.params.email;

  const collectionRef = collection(db, 'Users', email, 'Contact'); // Reference to the collection
  const dataContact = await getDocs(collectionRef); // Get the data of the collection

  // If the collection is empty, return a 404 status
  if (dataContact.empty) {
    res.status(404).send();
    return;
  }

  const data = {};

  // Loop through the data and add it to the object
  dataContact.forEach((doc) => {
    data[doc.id] = doc.data();
  });

  res.send(data); // Send the data
});

app.get('/imagesProfile', async (req, res) => {
  try {
    const images = await extractImagesProfiles();
    res.status(200).json(images);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
})


app.delete('/deleteHobbie', async (req, res) => {
  try {
    const { uid, key } = req.body;

    await deleteHobbie(uid, key);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
})

app.post('/testWA', async (req, res) => {
  const { uid, emailTo, message, subjet } = req.body;

  console.log(message);

  transporter.sendMail({
    from: 'williamschan72@gmail.com',
    to: emailTo,
    subject: subjet,
    text: message
  });
  res.send(message);
})

app.delete('/deleteTestimonial', async (req, res) => {
  try {
    const { uid, id } = req.body;
    console.log(uid, id);

    await deleteTestimonial(uid, id);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/deleteCertification', async (req, res) => {
  try {
    const { uid, id } = req.body;
    console.log(uid, id);

    await deleteCertification(uid, id);
    res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/deleteEducation', async (req, res) => {
  try {
    const { uid, id } = req.body;
    console.log(uid, id);

    await deleteEducation(uid, id);
    res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/deleteExperience', async (req, res) => {
  try {
    const { uid, id } = req.body;
    console.log(uid, id);

    await deleteExperience(uid, id);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/deleteSkill', async (req, res) => {
  try {
    const { uid, id } = req.body;
    console.log(uid, id);

    await deleteSkill(uid, id);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/deleteWork', async (req, res) => {
  try {
    const { uid, id } = req.body;
    console.log(uid, id);

    await deleteWork(uid, id);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});


app.post('/geocode', async (req, res) => {
  const {uid, street, number, neighborhood, city} = req.body;
  const direccion = `${street} ${number}, ${neighborhood}, ${city}`;
  // Definir la clave de API de OpenCage
  const api_key = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${direccion}&key=${api_key}`;
  try {
    // Hacer la solicitud a la API de OpenCage
    const response = await axios.get(url);

    // Verificar si la respuesta fue exitosa
    if (response.status === 200 && response.data.results.length > 0) {
      const location = response.data.results[0].geometry;
      res.json({
        lat: location.lat,
        lng: location.lng
      });
      const db = getFirestore(appFirebase);
      const docRef = doc(db, 'Users', uid, 'Contact', 'InfoLocation'); 
      await setDoc(docRef, {
        AxisX: location.lat,
        AxisY: location.lng
      });

    } else {
      res.status(404).json({ error: "No se encontraron coordenadas para la dirección proporcionada." });
    }
  } catch (error) {
    // Manejar errores de la solicitud
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error al procesar la solicitud." });
  }
  
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
}
);
