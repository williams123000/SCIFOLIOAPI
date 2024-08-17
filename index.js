import express from 'express';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs , getDoc ,  doc, setDoc , updateDoc } from 'firebase/firestore';

import cors from "cors";
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

// hexd xeoq laih xgbp

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_GMAIL,
        pass: process.env.PASSWORD_GMAIL
    }
});
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
const db = getFirestore(appFirebase);


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

app.post('/Login', async (req, res) => {
    const { email, password } = req.body;

    const collectionRef = collection(db, 'Users', email, 'Access');
    const dataAccess = await getDocs(collectionRef);

    if (dataAccess.empty) {
        res.status(404).send();
        return;
    }

    const emailData = dataAccess.docs[0].data().email;
    const passwordData = dataAccess.docs[0].data().password;

    if (emailData !== email || passwordData !== password) {
        res.status(401).send();
        return;
    } else {
        res.status(200).send();
    }
});

function generarContrasena() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let contrasena = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres[randomIndex];
    }
    return contrasena;
}

app.post('/ResetPassword', async (req, res) => {
    const { email } = req.body;

    console.log(email);

    const collectionRef = collection(db, 'Users', email, 'Access');

    const dataAccess = await getDocs(collectionRef);

    if (dataAccess.empty) {
        res.status(404).send();
        return;
    }

    dataAccess.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });

    const newPassword = generarContrasena();

    console.log(newPassword);

    const mailOptions = {
        from: process.env.EMAIL_GMAIL,
        to: 'newton1057@gmail.com',
        subject: 'Reset Password',
        text: `Your new password is: ${newPassword}`
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            console.log('Email sent: ' + info.response);
            const docRef = doc(db, 'Users', email, 'Access', 'Access');
            await updateDoc(docRef, {
                password: newPassword
            });
            res.status(200).send();
        }
    });

    res.status(200).send();
}
);

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
