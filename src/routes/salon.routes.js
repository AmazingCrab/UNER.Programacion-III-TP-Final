import { Router } from 'express';
import { getSalones, getSalon, createSalon, updateSalon } from '../controllers/salon.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import { createSalonValidation, updateSalonValidation } from '../middlewares/salon.validation.js'; // Importamos validación

const router = Router();

// Definimos los roles que tienen permiso de lectura (CLIENTE, EMPLEADO, ADMIN)
const readRoles = [
    ROLES.CLIENTE,
    ROLES.EMPLEADO,
    ROLES.ADMIN
];

// Roles con permiso de write/update/delete (Empleados y Admins)
const writeRoles = [
    ROLES.EMPLEADO,
    ROLES.ADMIN
];

// Aplicamos verifyToken (autenticación en W/U/D osea, POST-PUT-DEL)
// Aplicamos authorize (control de rol) a todas las rutas. 
//
// RUTAS DE ESCRITURA (POST /) - REQUIERE EMPLEADO O ADMIN ///////
//
// POST /api/salones
router.post('/', 
    verifyToken, 
    authorize(writeRoles), // Solo EMPLEADO y ADMIN
    createSalonValidation, // Middleware de validación de datos
    createSalon // Controlador
);
//
// PUT /api/salones/:id (Actualizar)
router.put('/:id', 
    verifyToken, 
    authorize(writeRoles), 
    updateSalonValidation, // ⬅️ Aplicamos la validación de actualización
    updateSalon
);
//
//////////////////////////////////////////////////////////////////////
//
// RUTAS DE ACCESO PÚBLICO (Lectura para todos los roles)
//
// GET /api/salones
router.get('/',
    verifyToken,
    authorize(readRoles),
    getSalones
);
//
// GET /api/salones/:id
router.get('/:id',
    verifyToken,
    authorize(readRoles),
    getSalon
);


export default router;