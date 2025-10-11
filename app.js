import express from 'express';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Determina el archivo a cargar basado en NODE_ENV *-No mover-*
const envFile = process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development';
// NUEVO: Carga las variables de entorno *-No mover-*
dotenv.config({ path: envFile }); // 

import pool from './config/db.js'; // Importar el pool de conexiones

import { notFound, errorHandler } from './middlewares/index.js'; 

const app = express();

// Settings de aplicación
app.set('host', '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('app name', 'API Rest');
app.set('version', '1.0.0');

// Settings de desarrollo
app.set('env', process.env.NODE_ENV || 'development');

// Middlewares
app.use(express.json({ limit: '5mb' })); // 5mb previene ataques DoS 
app.use(express.urlencoded({ extended: true, limit: '5mb' })) // para recibir info de

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
// Matches both /message and /messages
//"/message{s}"
// codigo ejemplo
app.get("/:username/messages/:messageId", (req, res) => {
  console.log(req.params);
  res.end(); //  * { username: "odin", messageId: "79687378" }
});






app.use(notFound);    // Página personalizada de error 404
app.use(errorHandler);// Página personalizada de error 500

app.listen(app.get('port'), (error) => {

  if (error) {
    throw error;
  }
  console.log(chalk.green.italic(`\n\u2714 Server Express: V5.1.0 - ONLINE\n\n\u2714 IP:${app.get('host')}:${app.get('port')} - Mode: ${process.env.NODE_ENV}\n`));
});



