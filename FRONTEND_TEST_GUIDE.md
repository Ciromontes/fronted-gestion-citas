# 🎨 GUÍA DE PRUEBAS DEL FRONTEND

## 🎯 OBJETIVO
Validar que el frontend React consume correctamente los endpoints del backend y respeta los permisos por rol.

---

## 🚀 INICIAR EL FRONTEND

### Prerequisitos
✅ Backend corriendo en `http://localhost:8080`  
✅ Base de datos MySQL activa

### Comando para iniciar
```powershell
cd frontend-gestion-citas
npm install
npm run dev
```

**URL del frontend:** `http://localhost:5173`

---

## 📋 CREDENCIALES DE PRUEBA

```
ADMIN:     admin@clinicaveterinaria.com / admin123
VETERINARIO: ana.vet@clinicaveterinaria.com / vet123
CLIENTE:   lucia.cliente@clinicaveterinaria.com / cliente123
```

---

## 🧪 PRUEBAS POR ROL

---

## 👤 PRUEBAS COMO CLIENTE

### ✅ 1. Login y Dashboard
1. Abre `http://localhost:5173`
2. Login con: `lucia.cliente@clinicaveterinaria.com` / `cliente123`
3. **Esperado:**
   - Dashboard de cliente
   - Menú con opciones: Mis Mascotas, Mis Citas, Agendar Cita
   - NO debe ver opciones de administración o gestión de historias clínicas

### ✅ 2. Ver MIS Mascotas
1. Click en "Mis Mascotas"
2. **Esperado:**
   - Lista con SOLO las mascotas de Lucía
   - NO debe ver mascotas de otros clientes
   - **Endpoint usado:** `GET /api/mascotas/mias`

### ✅ 3. Ver MIS Citas
1. Click en "Mis Citas"
2. **Esperado:**
   - Lista con SOLO citas de las mascotas de Lucía
   - Estado de cada cita (Programada, Completada, Cancelada)
   - **Endpoint usado:** `GET /api/citas/mis-citas`

### ✅ 4. Ver Historial de MI Mascota
1. Desde "Mis Mascotas", selecciona una mascota
2. Click en "Ver Historial Clínico"
3. **Esperado:**
   - Historial completo con entradas médicas
   - Datos: fecha, veterinario, diagnóstico, peso, temperatura
   - NO debe aparecer botón "Agregar Entrada"
   - **Endpoint usado:** `GET /api/historias/mascota/{id}/completo`

### ✅ 5. Agendar Nueva Cita
1. Click en "Agendar Cita"
2. Llena el formulario:
   - Selecciona TU mascota
   - Fecha: `2025-10-28`
   - Hora: `09:30:00`
   - Motivo: `Vacunación antirrábica`
   - Veterinario: Dra. Ana
3. Click en "Agendar"
4. **Esperado:**
   - Mensaje "Cita agendada exitosamente"
   - Cita aparece en "Mis Citas"
   - **Endpoint usado:** `POST /api/citas/agendar`

### ❌ 6. Restricciones del Cliente
**Verificar que NO pueda:**
- Ver el listado completo de citas del sistema
- Agregar entradas a historias clínicas
- Ver mascotas de otros clientes
- Acceder a gestión de usuarios

---

## 👨‍⚕️ PRUEBAS COMO VETERINARIO

### ✅ 1. Login y Dashboard
1. Logout del cliente
2. Login con: `ana.vet@clinicaveterinaria.com` / `vet123`
3. **Esperado:**
   - Dashboard de veterinario
   - Menú: Citas de Hoy, Todas las Citas, Historias Clínicas, Mascotas
   - Tabla con citas programadas para HOY de la Dra. Ana

### ✅ 2. Ver MIS Citas de Hoy
1. En el dashboard, ver tabla de citas de hoy
2. **Esperado:**
   - Solo citas asignadas a la Dra. Ana (ID_Veterinario = 3)
   - Información: mascota, cliente, hora, motivo
   - **Endpoint usado:** `GET /api/citas/hoy`

### ✅ 3. Ver TODAS las Citas (Coordinación)
1. Click en "Todas las Citas"
2. **Esperado:**
   - Lista completa con citas de todos los veterinarios
   - Útil para coordinación de horarios
   - **Endpoint usado:** `GET /api/citas`

### ✅ 4. Ver Historial de Cualquier Mascota
1. Click en "Mascotas"
2. Selecciona cualquier mascota (no solo de clientes propios)
3. Click en "Ver Historial"
4. **Esperado:**
   - Historial completo visible
   - Botón "Agregar Entrada Médica" disponible
   - **Endpoint usado:** `GET /api/historias/mascota/{id}/completo`

### ✅ 5. Agregar Entrada Médica
1. Desde el historial de una mascota, click en "Agregar Entrada"
2. Llena el formulario:
   - Descripción: `Control rutinario. Mascota en buen estado.`
   - Observaciones: `Recomendar refuerzo de vacuna en 6 meses`
   - Peso: `26.5`
   - Temperatura: `38.3`
   - Frecuencia Cardíaca: `118`
3. **Esperado:**
   - Entrada agregada exitosamente
   - Aparece en el historial con fecha y nombre del veterinario
   - **Endpoint usado:** `POST /api/historias/{id}/entrada`

### ✅ 6. Actualizar Estado de MI Cita
1. Desde "Mis Citas de Hoy", selecciona una cita propia
2. Click en "Completar Cita"
3. **Esperado:**
   - Estado cambia a "Completada"
   - **Endpoint usado:** `PUT /api/citas/{id}/estado`

### ❌ 7. Restricciones del Veterinario
**Verificar que NO pueda:**
- Actualizar citas de otros veterinarios
- Acceder a gestión de usuarios
- Desactivar usuarios

---

## 🔐 PRUEBAS COMO ADMIN

### ✅ 1. Login y Dashboard
1. Logout del veterinario
2. Login con: `admin@clinicaveterinaria.com` / `admin123`
3. **Esperado:**
   - Dashboard administrativo con estadísticas
   - Menú: Usuarios, Todas las Citas, Mascotas, Reportes

### ✅ 2. Ver TODAS las Citas (Supervisión)
1. Click en "Todas las Citas"
2. **Esperado:**
   - Lista completa del sistema
   - Filtros por fecha, estado, veterinario
   - **Endpoint usado:** `GET /api/citas`

### ✅ 3. Ver TODAS las Citas de Hoy
1. Click en "Citas de Hoy"
2. **Esperado:**
   - Todas las citas programadas para hoy (de todos los veterinarios)
   - **Endpoint usado:** `GET /api/citas/hoy`

### ✅ 4. Ver Todas las Mascotas
1. Click en "Mascotas"
2. **Esperado:**
   - Lista completa de mascotas del sistema
   - **Endpoint usado:** `GET /api/mascotas`

### ✅ 5. Ver Historiales Clínicos (Supervisión)
1. Selecciona cualquier mascota
2. Click en "Ver Historial"
3. **Esperado:**
   - Historial completo visible
   - NO debe aparecer botón "Agregar Entrada" (solo VETERINARIO puede)
   - **Endpoint usado:** `GET /api/historias/mascota/{id}/completo`

### ✅ 6. Gestionar Usuarios
1. Click en "Gestión de Usuarios"
2. **Esperado:**
   - Tabla con todos los usuarios (ADMIN, VETERINARIO, CLIENTE)
   - Columnas: nombre, email, rol, estado (activo/inactivo)
   - **Endpoint usado:** `GET /api/usuarios`

### ✅ 7. Desactivar/Activar Usuario
1. Selecciona un usuario (ej: Carlos Martínez - id 9)
2. Click en "Desactivar"
3. **Esperado:**
   - Usuario marcado como inactivo
   - **Endpoint usado:** `PUT /api/usuarios/9/estado`

4. Click en "Activar"
5. **Esperado:**
   - Usuario vuelve a estar activo

### ❌ 8. Restricciones del Admin
**Verificar que NO pueda:**
- Actualizar estados de citas (es responsabilidad del veterinario)
- Agregar entradas médicas (solo VETERINARIO)

---

## 🐛 PRUEBAS DE ERRORES Y VALIDACIONES

### ✅ 9. Login con Credenciales Incorrectas
1. Intenta login con: `test@test.com` / `wrong123`
2. **Esperado:** Mensaje "Credenciales inválidas"

### ✅ 10. Validación de Formularios
1. Intenta agendar cita sin llenar campos obligatorios
2. **Esperado:** Mensajes de error específicos por campo

### ✅ 11. Manejo de Error de Servidor
1. Detén el backend: `docker-compose down`
2. Intenta hacer login
3. **Esperado:** Mensaje "Error de conexión con el servidor"
4. Reinicia: `docker-compose up -d`

### ✅ 12. Logout
1. Click en "Cerrar Sesión"
2. **Esperado:**
   - Redirige al login
   - Token eliminado del localStorage
   - No puede acceder a rutas protegidas

---

## 🎨 PRUEBAS DE UI/UX

### ✅ 13. Responsive Design
Abre el frontend en diferentes tamaños:
- Desktop: `1920x1080`
- Tablet: `768x1024`
- Mobile: `375x667`

**Esperado:** Interfaz adaptable, menú responsive

### ✅ 14. Navegación entre Vistas
1. Prueba todos los enlaces del menú
2. Usa botones "Volver" o "Cancelar"
3. **Esperado:** Navegación fluida, sin errores 404

### ✅ 15. Estados de Carga
1. Verifica que mientras cargan datos aparezca:
   - Spinner o "Cargando..."
   - Al terminar, la lista de datos
   - Si no hay datos: "No se encontraron resultados"

---

## 📊 CHECKLIST RESUMIDO

### CLIENTE ✅
- [ ] Login exitoso
- [ ] Ve solo SUS mascotas (`/mias`)
- [ ] Ve solo SUS citas (`/mis-citas`)
- [ ] Ve historial de SU mascota
- [ ] Agenda nueva cita
- [ ] NO puede agregar entradas médicas
- [ ] NO puede ver todas las citas del sistema

### VETERINARIO ✅
- [ ] Login exitoso
- [ ] Ve TODAS las citas (coordinación)
- [ ] Ve solo SUS citas de hoy
- [ ] Ve historial de cualquier mascota
- [ ] Agrega entrada médica
- [ ] Actualiza estado de SU cita
- [ ] NO puede actualizar citas de otros

### ADMIN ✅
- [ ] Login exitoso
- [ ] Ve TODAS las citas (supervisión)
- [ ] Ve TODAS las citas de hoy
- [ ] Ve todas las mascotas
- [ ] Ve historiales completos
- [ ] Lista todos los usuarios
- [ ] Activa/desactiva usuarios
- [ ] NO puede actualizar estados de citas
- [ ] NO puede agregar entradas médicas

### UI/UX ✅
- [ ] Responsive design
- [ ] Navegación fluida
- [ ] Mensajes de error claros
- [ ] Estados de carga visibles

---

## 🔍 TROUBLESHOOTING

### Problema: "CORS Error"
**Solución:** Verifica `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
```

### Problema: "Token no se envía"
**Solución:** Abre DevTools > Network > Headers  
Verifica que exista: `Authorization: Bearer {token}`

### Problema: "Página en blanco"
**Solución:** Abre la consola del navegador (F12) y busca errores de JavaScript

### Problema: "Cannot read property of undefined"
**Solución:** Verifica que los datos del backend estén llegando correctamente  
Usa `console.log()` en el componente para debuggear

---

## 🚀 SIGUIENTES PASOS

1. ✅ Ejecutar las 15 pruebas principales
2. ✅ Marcar el checklist completo
3. 📝 Documentar bugs encontrados
4. 🐳 Dockerizar frontend
5. ☁️ Desplegar en Azure

---

**📌 Última actualización:** 2025-10-22  
**🎯 Objetivo:** Validar que el frontend respete los mismos permisos que el backend

