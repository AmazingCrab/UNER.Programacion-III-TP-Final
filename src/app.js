import express from 'express';
import chalk from 'chalk';    // colores
import dotenv from 'dotenv';  // var de entorno
import cors from 'cors';      // dominios multiples y seguros
import compression from 'compression';  // compresion de datos
import morgan from 'morgan';  // logging HTTP

// Determina el archivo a cargar basado en NODE_ENV *-No mover-*
const envFile = process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development';
dotenv.config({ path: envFile });  // *-No mover-*

import pool from './config/db.js'; // Importar el pool de conexiones *-no mover-*
import authRouter from './routes/auth.routes.js'; // Importar Router de Auth

// IMPORTAR EL MIDDLEWARE DE VERIFICACIÓN DE JWT (verifyToken)
import { verifyToken } from './middlewares/auth.middleware.js'; 

import { notFound, errorHandler } from './middlewares/index.js'; // *-no mover-* const app = express(); // *-No mover-*

// Settings de aplicación
app.set('host', '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('app name', 'API Rest');
app.set('version', '1.0.0');

// Settings de desarrollo
app.set('env', process.env.NODE_ENV || 'development');

// ************************************************************
// MIDDLEWARES GLOBALES (Orden Lógico de Ejecución)
// ************************************************************
// 1. LOGGING
app.use(morgan('dev')); 
// 2. RENDIMIENTO
app.use(compression()); 
// 3. SEGURIDAD DE DOMINIOS
app.use(cors());        

// 4. BODY PARSERS - DEBEN IR ANTES DE CUALQUIER RUTA QUE USE req.body
app.use(express.json({ limit: '5mb' })); 
app.use(express.urlencoded({ extended: true, limit: '5mb' })) 

// ************************************************************
// ZONA DE RUTAS DE LA APLICACIÓN
// ************************************************************

// 1. RUTAS PÚBLICAS (Login/Register)
// Estas rutas no necesitan token y se ejecutan primero.
app.use('/api/auth', authRouter); 

// 2. MIDDLEWARE DE AUTENTICACIÓN (JWT Check)
// CUALQUIER RUTA DEFINIDA DESPUÉS DE ESTA LÍNEA REQUERIRÁ UN TOKEN VÁLIDO.
app.use(verifyToken); 

// 3. RUTAS PROTEGIDAS DE LA API (BREAD de Persona 2 - Ejemplo)
// A PARTIR DE AQUÍ SE ASUME QUE EL USUARIO ESTÁ AUTENTICADO (req.user existe)
// app.use('/api/salones', salonesRouter); 
// app.use('/api/reservas', reservasRouter); 


// Ejemplo de ruta de bienvenida
app.get("/", (req, res) => {
  const appName = app.get('app name');
  const version = app.get('version');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>${appName}</title></head>
      <body>
        <h1>${appName}</h1>
        <h2>Versión: ${version}</h2>
      </body>
    </html>
  `)
});
// Código ejemplo (Esta ruta ahora está protegida por verifyToken)
app.get("/:username/messages/:messageId", (req, res) => {
  console.log(req.params);
  res.end();
});


// ************************************************************
// MIDDLEWARES DE CIERRE (SIEMPRE AL FINAL)
// ************************************************************

app.use(notFound);    // Página personalizada de error 404
app.use(errorHandler);// Página personalizada de error 500

app.listen(app.get('port'), (error) => {

  if (error) {
    throw error;
  }
  console.log(chalk.green.italic(`\n\u2714 Server Express: V5.1.0 - ONLINE\n\n\u2714 IP:${app.get('host')}:${app.get('port')} - Mode: ${process.env.NODE_ENV}\n`));
});


