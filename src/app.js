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

// IMPORTAMOS EL ROUTER CENTRAL DE LA API
import apiRouter from './routes/index.js'; // Contiene /auth, /salones, etc.

// IMPORTAR MIDDLEWARES DE SEGURIDAD Y CIERRE
import { verifyToken } from './middlewares/auth.middleware.js'; 
import { notFound, errorHandler } from './middlewares/index.js'; 

const app = express(); 

// ************************************************************
// CONFIGURACIÓN: USAR VARIABLES DE ENTORNO
// ************************************************************
// Settings de aplicación: Usar variables de entorno para HOST y PORT
app.set('host', process.env.HOST || '127.0.0.1');
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

// RUTA DE BIENVENIDA (Pública y fuera del prefijo /api)
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

// MIDDLEWARE DE AUTENTICACIÓN (JWT Check)
// ⚠️ CUALQUIER RUTA DEFINIDA DESPUÉS DE ESTA LÍNEA REQUERIRÁ UN TOKEN VÁLIDO.
// La única excepción es '/api/auth/login' que se maneja dentro del apiRouter.
app.use('/api', (req, res, next) => {
    // Excluir específicamente la ruta de login de la verificación del token
    // Si la ruta es '/api/auth/login', saltamos verifyToken
    if (req.path === '/auth/login' && req.method === 'POST') {
        return next();
    }
    // Para todas las demás rutas dentro de '/api', aplica la verificación
    verifyToken(req, res, next);
});


// RUTA CENTRAL DE LA API: Montamos el router central bajo el prefijo '/api'
// Esto incluye /api/auth, /api/salones, etc.
app.use('/api', apiRouter);


// ************************************************************
// MIDDLEWARES DE CIERRE (SIEMPRE AL FINAL)
// ************************************************************

app.use(notFound);    // Página personalizada de error 404
app.use(errorHandler);// Página personalizada de error 500

app.listen(app.get('port'), app.get('host'), (error) => {

  if (error) {
    throw error;
  }
  // El mensaje ahora muestra la IP y el puerto correctos del .env
  console.log(chalk.green.italic(`\n\u2714 Server Express: V5.1.0 - ONLINE\n\n\u2714 IP:${app.get('host')}:${app.get('port')} - Mode: ${process.env.NODE_ENV}\n`));
});