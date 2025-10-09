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

2. **Autenticación (JWT)**
   - Implementar login/autenticación de usuarios
   - Generación de tokens JWT
   - Manejo de sesiones

3. **Middleware de Autorización**
   - Middleware para verificar JWT
   - Control de autorización basado en roles
   - Protección de rutas

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

#### ✅ Tareas Detalladas:
1. **Selección de Entidad**
   - Elegir entidad para primera entrega (Salones, Servicios, o Turnos)

2. **Modelo/Servicio de Entidad**
   - Implementar lógica de servicio/modelo para la entidad elegida
   - Implementar soft-delete usando campo `activo`

3. **Rutas & Controlador de Entidad**
   - Implementar rutas y controlador para operaciones BREAD:
     - **Browse**: Listar elementos
     - **Read**: Obtener elemento específico
     - **Edit**: Actualizar elemento
     - **Add**: Crear nuevo elemento
     - **Delete**: Eliminar elemento (soft-delete)

4. **Validación**
   - Implementar validaciones de entrada para Add y Edit
   - Usar `express-validator`

5. **Documentación (Swagger)**
   - Documentar API con Swagger
   - Especificar rutas de la entidad elegida

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
