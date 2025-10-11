import chalk from 'chalk';
import mysql from 'mysql2/promise'; // Usar la versión 'promise' para async/await

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Un número razonable de conexiones
    queueLimit: 0
});

// Función para probar la conexión al inicio
async function testDbConnection() {
    try {
        await pool.getConnection();
        console.log(chalk.blue.bold('\u2714 MySQL Database Connection Successful!'));
    } catch (error) {
        console.error(chalk.red.bold('\n\u2718 Error connecting to MySQL Database:'), error.message);
        // Podrías decidir salir de la aplicación si la conexión a la DB falla
        process.exit(1); 
    }
}

// Llamar a la función al iniciar el módulo
testDbConnection(); 

// Exportar el pool de conexiones para usarlo en los servicios
export default pool;