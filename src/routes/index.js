import { Router } from 'express';
import authRouter from './auth.routes.js'; // Rutas de Login/Auth

const apiRouter = Router();

// ===============================================
// RUTAS MÓDULO AUTH
// La ruta base para este router es '/api' (definida en app.js)
// El sub-camino para Auth es '/auth'
// Resultado: POST /api/auth/login
// ===============================================
apiRouter.use('/auth', authRouter);

// ===============================================
// RUTAS PROTEGIDAS (BREAD de Persona 2 - Ejemplos)
// apiRouter.use('/salones', salonesRouter);
// apiRouter.use('/servicios', serviciosRouter);
// ===============================================

export default apiRouter;