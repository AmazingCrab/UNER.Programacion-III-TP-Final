import pool from '../config/db.js';

/**
 * Obtenemos los salones activos con las opciones de paginación.
 * @param {number} limit - Máximo número de resultados a devolver.
 * @param {number} offset - Número de registros a saltar.
 * @returns {Promise<Array>} Lista de objetos de salones.
 */
export const getAllSalones = async ({ limit, offset, order = 'titulo', asc = true }) => {
    
    // Validamos y construir la cláusula ORDER BY
    // Para evitar inyección SQL no dejamos valores "null".
    const validOrderColumns = ['titulo', 'capacidad', 'importe']; 
    const orderByColumn = validOrderColumns.includes(order) ? order : 'titulo';
    const sortDirection = asc ? 'ASC' : 'DESC';

    // 2. Construimos la consulta SQL final (se debe pensar antes de empezar)
    // de forma segura (ya fueron validadas) y usamos placeholders (?) para LIMIT y OFFSET.
    const sql = `
        SELECT salon_id, titulo, direccion, latitud, longitud, capacidad, importe 
        FROM salones 
        WHERE activo = 1 
        ORDER BY ${orderByColumn} ${sortDirection} 
        LIMIT ? OFFSET ?
    `; 

    // Parámetros para los Placeholders
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

/**
 * Crea un nuevo salón en la base de datos (Add).
 * @param {object} salonData - Objeto con los datos del nuevo salón.
 * @returns {Promise<number>} El ID del salón recién creado.
 */
export const createSalon = async (salonData) => {
    // En la consulta SQL definimos los campos a insertar y usamos placeholders para los valores.
    const sql = `
        INSERT INTO salones 
        (titulo, direccion, latitud, longitud, capacidad, importe)
        VALUES (?, ?, ?, ?, ?, ?)
    `; 

    // OJO, creamos un array de valores en el ORDEN de los placeholders.
    const params = [
        salonData.titulo,
        salonData.direccion,
        salonData.latitud || null, // Si es opcional y no viene, insertamos NULL
        salonData.longitud || null, 
        salonData.capacidad || null, 
        salonData.importe
    ];

    try {
        // Realizamos la consulta
        // El resultado de un INSERT es [metadata, fields], donde metadata.insertId es el ID generado.
        const [result] = await pool.query(sql, params); 
        
        // Retornar el ID del nuevo salón
        return result.insertId; 
    } catch (error) {
        console.error('Error al crear salón:', error);
        throw error;
    }
};

/**
 * Actualiza un salón por su ID.
 * @param {number} salonId - El ID del salón a actualizar.
 * @param {object} salonData - Objeto con los campos a modificar.
 * @returns {Promise<number>} El número de filas afectadas (0 o 1).
 */
export const updateSalon = async (salonId, salonData) => {
    
    // Lista de columnas que pueden ser actualizadas
    const updatableColumns = ['titulo', 'direccion', 'latitud', 'longitud', 'capacidad', 'importe', 'activo'];
    
    // Creamos dinámicamente el array de los campos a actualizar
    const updates = {};
    for (const key of updatableColumns) {
        if (salonData.hasOwnProperty(key)) {
            updates[key] = salonData[key];
        }
    }
    
    // Si no hay campos para actualizar, retornamos 0
    const keys = Object.keys(updates);
    if (keys.length === 0) {
        return 0;
    }

    // Construimos dinámicamente la cláusula SET: "titulo" = ?, "direccion" = ?, ..."
    const setClauses = keys.map(key => `${key} = ?`).join(', ');
    
    // Consulta SQL final
    const sql = `
        UPDATE salones
        SET ${setClauses}
        WHERE salon_id = ?
    `;
    
    // Array de parámetros: valores de los campos + ID para el WHERE
    const params = [...Object.values(updates), salonId];
    
    try {
        // Ejecutar la consulta. result.affectedRows es el número de filas modificadas.
        const [result] = await pool.query(sql, params);
        return result.affectedRows; 
    } catch (error) {
        console.error(`Error al actualizar salón con ID ${salonId}:`, error);
        throw error;
    }
};