import express from 'express';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

import cors from "cors";
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

import { login, recoveryPassword , register } from './modules/authentication/authentication.js';

// hexd xeoq laih xgbp


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


app.get('/', async (req, res) => {
  console.log(PORT);
  console.log(firebaseConfig);
  const Test = collection(db, 'Test');

  console.log(Test);

  const TestSnapshot = await getDocs(Test);
  TestSnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });


  res.send('Hello World');
}
);



app.post('/register', async (req, res) => {
  const { email, password, phone, name } = req.body;

  try {
    const uid = await register (email, password, phone, name);
    res.status(200).json({ uid });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await login(email, password);
    res.sendStatus(200);
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

app.get('/InfoUser/:email', async (req, res) => {
  const email = req.params.email;

  const docRef = doc(db, 'Users', email);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    res.status(404).send();
    return;
  }

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

app.listen(PORT, () => {
  console.log('Server is running on port 3000 🚀');
}
);
