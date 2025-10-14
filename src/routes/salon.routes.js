import { Router } from 'express';
import { getSalones, getSalon } from '../controllers/salon.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';

const router = Router();

// Definimos los roles que tienen permiso de lectura (CLIENTE, EMPLEADO, ADMIN)
const readRoles = [
    ROLES.CLIENTE, 
    ROLES.EMPLEADO, 
    ROLES.ADMIN
];

// **********************************************************
// RUTAS DE ACCESO PÚBLICO (Lectura para todos los roles)
// **********************************************************

// Aplica verifyToken (autenticación) y authorize (control de rol) a todas las rutas.

// GET /api/salones
router.get('/', 
    verifyToken, 
    authorize(readRoles), 
    getSalones
);

// GET /api/salones/:id
router.get('/:id', 
    verifyToken, 
    authorize(readRoles), 
    getSalon
);


export default router;