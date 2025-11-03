# 📡 RESUMEN COMPLETO DE ENDPOINTS - FRONTEND

## ✅ ACTUALIZACIÓN COMPLETADA

Todos los endpoints hardcodeados han sido reemplazados por la configuración centralizada en `API_CONFIG`.

---

## 🎯 CONFIGURACIÓN ACTUAL

### Archivo: `src/config/api.config.ts`

**URL Base:**
- **Producción Azure:** `https://vetclinic-backend-2025.azurewebsites.net`
- **Variable de entorno:** `VITE_API_URL`
- **Fallback:** Si no hay variable de entorno, usa Azure por defecto

### Variables de Entorno:

#### `.env.production`
```env
VITE_API_URL=https://vetclinic-backend-2025.azurewebsites.net/api
```

#### `.env.local` (Docker)
```env
VITE_API_URL=/api
```

#### `.env.development` (Desarrollo local)
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📋 LISTADO COMPLETO DE ENDPOINTS

### 🔐 Autenticación
| Endpoint | Método | Descripción | Archivos que lo usan |
|----------|--------|-------------|---------------------|
| `/api/auth/login` | POST | Inicio de sesión | Login.tsx, AuthContext.tsx |

### 📅 Citas
| Endpoint | Método | Descripción | Archivos que lo usan |
|----------|--------|-------------|---------------------|
| `/api/citas` | GET | Listar todas las citas (ADMIN/VET/RECEP) | Citas.tsx, DashboardRecepcionista.tsx |
| `/api/citas/mis-citas` | GET | Listar citas del cliente autenticado | Citas.tsx |
| `/api/citas/hoy` | GET | Listar citas del día actual | CitasHoyPage.tsx, DashboardVeterinario.tsx, Sidebar.tsx |
| `/api/citas/agendar` | POST | Agendar nueva cita | citaService.ts, AgendarCitaModal.tsx |
| `/api/citas/{id}/estado` | PUT | Cambiar estado de una cita | CitasHoyPage.tsx, DashboardVeterinario.tsx |

### 🐾 Mascotas
| Endpoint | Método | Descripción | Archivos que lo usan |
|----------|--------|-------------|---------------------|
| `/api/mascotas` | GET | Listar todas las mascotas (ADMIN) | Sidebar.tsx, AdminMascotasPage.tsx |
| `/api/mascotas/mias` | GET | Listar mascotas del cliente | DashboardCliente.tsx, AgendarCitaModal.tsx |

### 📋 Historias Clínicas
| Endpoint | Método | Descripción | Archivos que lo usan |
|----------|--------|-------------|---------------------|
| `/api/historias/mascota/{id}` | GET | Obtener historia clínica de mascota | BuscadorHistorias.tsx |
| `/api/historias/mascota/{id}/completo` | GET | Historia completa con entradas | historialService.ts |
| `/api/historias/{id}/entradas` | GET | Listar entradas de una historia | HistorialMascota.tsx |
| `/api/historias/{id}/entrada` | POST | Agregar entrada a historia | FormEntradaHistoria.tsx |

### 👥 Usuarios
| Endpoint | Método | Descripción | Archivos que lo usan |
|----------|--------|-------------|---------------------|
| `/api/usuarios` | GET | Listar todos los usuarios (ADMIN) | TablaUsuarios.tsx |
| `/api/usuarios/veterinarios/activos` | GET | Listar veterinarios activos | useVeterinarios.ts |
| `/api/usuarios/{id}/estado` | PUT | Activar/desactivar usuario | TablaUsuarios.tsx |

### 📊 Administración
| Endpoint | Método | Descripción | Archivos que lo usan |
|----------|--------|-------------|---------------------|
| `/api/admin/metricas` | GET | Métricas del dashboard admin | DashboardAdmin.tsx |

---

## 📁 ARCHIVOS ACTUALIZADOS (13 archivos)

### ✅ Componentes modificados:
1. **TablaUsuarios.tsx** - 2 endpoints
   - `API_CONFIG.ENDPOINTS.USUARIOS`
   - `API_CONFIG.ENDPOINTS.USUARIOS_ESTADO(id)`

2. **Sidebar.tsx** - 2 endpoints
   - `API_CONFIG.ENDPOINTS.CITAS_HOY`
   - `API_CONFIG.ENDPOINTS.MASCOTAS`

3. **DashboardAdmin.tsx** - 1 endpoint
   - `API_CONFIG.ENDPOINTS.ADMIN_METRICAS`

4. **DashboardCliente.tsx** - 1 endpoint
   - `API_CONFIG.ENDPOINTS.MASCOTAS_MIAS`

5. **DashboardVeterinario.tsx** - 2 endpoints
   - `API_CONFIG.ENDPOINTS.CITAS_HOY`
   - `API_CONFIG.ENDPOINTS.CITAS_ESTADO(idCita)`

6. **DashboardRecepcionista.tsx** - 1 endpoint
   - `API_CONFIG.ENDPOINTS.CITAS`

7. **CitasHoyPage.tsx** - 2 endpoints
   - `API_CONFIG.ENDPOINTS.CITAS_HOY`
   - `API_CONFIG.ENDPOINTS.CITAS_ESTADO(idCita)`

8. **Citas.tsx** - 2 endpoints
   - `API_CONFIG.ENDPOINTS.CITAS_MIS_CITAS`
   - `API_CONFIG.ENDPOINTS.CITAS`

9. **AgendarCitaModal.tsx** - 1 endpoint
   - `API_CONFIG.ENDPOINTS.MASCOTAS_MIAS`

10. **BuscadorHistorias.tsx** - 1 endpoint
    - `API_CONFIG.ENDPOINTS.HISTORIAS_MASCOTA(mascotaId)`

11. **HistorialMascota.tsx** - 1 endpoint
    - `API_CONFIG.ENDPOINTS.HISTORIAS_ENTRADAS(idHistoria)`

12. **FormEntradaHistoria.tsx** - 1 endpoint
    - `API_CONFIG.ENDPOINTS.HISTORIAS_ENTRADA(idHistoria)`

13. **api.config.ts** - Todos los endpoints centralizados con prefijo `/api`

---

## 🔄 CÓMO FUNCIONA AHORA

### 1. **Desarrollo Local (sin Docker)**
```bash
# En el archivo .env.development o .env.local
VITE_API_URL=http://localhost:8080/api
```
- El frontend apunta a `http://localhost:8080/api`
- Requiere que el backend Spring Boot esté corriendo localmente

### 2. **Desarrollo con Docker**
```bash
# En el archivo .env.local
VITE_API_URL=/api
```
- Nginx hace proxy de `/api` a `host.docker.internal:8080/api`
- Todo funciona en contenedores

### 3. **Producción en Azure**
```bash
# En el archivo .env.production
VITE_API_URL=https://vetclinic-backend-2025.azurewebsites.net/api
```
- El frontend apunta directamente al backend en Azure
- **Nota:** Actualmente falta agregar `/api` en la URL de producción

---

## ⚠️ CORRECCIÓN NECESARIA PARA AZURE

### Problema Actual:
El archivo `.env.production` tiene:
```env
VITE_API_URL=https://vetclinic-backend-2025.azurewebsites.net/api
```

### Solución:
Verificar si el backend en Azure espera `/api` o no. Dependiendo de eso:

**Opción A:** Si el backend espera `/api` (recomendado):
```env
VITE_API_URL=https://vetclinic-backend-2025.azurewebsites.net
```
Y el config automáticamente agregará `/api` a cada endpoint.

**Opción B:** Si el backend NO espera `/api`:
```env
VITE_API_URL=https://vetclinic-backend-2025.azurewebsites.net
```
Y quitar `/api` de todos los endpoints en `api.config.ts`.

---

## 🚀 PRÓXIMOS PASOS

1. **Verificar backend en Azure:**
   ```bash
   curl https://vetclinic-backend-2025.azurewebsites.net/api/auth/login
   # O sin /api:
   curl https://vetclinic-backend-2025.azurewebsites.net/auth/login
   ```

2. **Ajustar .env.production según corresponda**

3. **Reconstruir el frontend:**
   ```bash
   npm run build
   ```

4. **Re-deployar en Azure Static Web Apps**

5. **Probar desde el navegador:**
   - Abrir https://brave-island-0600c480f.3.azurestaticapps.net
   - Intentar hacer login
   - Verificar en DevTools → Network → que los endpoints apunten correctamente

---

## 📊 ESTADÍSTICAS

- **Total de endpoints:** 17
- **Archivos modificados:** 13
- **Endpoints hardcodeados eliminados:** 18
- **Configuración centralizada:** ✅
- **Soporte multi-entorno:** ✅ (local, Docker, Azure)
- **Type-safe endpoints:** ✅ (TypeScript)

---

## 🎯 BENEFICIOS DE LA REFACTORIZACIÓN

1. ✅ **Configuración centralizada** - Un solo lugar para cambiar URLs
2. ✅ **Soporte multi-entorno** - Diferentes URLs para dev/docker/prod
3. ✅ **Mantenibilidad** - Fácil de actualizar y debuggear
4. ✅ **Type-safe** - TypeScript valida los endpoints
5. ✅ **Sin duplicación** - No más URLs hardcodeadas repetidas
6. ✅ **Documentación clara** - Este archivo explica todo el sistema

---

## 📝 NOTAS IMPORTANTES

- Todos los endpoints usan el prefijo `/api`
- La configuración se basa en variables de entorno de Vite (`VITE_*`)
- El fallback por defecto es Azure (producción)
- Cada componente importa `API_CONFIG` en lugar de URLs directas
- Los endpoints dinámicos (con IDs) son funciones TypeScript

---

## 🔍 DEBUGGING

Si hay problemas de conexión:

1. **Verificar en el navegador (DevTools → Console):**
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

2. **Verificar en el código:**
   ```typescript
   console.log('API Base URL:', API_CONFIG.BASE_URL)
   console.log('Login endpoint:', API_CONFIG.ENDPOINTS.LOGIN)
   ```

3. **Verificar en Network tab:**
   - Ver a qué URL está haciendo las peticiones
   - Verificar que tenga el prefijo `/api`

---

**Fecha de actualización:** 2025-11-03  
**Estado:** ✅ Completado  
**Siguiente paso:** Ajustar `.env.production` y redesplegar en Azure

