import jwt from 'jsonwebtoken';
import { getUserByUsername, verifyPassword } from '../services/user.service.js';
import { ROLES } from '../config/roles.js';

// ... (generateToken function) ...

/**
 * Controlador para la ruta POST /api/auth/login
 */
export const login = async (req, res, next) => {
    const { username, password } = req.body;

    // **********************************************************
    // 1. COMPROBACIÓN INICIAL (400 Bad Request)
    // **********************************************************
    if (!username || !password) {
        const error = new Error('Faltan credenciales (usuario o contraseña).'); // ✅ CREAR Error con un mensaje
        error.status = 400; // Asigna el N° de error 
        return next(error); // va al handler
    }

    try {
        // 2. Buscar usuario
        const user = await getUserByUsername(username);

        // 3. Verificar usuario y contraseña en una sola condición (401 Unauthorized)
        const isPasswordValid = user && verifyPassword(password, user.contrasenia);
        
        // Si NO hay usuario O la contraseña es inválida:
        if (!isPasswordValid) {
            const error = new Error('Credenciales inválidas.'); // CREAR Error con un mensaje
            error.status = 401; // Asigna el N° de error 
            return next(error); // va al handler
        }

        // 4. Generar Token
        const token = generateToken(user);

        // Determinar el nombre del rol para la respuesta
        const roleName = Object.keys(ROLES).find(key => ROLES[key] === user.tipo_usuario);

        // 5. Respuesta exitosa con Token
        res.status(200).json({
            status: 'success',
            message: 'Autenticación exitosa',
            token: token,
            user: {
                id: user.usuario_id,
                username: user.nombre_usuario,
                role: roleName
            }
        });

    } catch (error) {
        // Los errores de base de datos o internos son atrapados aquí y enviados al errorHandler.
        next(error);
    }
};