# SCIFOLIO

Este proyecto es una API RESTful que permite la gestión de información personal y profesional para la plataforma SCIFOLIO. Está desarrollado utilizando Node.js, Express y Firebase para gestionar datos y autenticación.

## Requisitos
- Node.js
- Firebase
- Una cuenta de Gmail (para el servicio de correo)
- Variables de entorno configuradas

## Instalación
```bash
git clone https://github.com/williams/SCIFOLIOAPI.git

Navegar al directorio del proyecto:
cd SCIFOLIOAPI

### Instalar dependencias
npm install
```

## Configuración del Entorno
Configura las variables de entorno creando un archivo .env en el directorio raíz del proyecto con el siguiente contenido:
```bash
PORT=4000
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
EMAIL_GMAIL=your-email@gmail.com
PASSWORD_GMAIL=your-email-password
```
Guarda el archivo de configuración de Firebase Admin SDK como scifolio-firebase-adminsdk.json en el directorio raíz. Asegúrate de que tu archivo JSON siga el formato correcto:
```bash
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-client-email"
}
```

## Ejecución
Para iniciar la aplicación en modo de desarrollo, ejecuta:
```bash
npm run dev
```

## Contacto
Si tienes algún problema o pregunta, puedes contactarme en [williamschan72@gmail.com](mailto:williamschan72@gmail.com)

