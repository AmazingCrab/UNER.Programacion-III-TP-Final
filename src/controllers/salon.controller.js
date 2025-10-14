
import * as salonService from '../services/salon.service.js';

export const getSalones = async (req, res, next) => {   // API/salones
    // tomamos los parametros de la consulta que vamos a exportar de servicios
    const limit = parseInt(req.query.limit) || 10; // Usar 10 como límite por defecto
    const offset = parseInt(req.query.offset) || 0;
    const order = req.query.order || 'titulo';
    // req.query.asc puede ser 'false' (string) o undefined. Si no es 'false', lo tratamos como true.
    const asc = (req.query.asc === 'false') ? false : true;


    // Validaciones básicas 
    if (limit < 1 || offset < 0) {
        const error = new Error('Los parámetros limit y offset deben ser valores positivos.');
        error.status = 400; // Bad Request
        return next(error);
    }
    try {
        // llamamos a la consulta
        const salones = await salonService.getAllSalones({ limit, offset, order, asc });

        res.status(200).json({
            status: 'success',
            count: salones.length, // Número de salones devueltos en esta página
            data: salones
        });

    } catch (error) {
        // Enviar cualquier error (DB, interno) al errorHandler central
        next(error);
    }
};

export const getSalon = async (req, res, next) => {
    
    // El ID se obtiene de req.params, NO de req.query (que es para la URL: ?key=value)
    const salonId = parseInt(req.params.id); 

    // Validamos la id con la url
    if (isNaN(salonId) || salonId <= 0) {
        // Usamos el patrón de error del proyecto (crear error y llamar a next)
        const error = new Error('ID de salón inválido. Debe ser un número positivo.');
        error.status = 400; 
        return next(error); 
    }

    try {
        // El servicio (getSalonById) ya se encarga de filtrar por activo = 1.
        const salon = await salonService.getSalonById(salonId); 
        // validamos que exista
        if (!salon) {
            // Si el salón no existe o no está activo, devolvemos 404
            const error = new Error(`Salón con ID ${salonId} no encontrado o inactivo.`);
            error.status = 404; 
            return next(error); 
        }
        res.status(200).json({
            status: 'success',
            data: salon
        });

    } catch (error) {
        // 5. Capturar y enviar errores del servicio/DB al errorHandler (500)
        next(error);
    }
};