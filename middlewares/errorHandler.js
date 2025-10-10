/**
 * Middleware de manejo de errores (500), se distingue por tener 4 argumentos.
 * Debe colocarse el último de todos los middlewares, después de las rutas y del 404.
 */
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Usar err.stack da info completa del error
    
    // Si la respuesta ya se ha enviado (cabeceras enviadas), pasamos al manejador de errores de Express
    if (res.headersSent) { // esto evita que si se enviaron cabeceras no se envien denuevo crasheando el server
        return next(err); 
    }

    const statusCode = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).send(`500 - ${message}`);
};
