# 🚀 División de Trabajo - Primera Entrega (BREAD API)

## 📋 Objetivo
Implementar operaciones BREAD (Browse, Read, Edit, Add, Delete) completas para una entidad de la API, incluyendo autenticación, autorización y validación.

---

## 👥 División de Trabajo para 2 Personas

### **Persona 1: Backend Core & Security**
**Enfoque:** Configuración técnica fundamental, autenticación, autorización y utilidades core.

#### ✅ Tareas Detalladas:
1. **Configuración del Proyecto (Express & MySQL)**
   - Inicializar proyecto Express
   - Establecer conexión a base de datos MySQL
   - Configurar variables de entorno

2. **Registro de Logs + Compresion + Cors** (Respetando el orden)
   - morgan - > buenas prácticas
   - Compresión -> optimiza rendimiento
   - CORS - > Permite operar de manera segura con los dominios y tener mas de uno

3. **Body Parsers	express.json express.urlencoded**
	- Análisis de la petición.
   - Necesario para leer el JSON enviado en las peticiones POST/PUT/PATCH.

4. **Autenticación (JWT)**
   - Implementar login/autenticación de usuarios
   - Generación de tokens JWT
   - Manejo de sesiones

5. **Middleware de Autorización**
   - Middleware para verificar JWT
   - Control de autorización basado en roles
   - Protección de rutas

6. **API Cache**
	Apicache	-> Debe ir aquí para que el caching se aplique a los endpoints que siguen, pero solo en rutas públicas de solo lectura (ej. /salones, /servicios).
   (no en login o register)

4. **Manejo de Errores**
   - Estructura para manejo de errores
   - Respuestas HTTP apropiadas
   - Logging de errores

5. **Modelo/Servicio de Usuario**
   - Servicio/modelo para interactuar con tabla `usuarios`
   - Funciones para autenticación

---

### **Persona 2: Entity BREAD & Utilities**
**Enfoque:** Implementación de operaciones CRUD completas para la entidad elegida.

#### Este es el archivo de tareas detalladas en formato Markdown para la **Persona 2**, enfocado en la implementación de las operaciones BREAD (CRUD) para la primera entrega del proyecto.

---

# 🧑‍💻 Persona 2: Tareas para la Primera Entrega (BREAD, Validación y Documentación)

## 🎯 Enfoque Principal
Implementar las operaciones BREAD (**Browse, Read, Edit, Add, Delete**) completas para la entidad **Salones**, **Servicios** o **Turnos** (a elegir), respetando la arquitectura de capas, utilizando la seguridad provista por la Persona 1, e incluyendo la validación y documentación de la API[cite: 38, 43].

---

## 🛠️ Tareas Detalladas

### I. Lógica de Persistencia y Soft Delete
Esta etapa define cómo se interactúa con la base de datos (MySQL).

1.  [cite_start]**Creación del Servicio/Modelo:** Crear el archivo de servicio (ej. `src/services/salones.service.js`) que contendrá la lógica pura para interactuar con la tabla de la base de datos[cite: 76].
2.  **Implementación BREAD - Lectura:** Desarrollar las funciones de servicio para:
    * **Listar (Browse):** Obtener todos los registros de la entidad.
    * **Leer (Read):** Obtener un registro específico por su ID.
3.  **Implementación BREAD - Escritura:** Desarrollar las funciones de servicio para:
    * **Crear (Add):** Insertar un nuevo registro.
    * **Actualizar (Edit):** Modificar un registro existente.
4.  [cite_start]**Implementación Soft Delete:** En el método de "eliminación", asegurar que solo se actualice el campo **`activo`** de la tabla a `0`, en lugar de borrar el registro físicamente[cite: 84].

---

### II. Controladores, Rutas y Validación

Esta etapa define la interfaz de la API y garantiza la calidad de los datos de entrada.

1.  **Definición del Controlador:** Crear el controlador (ej. `src/controllers/salones.controller.js`) que:
    * Maneja la petición (`req`) y la respuesta (`res`).
    * Llama a los métodos de la Capa de Servicios (Tarea I).
2.  [cite_start]**Definición de Rutas REST:** Crear el archivo de rutas (ej. `src/routes/salones.routes.js`) para mapear los verbos HTTP a las funciones del controlador[cite: 8].
    * Ejemplos: `GET /api/salones`, `POST /api/salones`, `PUT /api/salones/:id`, `DELETE /api/salones/:id`.
3.  [cite_start]**Validación con `express-validator`:** Implementar middleware de validación para las rutas **`POST`** y **`PUT/PATCH`**[cite: 79].
    * Verificar la existencia, tipo de dato (ej. numérico) y longitud de los campos necesarios (ej. `titulo`, `importe`, `capacidad`).
4.  [cite_start]**Manejo de Errores en Rutas:** Asegurar que los controladores capturen los errores (ej. registro no encontrado, error de validación) y usen `return next(error)` para delegar el manejo de la respuesta HTTP a la capa de `errorHandler` central[cite: 77].

---

### III. Integración de Seguridad y Documentación

Esta etapa integra el trabajo con la Persona 1 y cumple con los requisitos de documentación.

1.  **Integración de Autorización (Dependencia de P1):**
    * [cite_start]Una vez recibido el middleware de autenticación (JWT) y autorización por roles (Persona 1), aplicarlo a las rutas protegidas[cite: 73, 74].
    * [cite_start]Aplicar restricciones de rol específicas: Por ejemplo, permitir **Listar** a **Clientes/Empleados/Admin**, pero restringir **Crear/Editar/Eliminar** solo a **Empleados** o **Administradores**[cite: 60, 68].
2.  **Documentación con Swagger:**
    * Documentar detalladamente los *endpoints* BREAD de la entidad implementada.
    * [cite_start]Incluir el esquema de datos de entrada/salida y describir los códigos de respuesta HTTP esperados (200, 201, 400, 401, 403)[cite: 78].

---

## 📅 Hito de Entrega (09/10/2025)

El resultado final debe ser una API que:
* Funciona correctamente al ser probada con Bruno/Postman.
* Devuelve errores 401/403 cuando no se cumplen las reglas de autorización.
* [cite_start]Utiliza el soft delete en lugar de la eliminación física[cite: 38, 84].
* Está validada y documentada con Swagger.

---

## 🛠️ Consideraciones Técnicas Clave

### **Estrategia Git**
- Usar **Git Flow** o **Feature Branching**
- Trabajar en ramas separadas:
  - `feat/auth-jwt` (Persona 1)
  - `feat/bread-[entidad]` (Persona 2)
- Merge a `main` o `develop` solo después de testing y review

### **Dependencias**
- La implementación BREAD de la Persona 2 **depende** del Middleware de Autorización de la Persona 1
- La Persona 1 debe priorizar la configuración core y lógica de autorización primero

### **Base de Datos**
- Enfocarse en crear servicios/repositorios para interactuar con las tablas
- Usar ORM o consultas SQL simples
- Respetar la estructura de BD proporcionada

---

## 🔄 Flujo de Trabajo Recomendado

1. **Persona 1** comienza con configuración core y auth
2. **Persona 2** selecciona entidad y planifica implementación
3. **Persona 1** entrega middleware de autorización
4. **Persona 2** implementa BREAD usando la autorización
5. **Integración** y testing conjunto
6. **Documentación** final y preparación de entrega

---

## 📦 Entregables Esperados

- ✅ API funcional con autenticación JWT
- ✅ Operaciones BREAD completas para una entidad
- ✅ Autorización por roles
- ✅ Validaciones de entrada
- ✅ Documentación Swagger básica
- ✅ Soft-delete implementado
- ✅ Manejo de errores robusto


