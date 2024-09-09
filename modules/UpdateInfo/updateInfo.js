import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth as getAuthAdmin } from 'firebase-admin/auth';
import scifolio_admin_keys from '../../scifolio-firebase-adminsdk.json' assert { type: "json" };
import admin from 'firebase-admin';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';

import dotenv from 'dotenv';

dotenv.config();

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





export async function updateAboutMe(data) {
    const { uid, resume, certificates, hobbies, testimonials } = data;
    console.log(data);

    try {

        const db = getFirestore(appFirebase);
        const user = doc(db, 'Users', uid);

        // Crear una colección llamada About en el documento del usuario si no existe
        const about = collection(user, 'About');

        // Crear un documento llamado Resume en la colección About si no existe
        const resumeDoc = doc(about, 'Resume');
        // Crear un documento llamado Certifications en la colección About si no existe
        const certificationsDoc = doc(about, 'Certifications');
        // Crear un documento llamado Hobbies en la colección About si no existe
        const hobbiesDoc = doc(about, 'Hobbies');
        // Crear un documento llamado Testimonials en la colección About si no existe
        const testimonialsDoc = doc(about, 'Testimonials');

        if (resume != undefined) {
            // Actualizar el documento Resume con la información del usuario
            await setDoc(resumeDoc, {
                Text: resume
            });
        }

        if (certificates != undefined) {
            var dataCertificates = await getDoc(certificationsDoc);
            dataCertificates = dataCertificates.data().Certifications;
            //console.log(dataCertificates)
            // Transformar certificates en un array y guardar en el documento Certifications
            const certificatesList = [];
            Object.keys(certificates).forEach((key) => {
                certificatesList.push(certificates[key]);

            });

            //console.log(certificatesList);

            const mergedList = dataCertificates.concat(certificatesList);
            // Guardar el array en el documento Certifications
            await setDoc(certificationsDoc, {
                Certifications: mergedList
            });
        }

        if (testimonials != undefined) {
            // Transformar Testimonials en un array y guardar en el documento Testimonials
            var dataTestimonials = await getDoc(testimonialsDoc);
            dataTestimonials = dataTestimonials.data().Testimonials;
            //console.log(dataTestimonials)
            const testimonialsArray = [];
            Object.keys(testimonials).forEach(key => {
                const testimonial = testimonials[key];
                if (testimonial.Nombre && testimonial.Descripcion && testimonial.Imagen) {
                    if (testimonial.Imagen === "Hombre") {
                        testimonial.Imagen = "https://res.cloudinary.com/djss53chk/image/upload/v1723684799/Memojis/Male/xauqsfu5uzgr12fs9rjj.svg"
                    }
                    if (testimonial.Imagen === "Mujer") {
                        testimonial.Imagen = "https://res.cloudinary.com/djss53chk/image/upload/v1725846132/Memojis/Female/f4hxxf1qyiy94r1kuyzc.png"
                    }
                    testimonialsArray.push({
                        Image: testimonial.Imagen,
                        Name: testimonial.Nombre,
                        Text: testimonial.Descripcion
                    });
                }

            });

            //console.log(testimonialsArray);
            const mergedList = dataTestimonials.concat(testimonialsArray);
            // Guardar el array en el documento Testimonials
            await setDoc(testimonialsDoc, {
                Testimonials: mergedList
            });
        }


        if (hobbies != undefined) {
            // Transformar Hobbies en un array y guardar en el documento Hobbies
            var dataHobbies = await getDoc(hobbiesDoc);
            dataHobbies = dataHobbies.data().Hobbies;
            //console.log(dataHobbies)
            const hobbiesArray = [];
            Object.keys(hobbies).forEach(key => {
                const hobby = hobbies[key];
                if (hobby.Descripcion && hobby.Categoria) {
                    hobbiesArray.push({
                        Hobbie: hobby.Categoria,
                        Key: hobby.Categoria, // Usamos el nombre como clave en inglés para este ejemplo
                        Resume: hobby.Descripcion
                    });
                }
            });

            //console.log(hobbiesArray);
            const mergedList = dataHobbies.concat(hobbiesArray);
            // Guardar el array en el documento Hobbies
            await updateDoc(hobbiesDoc, {
                Hobbies: mergedList
            });
        }


    } catch (error) {
        throw new Error(error.code);
    }

}


export async function updateResume(data) {
    const { uid, education, experience, skills } = data;
    //console.log(data);
    try {

        const db = getFirestore(appFirebase);
        const user = doc(db, 'Users', uid);

        // Crear una colección llamada Resume en el documento del usuario si no existe
        const about = collection(user, 'Resume');

        // Crear un documento llamado Education en la colección Resume si no existe
        const educationDoc = doc(about, 'Education');
        // Crear un documento llamado Experience en la colección Resume si no existe
        const experienceDoc = doc(about, 'Experience');
        // Crear un documento llamado Skills en la colección Resume si no existe
        const skillsDoc = doc(about, 'Skills');

        if (education != undefined) {
            var dataEducation = await getDoc(educationDoc);
            dataEducation = dataEducation.data().Education;
            //console.log(dataEducation)
            // Transformar education en un array y guardar en el documento Education
            const educationArray = [];
            Object.keys(education).forEach(key => {
                const edu = education[key];
                if (edu.pais && edu.escuela && edu.estado && edu.fechaInicio && edu.fechaFin && edu.nombre) {
                    educationArray.push({
                        Country: edu.pais,
                        School: edu.escuela,
                        State: edu.estado,
                        YearStart: edu.fechaInicio,
                        YearEnd: edu.fechaFin,
                        Name: edu.nombre
                    });
                }
            });


            //console.log(educationArray);
            const mergedList = dataEducation.concat(educationArray);
            // Guardar el array en el documento Education
            await setDoc(educationDoc, {
                Education: mergedList
            });

        }

        if (experience != undefined) {
            var dataExperience = await getDoc(experienceDoc);
            dataExperience = dataExperience.data().Experience;
            //console.log(dataExperience)
            // Transformar experience en un array y guardar en el documento Experience
            const experienceArray = [];
            Object.keys(experience).forEach(key => {
                const exp = experience[key];
                if (exp.compañia && exp.fechaFin && exp.fechaInicio && exp.puesto) {
                    experienceArray.push({
                        Company: exp.compañia,
                        Start: exp.fechaInicio,
                        End: exp.fechaFin,
                        Name: exp.puesto
                    });
                }
            });

            //console.log(experienceArray);
            const mergedList = dataExperience.concat(experienceArray);

            // Guardar el array en el documento Experience
            await setDoc(experienceDoc, {
                Experience: mergedList
            });

        }

        if (skills != undefined) {
            var dataSkills = await getDoc(skillsDoc);
            dataSkills = dataSkills.data().Skills;
            // Transformar skills en un array y guardar en el documento Skills
            const skillsArray = [];
            Object.keys(skills).forEach(key => {
                const skill = skills[key];
                if (skill.nombre && skill.nivel) {
                    skillsArray.push({
                        Name: skill.nombre,
                        Value: skill.nivel
                    });
                }
            });

            //console.log(skillsArray);
            const mergedList = dataSkills.concat(skillsArray);

            // Guardar el array en el documento Skills
            await setDoc(skillsDoc, {
                Skills: mergedList
            });
        }


    } catch (error) {
        throw new Error(error.code);
    }


}



export async function deleteHobbie(uid, key) {
    try {
        const db = getFirestore(appFirebase);
        const user = doc(db, 'Users', uid);
        const about = collection(user, 'About');
        const hobbiesDoc = doc(about, 'Hobbies');

        const docSnap = await getDoc(hobbiesDoc);
        const hobbies = docSnap.data()
        var listHobbies = hobbies.Hobbies;
        listHobbies = listHobbies.filter(item => item.Key !== key);
        //console.log(listHobbies)
        await setDoc(hobbiesDoc, {
            Hobbies: listHobbies
        });
    } catch (error) {
        throw new Error(error.code);
    }

}

export async function deleteTestimonial(uid, id) {
    try {
        const db = getFirestore(appFirebase);
        const user = doc(db, 'Users', uid);
        const about = collection(user, 'About');
        const testimonialsDoc = doc(about, 'Testimonials');

        const docSnap = await getDoc(testimonialsDoc);
        const testimonials = docSnap.data()
        var listTestimonials = testimonials.Testimonials;
        listTestimonials = listTestimonials.filter(item => item.Name !== id);
        //console.log(listTestimonials)
        await setDoc(testimonialsDoc, {
            Testimonials: listTestimonials
        });
    } catch (error) {
        throw new Error(error.code);
    }

}


export async function deleteCertification(uid, id) {
    try {
        const db = getFirestore(appFirebase);
        const user = doc(db, 'Users', uid);
        const about = collection(user, 'About');
        const certificationsDoc = doc(about, 'Certifications');

        const docSnap = await getDoc(certificationsDoc);
        const certifications = docSnap.data()
        var listCertifications = certifications.Certifications;
        listCertifications = listCertifications.filter(item => item !== id);
        //console.log(listCertifications)
        await setDoc(certificationsDoc, {
            Certifications: listCertifications
        });
    } catch (error) {
        throw new Error(error.code);
    }

}

export async function deleteEducation(uid, id) {
    try {
        const db = getFirestore(appFirebase);
        const user = doc(db, 'Users', uid);
        const resume = collection(user, 'Resume');
        const educationDoc = doc(resume, 'Education');

        const docSnap = await getDoc(educationDoc);
        const education = docSnap.data()
        var listEducation = education.Education;
        listEducation = listEducation.filter(item => item.Name !== id);
        //console.log(listEducation)
        await setDoc(educationDoc, {
            Education: listEducation
        });
    } catch (error) {
        throw new Error(error.code);
    }

}