# 📡 DOCUMENTACIÓN DE ENDPOINTS PARA BACKEND MYSQL

> **Proyecto:** GA7-220501096-AA4-EV03  
> **Fecha:** Enero 2025  
> **De:** Frontend React Team  
> **Para:** Backend Spring Boot + MySQL Team  

---

## 📋 TABLA DE ENDPOINTS - CHECKLIST COMPLETO

### 🔐 AUTENTICACIÓN

| Endpoint | Método | Body Ejemplo | Response Esperado | Estado |
|----------|--------|--------------|-------------------|--------|
| `/api/auth/login` | POST | `{"email":"admin@clinica.com","password":"admin123"}` | `{"token":"jwt-token-here","rol":"ADMIN"}` | ✅ IMPLEMENTADO |

---

### 🐾 MASCOTAS

| Endpoint | Método | Body Ejemplo | Response Esperado | Estado |
|----------|--------|--------------|-------------------|--------|
| `/api/mascotas/mias` | GET | N/A (requiere token) | `[{"idMascota":1,"nombre":"Max","especie":"Perro","raza":"Golden","edad":3,"peso":25.5,"color":"Dorado","sexo":"M","estado":"Activo"}]` | ✅ IMPLEMENTADO |
| `/api/mascotas/cliente/{id}` | GET | N/A (requiere token) | `[{...misma estructura...}]` | ⚠️ PENDIENTE VERIFICAR |

---

### 📅 CITAS

| Endpoint | Método | Body Ejemplo | Response Esperado | Estado |
|----------|--------|--------------|-------------------|--------|
| `/api/citas` | GET | N/A (requiere token) | `[{"id":1,"fechaCita":"2025-01-20","horaCita":"10:00:00","motivo":"Consulta general","estadoCita":"Programada","idMascota":1,"idVeterinario":2,"duracionMinutos":30}]` | ✅ IMPLEMENTADO |
| `/api/citas` | POST | `{"idMascota":1,"idVeterinario":2,"fechaCita":"2025-01-25","horaCita":"14:00:00","duracionMinutos":30,"motivo":"Vacunación anual","observaciones":"Primera dosis","estadoCita":"Programada"}` | `{"id":10,"mensaje":"Cita creada exitosamente"}` | ✅ IMPLEMENTADO |
| `/api/citas/hoy` | GET | N/A (requiere token) | `[{...misma estructura que /api/citas...}]` | ✅ IMPLEMENTADO |
| `/api/citas/{id}/estado` | PUT | `{"estado":"Completada"}` | `{"mensaje":"Estado actualizado"}` | ✅ IMPLEMENTADO |

---

### 📋 HISTORIAS CLÍNICAS

| Endpoint | Método | Body Ejemplo | Response Esperado | Estado |
|----------|--------|--------------|-------------------|--------|
| `/api/historias/mascota/{idMascota}/completo` | GET | N/A (requiere token) | `{"idHistoria":1,"idMascota":1,"nombreMascota":"Max","fechaCreacion":"2024-01-15","totalEntradas":5,"entradas":[{"idEntrada":1,"fecha":"2025-01-10","descripcion":"Control rutinario","observaciones":"Todo normal","pesoActual":25.5,"temperatura":38.5,"frecuenciaCardiaca":90,"nombreVeterinario":"Dra. Ana"}]}` | ✅ IMPLEMENTADO |
| `/api/historias/mascota/{idMascota}` | GET | N/A (requiere token) | `{"idHistoria":1,"idMascota":1,"fechaCreacion":"2024-01-15"}` | ✅ IMPLEMENTADO |
| `/api/historias/{idHistoria}/entrada` | POST | `{"descripcion":"Consulta por vómitos","observaciones":"Prescribir dieta blanda","pesoActual":24.8,"temperatura":39.2,"frecuenciaCardiaca":95}` | `{"idEntrada":15,"mensaje":"Entrada agregada"}` | ✅ IMPLEMENTADO |

---

### 👥 USUARIOS (ADMIN)

| Endpoint | Método | Body Ejemplo | Response Esperado | Estado |
|----------|--------|--------------|-------------------|--------|
| `/api/usuarios` | GET | N/A (requiere token ADMIN) | `[{"id":1,"email":"admin@clinica.com","nombre":"Administrador","rol":"ADMIN","activo":true}]` | ✅ IMPLEMENTADO |
| `/api/usuarios/{id}/estado` | PUT | `{"activo":false}` | `{"mensaje":"Usuario desactivado"}` | ✅ IMPLEMENTADO |
| `/api/usuarios/veterinarios/activos` | GET | N/A (público) | `[{"id":2,"nombre":"Dra. Ana García","email":"ana@clinica.com","rol":"VETERINARIO","activo":true,"idVeterinario":2}]` | ✅ IMPLEMENTADO |

---

### 📊 MÉTRICAS (ADMIN)

| Endpoint | Método | Body Ejemplo | Response Esperado | Estado |
|----------|--------|--------------|-------------------|--------|
| `/api/admin/metricas` | GET | N/A (requiere token ADMIN) | `{"citasMes":45,"mascotasActivas":120,"productosMinimos":8}` | ✅ IMPLEMENTADO |

---

## 🔧 ESPECIFICACIÓN OPENAPI 3.0

```yaml
openapi: 3.0.3
info:
  title: API Clínica Veterinaria
  description: Backend para gestión de citas, mascotas e historias clínicas
  version: 1.0.0
  contact:
    name: Equipo de Desarrollo
    email: dev@clinicaveterinaria.com

servers:
  - url: http://localhost:8080/api
    description: Servidor de desarrollo
  - url: https://produccion.clinicaveterinaria.com/api
    description: Servidor de producción

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    LoginRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          example: admin@clinica.com
        password:
          type: string
          format: password
          example: admin123

    LoginResponse:
      type: object
      properties:
        token:
          type: string
          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        rol:
          type: string
          enum: [ADMIN, VETERINARIO, RECEPCIONISTA, CLIENTE]
          example: ADMIN

    Mascota:
      type: object
      properties:
        idMascota:
          type: integer
          example: 1
        nombre:
          type: string
          example: Max
        especie:
          type: string
          example: Perro
        raza:
          type: string
          example: Golden Retriever
        edad:
          type: integer
          example: 3
        peso:
          type: number
          format: double
          example: 25.5
        color:
          type: string
          example: Dorado
        sexo:
          type: string
          enum: [M, F]
          example: M
        estado:
          type: string
          example: Activo

    Cita:
      type: object
      properties:
        id:
          type: integer
          example: 1
        fechaCita:
          type: string
          format: date
          example: "2025-01-25"
        horaCita:
          type: string
          format: time
          example: "14:00:00"
        motivo:
          type: string
          example: Vacunación anual
        estadoCita:
          type: string
          enum: [Programada, En curso, Completada, Cancelada]
          example: Programada
        idMascota:
          type: integer
          example: 1
        idVeterinario:
          type: integer
          example: 2
        duracionMinutos:
          type: integer
          example: 30
        observaciones:
          type: string
          example: Primera dosis

    CrearCitaRequest:
      type: object
      required:
        - idMascota
        - idVeterinario
        - fechaCita
        - horaCita
        - duracionMinutos
        - motivo
        - estadoCita
      properties:
        idMascota:
          type: integer
          example: 1
        idVeterinario:
          type: integer
          example: 2
        fechaCita:
          type: string
          format: date
          example: "2025-01-25"
        horaCita:
          type: string
          format: time
          example: "14:00:00"
        duracionMinutos:
          type: integer
          minimum: 15
          maximum: 120
          example: 30
        motivo:
          type: string
          minLength: 10
          example: Vacunación anual
        observaciones:
          type: string
          example: Primera dosis
        estadoCita:
          type: string
          enum: [Programada]
          example: Programada

    HistorialCompleto:
      type: object
      properties:
        idHistoria:
          type: integer
          example: 1
        idMascota:
          type: integer
          example: 1
        nombreMascota:
          type: string
          example: Max
        fechaCreacion:
          type: string
          format: date
          example: "2024-01-15"
        totalEntradas:
          type: integer
          example: 5
        entradas:
          type: array
          items:
            $ref: '#/components/schemas/EntradaHistoria'

    EntradaHistoria:
      type: object
      properties:
        idEntrada:
          type: integer
          example: 1
        fecha:
          type: string
          format: date-time
          example: "2025-01-10T10:30:00"
        descripcion:
          type: string
          example: Control rutinario
        observaciones:
          type: string
          example: Todo normal
        pesoActual:
          type: number
          format: double
          example: 25.5
        temperatura:
          type: number
          format: double
          example: 38.5
        frecuenciaCardiaca:
          type: integer
          example: 90
        nombreVeterinario:
          type: string
          example: Dra. Ana García

    CrearEntradaRequest:
      type: object
      required:
        - descripcion
      properties:
        descripcion:
          type: string
          minLength: 10
          example: Consulta por vómitos
        observaciones:
          type: string
          example: Prescribir dieta blanda
        pesoActual:
          type: number
          format: double
          example: 24.8
        temperatura:
          type: number
          format: double
          example: 39.2
        frecuenciaCardiaca:
          type: integer
          example: 95

    Usuario:
      type: object
      properties:
        id:
          type: integer
          example: 1
        email:
          type: string
          format: email
          example: admin@clinica.com
        nombre:
          type: string
          example: Administrador
        rol:
          type: string
          enum: [ADMIN, VETERINARIO, RECEPCIONISTA, CLIENTE]
          example: ADMIN
        activo:
          type: boolean
          example: true

    Metricas:
      type: object
      properties:
        citasMes:
          type: integer
          example: 45
        mascotasActivas:
          type: integer
          example: 120
        productosMinimos:
          type: integer
          example: 8

paths:
  /auth/login:
    post:
      tags:
        - Autenticación
      summary: Iniciar sesión
      description: Autentica a un usuario y devuelve un token JWT
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Login exitoso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '401':
          description: Credenciales incorrectas
        '400':
          description: Datos inválidos

  /mascotas/mias:
    get:
      tags:
        - Mascotas
      summary: Obtener mis mascotas
      description: Retorna todas las mascotas del cliente autenticado
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Lista de mascotas
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Mascota'
        '401':
          description: No autenticado

  /mascotas/cliente/{id}:
    get:
      tags:
        - Mascotas
      summary: Obtener mascotas de un cliente
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Lista de mascotas del cliente
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Mascota'

  /citas:
    get:
      tags:
        - Citas
      summary: Obtener todas las citas
      description: Retorna las citas según el rol del usuario
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Lista de citas
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Cita'

    post:
      tags:
        - Citas
      summary: Crear nueva cita
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CrearCitaRequest'
      responses:
        '201':
          description: Cita creada exitosamente
        '400':
          description: Datos inválidos o mascota no pertenece al cliente
        '401':
          description: No autenticado

  /citas/hoy:
    get:
      tags:
        - Citas
      summary: Obtener citas de hoy
      description: Retorna las citas del día actual del veterinario autenticado
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Lista de citas de hoy
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Cita'

  /citas/{id}/estado:
    put:
      tags:
        - Citas
      summary: Actualizar estado de cita
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                estado:
                  type: string
                  enum: [Programada, En curso, Completada, Cancelada]
      responses:
        '200':
          description: Estado actualizado

  /historias/mascota/{idMascota}/completo:
    get:
      tags:
        - Historias
      summary: Obtener historial completo
      description: Retorna el historial completo con todas las entradas médicas
      security:
        - bearerAuth: []
      parameters:
        - name: idMascota
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Historial completo
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistorialCompleto'
        '403':
          description: No tienes permiso para ver esta historia
        '404':
          description: Mascota no encontrada

  /historias/mascota/{idMascota}:
    get:
      tags:
        - Historias
      summary: Obtener historia básica
      security:
        - bearerAuth: []
      parameters:
        - name: idMascota
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Historia básica
          content:
            application/json:
              schema:
                type: object
                properties:
                  idHistoria:
                    type: integer
                  idMascota:
                    type: integer
                  fechaCreacion:
                    type: string
                    format: date

  /historias/{idHistoria}/entrada:
    post:
      tags:
        - Historias
      summary: Agregar entrada médica
      description: Agrega una nueva entrada al historial clínico
      security:
        - bearerAuth: []
      parameters:
        - name: idHistoria
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CrearEntradaRequest'
      responses:
        '201':
          description: Entrada agregada exitosamente
        '400':
          description: Datos inválidos

  /usuarios:
    get:
      tags:
        - Usuarios
      summary: Listar todos los usuarios
      description: Solo para ADMIN
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Lista de usuarios
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Usuario'
        '403':
          description: No autorizado

  /usuarios/{id}/estado:
    put:
      tags:
        - Usuarios
      summary: Cambiar estado de usuario
      description: Activar/desactivar usuario (solo ADMIN)
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                activo:
                  type: boolean
      responses:
        '200':
          description: Estado actualizado

  /usuarios/veterinarios/activos:
    get:
      tags:
        - Usuarios
      summary: Listar veterinarios activos
      description: Endpoint público para agendar citas
      responses:
        '200':
          description: Lista de veterinarios
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Usuario'

  /admin/metricas:
    get:
      tags:
        - Admin
      summary: Obtener métricas del dashboard
      description: Solo para ADMIN
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Métricas del sistema
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Metricas'
```

---

## ⚙️ NUEVAS FUNCIONALIDADES REQUERIDAS

### 🆕 Endpoints que el frontend NECESITA pero NO existen aún:

#### 1. **Filtrar citas por estado**
```
GET /api/citas?estado=Programada
GET /api/citas?fecha=2025-01-25
```
**Para qué:** Permitir a recepcionistas filtrar citas por estado o fecha

---

#### 2. **Cancelar cita**
```
PUT /api/citas/{id}/cancelar
Body: {"motivo": "Cliente canceló"}
```
**Para qué:** Clientes y recepcionistas puedan cancelar citas

---

#### 3. **Obtener citas de una mascota específica**
```
GET /api/citas/mascota/{idMascota}
```
**Para qué:** Ver histórico de citas de una mascota en su perfil

---

#### 4. **Actualizar datos de mascota**
```
PUT /api/mascotas/{id}
Body: {"peso": 26.0, "color": "Dorado oscuro"}
```
**Para qué:** Actualizar peso y otros datos tras consultas

---

#### 5. **Registrar nueva mascota**
```
POST /api/mascotas
Body: {
  "nombre": "Luna",
  "especie": "Gato",
  "raza": "Siamés",
  "edad": 2,
  "peso": 4.5,
  "color": "Blanco",
  "sexo": "F",
  "idCliente": 5
}
```
**Para qué:** Recepcionistas puedan registrar nuevas mascotas

---

#### 6. **Buscar cliente por email o nombre**
```
GET /api/usuarios/buscar?q=carlos
```
**Para qué:** Recepcionistas busquen clientes rápidamente

---

#### 7. **Crear nuevo usuario (ADMIN)**
```
POST /api/usuarios
Body: {
  "email": "nuevo@clinica.com",
  "password": "temporal123",
  "nombre": "Dr. Pedro",
  "rol": "VETERINARIO"
}
```
**Para qué:** Admin pueda dar de alta nuevos usuarios

---

#### 8. **Obtener disponibilidad de veterinario**
```
GET /api/citas/disponibilidad/{idVeterinario}?fecha=2025-01-25
Response: {
  "fecha": "2025-01-25",
  "horasDisponibles": ["08:00", "09:00", "10:30", "14:00"]
}
```
**Para qué:** Mostrar solo horarios libres al agendar

---

#### 9. **Dashboard con gráficos (ADMIN)**
```
GET /api/admin/reportes/mensual
Response: {
  "citasPorDia": [12, 15, 8, 20, ...],
  "ingresosMensuales": 45000,
  "citasCanceladas": 3
}
```
**Para qué:** Mostrar gráficos estadísticos en el dashboard

---

#### 10. **Notificaciones pendientes**
```
GET /api/notificaciones
Response: [
  {
    "id": 1,
    "tipo": "CITA_PROXIMA",
    "mensaje": "Tienes una cita mañana a las 10:00",
    "leida": false,
    "fecha": "2025-01-19T20:00:00"
  }
]
```
**Para qué:** Sistema de notificaciones en tiempo real

---

## 🔒 SEGURIDAD Y VALIDACIONES

### Validaciones que el BACKEND debe implementar:

1. **Login:**
   - Email válido y contraseña mínimo 6 caracteres
   - Máximo 5 intentos fallidos antes de bloqueo temporal

2. **Crear Cita:**
   - Fecha no puede ser pasada
   - Hora entre 08:00 y 18:00
   - Duración entre 15 y 120 minutos
   - Motivo mínimo 10 caracteres
   - Validar que mascota pertenezca al cliente autenticado
   - No permitir citas duplicadas (mismo veterinario, fecha, hora)

3. **Historial Clínico:**
   - Solo el dueño y veterinarios pueden ver historial
   - Solo veterinarios pueden agregar entradas
   - Descripción obligatoria (mínimo 10 caracteres)

4. **Usuarios (ADMIN):**
   - Admin no puede desactivarse a sí mismo
   - Email único en el sistema
   - Roles válidos: ADMIN, VETERINARIO, RECEPCIONISTA, CLIENTE

---

## 🗄️ MODELO DE BASE DE DATOS MYSQL

### Tablas principales que el backend debe tener:

```sql
-- Usuarios
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  rol ENUM('ADMIN','VETERINARIO','RECEPCIONISTA','CLIENTE') NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mascotas
CREATE TABLE mascotas (
  id_mascota INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  especie VARCHAR(30) NOT NULL,
  raza VARCHAR(50),
  edad INT,
  peso DECIMAL(5,2),
  color VARCHAR(30),
  sexo ENUM('M','F'),
  estado VARCHAR(20) DEFAULT 'Activo',
  id_cliente INT NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario)
);

-- Citas
CREATE TABLE citas (
  id_cita INT PRIMARY KEY AUTO_INCREMENT,
  fecha_cita DATE NOT NULL,
  hora_cita TIME NOT NULL,
  duracion_minutos INT DEFAULT 30,
  motivo TEXT NOT NULL,
  observaciones TEXT,
  estado_cita ENUM('Programada','En curso','Completada','Cancelada') DEFAULT 'Programada',
  id_mascota INT NOT NULL,
  id_veterinario INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota),
  FOREIGN KEY (id_veterinario) REFERENCES usuarios(id_usuario)
);

-- Historias Clínicas
CREATE TABLE historias_clinicas (
  id_historia INT PRIMARY KEY AUTO_INCREMENT,
  id_mascota INT UNIQUE NOT NULL,
  fecha_creacion DATE NOT NULL,
  FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota)
);

-- Entradas de Historia
CREATE TABLE entradas_historia (
  id_entrada INT PRIMARY KEY AUTO_INCREMENT,
  id_historia INT NOT NULL,
  id_veterinario INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descripcion TEXT NOT NULL,
  observaciones TEXT,
  peso_actual DECIMAL(5,2),
  temperatura DECIMAL(4,2),
  frecuencia_cardiaca INT,
  FOREIGN KEY (id_historia) REFERENCES historias_clinicas(id_historia),
  FOREIGN KEY (id_veterinario) REFERENCES usuarios(id_usuario)
);
```

---

## 📝 NOTAS IMPORTANTES PARA EL BACKEND

### ✅ Lo que YA funciona bien:
- Login y JWT
- CORS configurado correctamente
- Obtener mascotas del cliente
- Crear y listar citas
- Historial clínico completo
- Gestión de usuarios (ADMIN)

### ⚠️ Lo que necesita ajustes:
1. **Formato de fechas:** Frontend espera `YYYY-MM-DD` y `HH:MM:SS`
2. **Nombres de campos:** Frontend usa `idMascota`, `idVeterinario`, etc. (camelCase)
3. **Estados de cita:** Deben ser exactamente: `Programada`, `En curso`, `Completada`, `Cancelada`
4. **Roles:** Deben ser: `ADMIN`, `VETERINARIO`, `RECEPCIONISTA`, `CLIENTE`

### 🚀 Prioridades de implementación:
1. **ALTA:** Endpoints de nuevas funcionalidades (1-5)
2. **MEDIA:** Reportes y disponibilidad (8-9)
3. **BAJA:** Notificaciones (10)

---

## 🧪 DATOS DE PRUEBA (SEED)

```sql
-- Usuario Admin
INSERT INTO usuarios (email, password, nombre, rol) 
VALUES ('admin@clinica.com', '$2a$10$hashaqui', 'Administrador', 'ADMIN');

-- Veterinario
INSERT INTO usuarios (email, password, nombre, rol) 
VALUES ('ana@clinica.com', '$2a$10$hashaqui', 'Dra. Ana García', 'VETERINARIO');

-- Cliente
INSERT INTO usuarios (email, password, nombre, rol) 
VALUES ('carlos@email.com', '$2a$10$hashaqui', 'Carlos Martínez', 'CLIENTE');

-- Mascota
INSERT INTO mascotas (nombre, especie, raza, edad, peso, color, sexo, id_cliente) 
VALUES ('Max', 'Perro', 'Golden Retriever', 3, 25.5, 'Dorado', 'M', 3);

-- Cita
INSERT INTO citas (fecha_cita, hora_cita, motivo, estado_cita, id_mascota, id_veterinario) 
VALUES ('2025-01-25', '10:00:00', 'Control rutinario', 'Programada', 1, 2);

-- Historia
INSERT INTO historias_clinicas (id_mascota, fecha_creacion) 
VALUES (1, '2024-01-15');
```

---

## 📞 CONTACTO

**Preguntas sobre endpoints:** Frontend Team  
**Documentación completa:** Ver `SECURITY.md` y `README.md`  
**Repositorio:** `frontend-gestion-citas/`

---

✅ **ESTE DOCUMENTO ES LA ÚNICA REFERENCIA QUE NECESITA EL BACKEND PARA IMPLEMENTAR LA API COMPLETA**

**Última actualización:** Enero 20, 2025

