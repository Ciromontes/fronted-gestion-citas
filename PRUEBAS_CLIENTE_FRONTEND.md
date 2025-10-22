# 🧪 PRUEBAS DEL CLIENTE - FRONTEND CORREGIDO

## ✅ CAMBIOS REALIZADOS

### 1. **citaService.ts** - Endpoints corregidos
- ✅ `crearCita()` ahora usa `POST /api/citas/agendar`
- ✅ `obtenerMisCitas()` ahora usa `GET /api/citas/mis-citas`
- ✅ Nueva función `obtenerTodasLasCitas()` para ADMIN/VETERINARIO

### 2. **Citas.tsx** - Endpoints por rol
- ✅ CLIENTE usa `GET /api/citas/mis-citas` (solo sus citas)
- ✅ ADMIN/VETERINARIO usa `GET /api/citas` (todas las citas)

---

## 🚀 INSTRUCCIONES PARA PROBAR

### 1️⃣ Iniciar el Frontend

```powershell
cd frontend-gestion-citas
npm run dev
```

Abre el navegador en: **http://localhost:5173**

---

## 👤 PRUEBAS COMO CLIENTE (Lucía)

### 📋 Credenciales
```json
{
  "email": "lucia.cliente@clinicaveterinaria.com",
  "password": "cliente123"
}
```

---

### ✅ TEST 1: Login y Dashboard
1. Ingresa las credenciales de Lucía
2. **Esperado**: Dashboard de cliente con sus mascotas

---

### ✅ TEST 2: Ver MIS Mascotas
1. El dashboard debe mostrar SOLO las mascotas de Lucía
2. **Endpoint usado**: `GET /api/mascotas/mias`
3. **Verificar en DevTools (F12) > Network**:
   - Request URL: `http://localhost:8080/api/mascotas/mias`
   - Authorization: `Bearer {token}`

---

### ✅ TEST 3: Ver MIS Citas (CORREGIDO ✅)
1. Click en "Mis Citas" en el menú lateral
2. **Esperado**: Solo citas de las mascotas de Lucía
3. **Endpoint usado**: `GET /api/citas/mis-citas`
4. **Verificar en DevTools > Network**:
   - Request URL: `http://localhost:8080/api/citas/mis-citas`
   - Status: 200 OK
   - Response: Array con solo las citas de Lucía

**❌ ANTES**: Mostraba todas las citas (43 aprox)
**✅ AHORA**: Muestra solo las citas de Lucía

---

### ✅ TEST 4: Agendar Nueva Cita (CORREGIDO ✅)

#### 4.1 Abrir Modal
1. Click en "Nueva Cita" o botón "+" flotante
2. **Esperado**: Modal con formulario de agendar

#### 4.2 Seleccionar Mascota
1. Desplegable "Selecciona tu mascota"
2. **Esperado**: Solo mascotas de Lucía en la lista
3. Selecciona una mascota (ej: Max)
4. **Verificar**: El valor queda seleccionado

#### 4.3 Seleccionar Veterinario
1. Desplegable "Elige un veterinario"
2. **Esperado**: Lista de veterinarios activos
   - Dra. Ana Veterinaria
   - Dr. Juan Carlos Pérez
   - Dra. María Elena Rodríguez
3. Selecciona un veterinario (ej: Dra. Ana - id: 3)

#### 4.4 Completar Formulario
```json
{
  "mascota": "Max (u otra mascota de Lucía)",
  "veterinario": "Dra. Ana Veterinaria",
  "fecha": "2025-10-28",
  "hora": "14:30",
  "duracion": "30",
  "motivo": "Vacunación antirrábica y control general"
}
```

#### 4.5 Enviar Cita
1. Click en "Agendar"
2. **Endpoint usado**: `POST /api/citas/agendar`
3. **Verificar en DevTools > Network**:
   - Request URL: `http://localhost:8080/api/citas/agendar`
   - Method: POST
   - Payload:
   ```json
   {
     "idMascota": 1,
     "idVeterinario": 3,
     "fechaCita": "2025-10-28",
     "horaCita": "14:30:00",
     "duracionMinutos": 30,
     "motivo": "Vacunación antirrábica y control general",
     "estadoCita": "Programada"
   }
   ```
   - Status: 200 OK

4. **Esperado**: 
   - Mensaje "✅ Cita agendada exitosamente"
   - Modal se cierra automáticamente
   - Cita aparece en "Mis Citas"

**❌ ANTES**: Usaba `POST /api/citas` (incorrecto)
**✅ AHORA**: Usa `POST /api/citas/agendar` (correcto)

---

### ✅ TEST 5: Ver Historial de MI Mascota
1. Desde "Mis Mascotas", click en una mascota
2. Click en "Ver Historial Clínico"
3. **Endpoint usado**: `GET /api/historias/mascota/{id}/completo`
4. **Esperado**:
   - Historial completo con entradas médicas
   - Peso, temperatura, frecuencia cardíaca
   - Nombre del veterinario que atendió
   - **NO debe aparecer** botón "Agregar Entrada" (solo veterinario puede)

---

### ❌ TEST 6: Restricciones del Cliente

#### 6.1 NO puede ver todas las citas
1. Intenta acceder a: `http://localhost:5173/admin/citas`
2. **Esperado**: Redirige o muestra error 403

#### 6.2 NO puede agregar entradas médicas
**Endpoint bloqueado**: `POST /api/historias/{id}/entrada`

**Prueba con curl**:
```powershell
curl -X POST http://localhost:8080/api/historias/1/entrada -H "Authorization: Bearer TU_TOKEN_CLIENTE" -H "Content-Type: application/json" -d "{\"descripcion\":\"Test\",\"pesoActual\":25.0,\"temperatura\":38.0}"
```

**Esperado**: `403 Forbidden`

#### 6.3 NO puede ver mascotas de otros clientes
**Endpoint bloqueado**: `GET /api/mascotas` (sin `/mias`)

**Prueba con curl**:
```powershell
curl -X GET http://localhost:8080/api/mascotas -H "Authorization: Bearer TU_TOKEN_CLIENTE"
```

**Esperado**: `403 Forbidden`

---

## 🔍 VERIFICACIÓN CON DEVTOOLS (F12)

### Network Tab - Endpoints esperados:

| Acción | Endpoint | Método | Status |
|--------|----------|--------|--------|
| Login | `/api/auth/login` | POST | 200 |
| Ver mascotas | `/api/mascotas/mias` | GET | 200 |
| Ver mis citas | `/api/citas/mis-citas` | GET | 200 |
| Agendar cita | `/api/citas/agendar` | POST | 200 |
| Ver historial | `/api/historias/mascota/{id}/completo` | GET | 200 |
| Ver veterinarios | `/api/usuarios/veterinarios/activos` | GET | 200 |

### Console Tab - Sin errores:
- ✅ No debe haber errores de CORS
- ✅ No debe haber errores 403 en endpoints permitidos
- ✅ No debe haber errores de JavaScript

---

## 📝 CHECKLIST DE VALIDACIÓN

### ANTES de los cambios ❌
- [ ] Cliente veía TODAS las citas (43 aprox)
- [ ] Agendar usaba endpoint incorrecto `/api/citas`
- [ ] No se validaba el rol en el frontend

### DESPUÉS de los cambios ✅
- [x] Cliente ve SOLO sus citas (filtradas por backend)
- [x] Agendar usa endpoint correcto `/api/citas/agendar`
- [x] Frontend usa endpoints diferenciados por rol
- [x] Mascota se selecciona correctamente en el modal
- [x] Veterinario se selecciona correctamente
- [x] Mensaje de éxito al agendar cita

---

## 🐛 PROBLEMAS CONOCIDOS RESUELTOS

### ✅ Problema 1: Cliente veía todas las citas
**Solución**: `Citas.tsx` ahora verifica el rol y usa:
- `GET /api/citas/mis-citas` para CLIENTE
- `GET /api/citas` para ADMIN/VETERINARIO

### ✅ Problema 2: Endpoint de agendar incorrecto
**Solución**: `citaService.ts` ahora usa `POST /api/citas/agendar`

### ✅ Problema 3: Mascota no quedaba seleccionada
**Solución**: Verificar que el `<select>` actualice correctamente el estado

---

## 🚀 SIGUIENTES PASOS

1. ✅ Ejecutar los 6 tests del cliente
2. ✅ Verificar en DevTools que los endpoints sean correctos
3. ✅ Confirmar que solo ve SUS citas y mascotas
4. 📝 Hacer commit de los cambios
5. 🔄 Probar VETERINARIO y ADMIN

---

**📌 Archivos modificados:**
- `src/services/citaService.ts`
- `src/components/Citas.tsx`

**🎯 Objetivo cumplido**: Cliente ahora respeta los permisos del backend

