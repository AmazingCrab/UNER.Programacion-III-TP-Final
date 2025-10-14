
import * as salonService from '../services/salon.service.js';
import { validationResult } from 'express-validator';   // validamos para crear

export const getSalones = async (req, res, next) => {   // GET API/salones
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

export const getSalon = async (req, res, next) => {     // GET API/salones/:id
    
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

// Crea un nuevo salón y aplica validación.
export const createSalon = async (req, res, next) => {    // POST API/salones:id
    
    // Validación desde express-validator
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Si hay errores, retornar 400 Bad Request
        const error = new Error('Error de validación en los datos del salón.');
        error.status = 400; // Bad Request
        // Adjuntamos los detalles del error para el cliente
        error.details = errors.array(); 
        return next(error);
    }

    try {
        //  Extraer los datos limpios del body 
        // IMPORTANTE:si fuera de la direccion entonces seria req.query
        const salonData = req.body;
        
        // Llamamos al servicio para crear el salón
        const newSalonId = await salonService.createSalon(salonData);

        // Enviamos la respuesta exitosa (201 Created)
        res.status(201).json({
            status: 'success',
            message: 'Salón creado exitosamente',
            salonId: newSalonId,
            data: { ...salonData, salon_id: newSalonId }
        });

    } catch (error) {
        // Capturamos y enviar errores del servicio/DB al errorHandler (500)
        next(error);
    }
};
// Update con validación también
export const updateSalon = async (req, res, next) => {  // PUT API/salones:id
    // Obtener ID de req.params
    const salonId = parseInt(req.params.id);

    // Validación de ID (similar a getSalon)
    if (isNaN(salonId) || salonId <= 0) {
        const error = new Error('ID de salón inválido. Debe ser un número positivo.');
        error.status = 400; // Bad Request
        return next(error);
    }
    
    // Manejo de errores de la validación de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Error de validación en los datos de actualización.');
        error.status = 400; 
        error.details = errors.array(); 
        return next(error);
    }
    
    // Verificamos que el body no esté vacío (al menos 1 campo para actualizar)
    if (Object.keys(req.body).length === 0) {
        const error = new Error('No se proporcionaron datos para actualizar.');
        error.status = 400; 
        return next(error);
    }

    try {
        // Llamamos al servicio
        const affectedRows = await salonService.updateSalon(salonId, req.body);
        
        // Manejo de 404
        if (affectedRows === 0) {
            // Esto ocurre si el ID no existe
            const error = new Error(`No se encontró o no se pudo actualizar el salón con ID ${salonId}.`);
            error.status = 404;
            return next(error);
        }

        // 7. Respuesta exitosa (200 OK)
        res.status(200).json({
            status: 'success',
            message: `Salón con ID ${salonId} actualizado exitosamente.`,
        });

    } catch (error) {
        next(error);
    }
};
// Delete con validación también
export const deleteSalon = async (req, res, next) => {
    
    // Obtener y validar ID (similar a getSalon y updateSalon)
    const salonId = parseInt(req.params.id); 

    if (isNaN(salonId) || salonId <= 0) {
        const error = new Error('ID de salón inválido. Debe ser un número positivo.');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        // Llamamos al servicio
        // affectedRows será 1 si el salón estaba activo y se desactivó, 0 si no existía o ya estaba inactivo.
        const affectedRows = await salonService.deleteSalon(salonId); 

        // Manejo de 404
        if (affectedRows === 0) {
            // El salón no se encontró (o ya estaba inactivo)
            const error = new Error(`No se encontró un salón activo con ID ${salonId} para desactivar.`);
            error.status = 404;
            return next(error);
        }

        // Respuesta exitosa (200 OK)
        res.status(200).json({
            status: 'success',
            message: `Salón con ID ${salonId} desactivado (soft delete) exitosamente.`,
        });

    } catch (error) {
        // Capturar y enviar errores del servicio/DB al errorHandler (500)
        next(error);
    }
};