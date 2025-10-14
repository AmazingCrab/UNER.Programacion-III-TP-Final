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

## Cerrar server por consola
- Linux: Si no cierra, entonces sudo fuser -k 3000/tcp
- Windows: netstat -ano | findstr :3000 + taskkill /PID "numero" /F

## API by Design

GET     /películas  Obtener la lista de películas

GET     /películas/:id  Buscar una película por su ID

POST    /películas  Crear una nueva película

PUT     /películas  Actualizar una película existente

DELETE  /películas  Eliminar una película existente

## Handling with "env"

You've hit on a common thought when dealing with configuration in Express. While making the environment variable env global might seem convenient, it's generally not recommended in Express applications for several reasons.

The way you currently access it, const env = req.app.get('env');, is the recommended Express pattern.

🛑 Why Global Access Isn't Recommended

1. Inside Request/Error Handlers (Your Current Method)

For any middleware or route handler, always use req.app.get('env').

2. Outside Request Handlers (In Core Modules)
Outside of an Express request cycle (e.g., your database connection module, logging setup, or an external service module)

const isProduction = process.env.NODE_ENV === 'production';

# ESTADO ACTUAL TERMINADO PERSONA 1

## Explicación del Flujo del Diagrama
El diagrama se divide en dos fases: Login (Ruta Pública) y Acceso Protegido (Rutas BREAD).

1. ### FASE 1: Flujo de LOGIN (POST /api/auth/login)
Browser/Bruno (Petición): Envía username y password.

2. ### app.js: La petición es recibida.
Pasa por todos los middlewares globales (morgan, helmet, cors, Body Parsers).

3. ### Ruta de Login:
El bloque de exclusión en app.js (if (req.path === '/auth/login')) permite que la petición pase directamente a auth.controller.js.

4. ### auth.controller.js:

-   Llama a user.service.js para buscar el usuario en la base de datos y verificar la contraseña (usando crypto).

-   Si es válido, usa jsonwebtoken para generar el token.

-   Usa roles.js para determinar el nombre legible del rol antes de enviarlo en la respuesta.

5. ### Respuesta:
El cliente recibe el JWT.

## Fase 2: Flujo de ACCESO PROTEGIDO (GET /api/v1/salones)

1. ### Browser/Bruno (Petición):
Envía el JWT en el Header Authorization: Bearer <token>.

2. ### app.js (Verificación):
El bloque de exclusión NO se activa, por lo que la petición es interceptada por verifyToken (dentro de auth.middleware.js).

3. ### auth.middleware.js (verifyToken):

-   Usa jsonwebtoken para decodificar el token con la clave secreta.

-   Si es válido, adjunta la información del payload (incluyendo el role) a req.user.

-   Si es inválido, detiene el flujo con un error 401 Unauthorized.

4. ### Ruta Protegida:
La petición llega al router de la Persona 2 (ej. salones.routes.js).

5. ### auth.middleware.js (authorize):
Se ejecuta la función authorize([ROLES.ADMIN]) en la ruta.

-   Compara el rol del usuario (req.user.role) con los roles requeridos, usando las constantes de roles.js.

-   Si el rol no coincide, detiene el flujo con un error 403 Forbidden.

6. ### Controlador de Negocio:
Si la autorización es exitosa, la petición llega a la lógica final (ej. salones.controller.js) para ejecutar el BREAD.

¡Con este mapa, el equipo tiene una visión clara de cómo se divide la responsabilidad en la API!

Ahora podemos iniciar con la Persona 2. ¿Comenzamos con la entidad Servicios?


## Como reutilizar el código de expres
- PRIMERO ver la tabla, xej,a activo en 1 se asigna automaticamente
- SEGUNDO TimeStamps lo mismo, por eso no se tiene en cuenta en los servicios para POST
- De la rama Ema en adelante se puede reutilizar la estructura.
- Para las rutas GET, crear primero el servicio(jquery)+controlador+router en ese orden
- Para POST/UPDATE/DELETE, tenemos que instalar express validator y el middlewar tabla.validator.js para validar los datos, luego servicio, controlador y router, en la ruta final, queda tb el validador
Ejemplo:
```js
router.post('/', 
    verifyToken, // login JWT
    authorize(writeRoles), // express validator
    createSalonValidation, // Middleware de validación de datos
    createSalon); // Controlador
```

## Una vez realizadas las rutas....
Tenemos que agregar apicache y notificar x mail