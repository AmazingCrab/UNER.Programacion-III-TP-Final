import { Router } from 'express';
import authRouter from './auth.routes.js'; // Rutas de Login/Auth
import salonRouter from './salon.routes.js'; // Importar el Router de Salones

const apiRouter = Router();

// ===============================================
// RUTAS MÓDULO AUTH
// Resultado: POST /api/auth/login
// ===============================================
apiRouter.use('/auth', authRouter);

// ===============================================
// RUTAS PROTEGIDAS DE ENTIDADES (Persona 2)
// El prefijo '/api' se define en app.js.
// Resultado: /api/salones, /api/servicios, etc.
// ===============================================
apiRouter.use('/salones', salonRouter); // Montar el router de Salones bajo '/salones'

// Ejemplo para futuras entidades
// import servicioRouter from './servicio.routes.js';
// apiRouter.use('/servicios', servicioRouter);

export default apiRouter;
