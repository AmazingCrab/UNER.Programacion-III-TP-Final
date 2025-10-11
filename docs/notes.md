## Debug
1. 
```bash
console: node debug
```
2. 
```chrome
chrome://inspect
```
3. ir a Open dedicated DevTools for Node
4. Colocar breakpoints

# Cerrar server por consola
- Linux: Si no cierra, entonces sudo fuser -k 3000/tcp
- Windows: netstat -ano | findstr :3000 + taskkill /PID "numero" /F

# API by Design

GET     /películas  Obtener la lista de películas

GET     /películas/:id  Buscar una película por su ID

POST    /películas  Crear una nueva película

PUT     /películas  Actualizar una película existente

DELETE  /películas  Eliminar una película existente

# Handling with "env"

You've hit on a common thought when dealing with configuration in Express. While making the environment variable env global might seem convenient, it's generally not recommended in Express applications for several reasons.

The way you currently access it, const env = req.app.get('env');, is the recommended Express pattern.

🛑 Why Global Access Isn't Recommended

1. Inside Request/Error Handlers (Your Current Method)

For any middleware or route handler, always use req.app.get('env').

2. Outside Request Handlers (In Core Modules)
Outside of an Express request cycle (e.g., your database connection module, logging setup, or an external service module)

const isProduction = process.env.NODE_ENV === 'production';