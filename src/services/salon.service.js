import pool from '../config/db.js';

/**
 * Obtiene todos los salones activos con opciones de paginación.
 * @param {number} limit - Máximo número de resultados a devolver.
 * @param {number} offset - Número de registros a saltar.
 * @returns {Promise<Array>} Lista de objetos de salones.
 */
export const getAllSalones = async ({ limit, offset, order = 'titulo', asc = true }) => {
    
    // 1. Validar y construir la cláusula ORDER BY
    // Para evitar inyección SQL en el nombre de la columna y la dirección (ASC/DESC), 
    // construimos esta parte de la query dinámicamente, asegurando que los valores sean seguros.
    
    const validOrderColumns = ['titulo', 'capacidad', 'importe']; 
    const orderByColumn = validOrderColumns.includes(order) ? order : 'titulo';
    const sortDirection = asc ? 'ASC' : 'DESC';

    // 2. Construir la consulta SQL final
    // Usamos string literals (backticks) para inyectar la columna y dirección
    // de forma segura (ya fueron validadas) y usamos placeholders (?) para LIMIT y OFFSET.
    const sql = `
        SELECT salon_id, titulo, direccion, latitud, longitud, capacidad, importe 
        FROM salones 
        WHERE activo = 1 
        ORDER BY ${orderByColumn} ${sortDirection} 
        LIMIT ? OFFSET ?
    `; 

    // 3. Parámetros para los Placeholders
    const params = [limit, offset]; 

    try {
        const [rows] = await pool.query(sql, params); 
        return rows; 
    } catch (error) {
        console.error('Error al obtener salones con paginación:', error);
        throw error;
    }
};
/**
 * Obtiene un salón activo por su ID (Read).
 * @param {number} salonId - El ID del salón a buscar.
 * @returns {Promise<object | null>} El objeto salón o null si no se encuentra.
 */
export const getSalonById = async (salonId) => {
    // La consulta busca por ID (?) Y activo = 1
    const sql = 'SELECT * FROM salones WHERE salon_id = ? AND activo = 1'; 
    const params = [salonId];

    try {
        const [rows] = await pool.query(sql, params); 
        return rows[0] || null; // Retorna el primer resultado o null
    } catch (error) {
        console.error(`Error al obtener salón con ID ${salonId}:`, error);
        throw error;
    }
};