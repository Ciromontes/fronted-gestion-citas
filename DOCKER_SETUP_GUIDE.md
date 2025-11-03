# 🚀 GUÍA DE DOCKERIZACIÓN Y PRUEBAS - FRONTEND VETCLINIC

## ✅ ARCHIVOS CREADOS

### 1. Variables de Entorno
- ✅ `.env.development` - Para desarrollo local sin Docker
- ✅ `.env.docker` - Para Docker (desarrollo)
- ✅ `.env.production` - Para Azure (producción)

### 2. Configuración Docker
- ✅ `Dockerfile` - Ya existía y está optimizado (multi-stage build)
- ✅ `nginx.conf` - Configuración de nginx con proxy reverso
- ✅ `docker-compose.dev.yml` - Orquestación completa (frontend + backend + mysql)

### 3. Código Actualizado
- ✅ `src/config/api.config.ts` - Configuración centralizada de URLs
- ✅ `src/services/citaService.ts` - Actualizado para usar variables de entorno
- ✅ `src/services/historialService.ts` - Actualizado para usar variables de entorno
- ✅ `src/components/Login.tsx` - Actualizado para usar variables de entorno

---

## 📋 COMANDOS PARA PRUEBAS

### OPCIÓN 1: DESARROLLO LOCAL (SIN DOCKER)

```cmd
cd frontend-gestion-citas
npm install
npm run dev
```

**Resultado esperado:**
- Frontend corriendo en: http://localhost:5173
- Conectándose a: http://localhost:8080/api (backend local)

---

### OPCIÓN 2: DOCKER SOLO FRONTEND

```cmd
cd frontend-gestion-citas

REM Build de la imagen
docker build -t vetclinic-frontend:latest .

REM Ejecutar contenedor
docker run -d -p 3000:80 --name vetclinic-frontend vetclinic-frontend:latest

REM Ver logs
docker logs vetclinic-frontend

REM Verificar que responde
curl http://localhost:3000
```

**Resultado esperado:**
- Frontend corriendo en: http://localhost:3000
- Servido por nginx desde el contenedor Docker

---

### OPCIÓN 3: DOCKER COMPOSE COMPLETO (RECOMENDADO)

**Paso 1: Asegurar que la imagen del backend existe**

```cmd
cd ..
docker images | findstr gestion-citas-backend
```

Si NO existe, debes buildearla primero:
```cmd
cd gestion-citas
docker build -t gestion-citas-backend:latest .
cd ..
```

**Paso 2: Levantar todos los servicios**

```cmd
cd frontend-gestion-citas
docker-compose -f docker-compose.dev.yml up -d
```

**Paso 3: Verificar que los contenedores están corriendo**

```cmd
docker ps
```

Deberías ver 3 contenedores:
- `vetclinic-frontend-dev` (puerto 3000)
- `vetclinic-backend-dev` (puerto 8080)
- `vetclinic-mysql-dev` (puerto 3306)

**Paso 4: Ver logs**

```cmd
REM Logs del frontend
docker logs vetclinic-frontend-dev

REM Logs del backend
docker logs vetclinic-backend-dev

REM Logs de MySQL
docker logs vetclinic-mysql-dev
```

**Paso 5: Verificar conectividad**

```cmd
REM Verificar frontend
curl http://localhost:3000

REM Verificar backend
curl http://localhost:8080/api/health

REM O abrir en el navegador
start http://localhost:3000
```

---

## 🧪 CRITERIOS DE ÉXITO

### ✅ Frontend responde
- [ ] http://localhost:3000 muestra la página de login
- [ ] La página carga sin errores en la consola del navegador
- [ ] Los estilos se cargan correctamente

### ✅ Login funciona
- [ ] Puedes hacer login con: admin@clinicaveterinaria.com / admin123
- [ ] El token se guarda en localStorage
- [ ] Redirecciona al dashboard correcto según el rol

### ✅ Dashboard carga datos
- [ ] El dashboard muestra información del backend
- [ ] Las citas se cargan correctamente
- [ ] Las mascotas se muestran (si es cliente)
- [ ] Los badges muestran contadores

### ✅ Sin errores de CORS
- [ ] Abrir DevTools (F12) > Console
- [ ] No debe haber errores de CORS
- [ ] Las peticiones a /api se completan exitosamente

### ✅ Comunicación entre contenedores
- [ ] Frontend puede conectarse a backend usando `http://backend:8080/api`
- [ ] Backend puede conectarse a MySQL usando `mysql:3306`
- [ ] Los logs no muestran errores de conexión

---

## 🐛 TROUBLESHOOTING

### Problema: "Cannot connect to backend"

**Solución 1:** Verificar que el backend está corriendo
```cmd
docker logs vetclinic-backend-dev
curl http://localhost:8080/api/health
```

**Solución 2:** Verificar red Docker
```cmd
docker network ls
docker network inspect vetclinic-network
```

### Problema: "CORS Error"

**Solución:** El backend debe permitir el origen del frontend
- En desarrollo local: `http://localhost:5173`
- En Docker: `http://localhost:3000`

Verificar `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000"
));
```

### Problema: "MySQL Connection refused"

**Solución:** Esperar a que MySQL esté listo
```cmd
docker logs vetclinic-mysql-dev | findstr "ready for connections"
```

Si no está listo, esperar 30 segundos y reintentar.

### Problema: "Frontend muestra página en blanco"

**Solución 1:** Ver logs de nginx
```cmd
docker logs vetclinic-frontend-dev
```

**Solución 2:** Ver logs en el navegador
- Abrir DevTools (F12) > Console
- Buscar errores de JavaScript

**Solución 3:** Verificar que el build fue exitoso
```cmd
docker exec vetclinic-frontend-dev ls -la /usr/share/nginx/html
```

---

## 🔄 COMANDOS DE MANTENIMIENTO

### Detener todos los servicios
```cmd
docker-compose -f docker-compose.dev.yml down
```

### Detener y eliminar volúmenes
```cmd
docker-compose -f docker-compose.dev.yml down -v
```

### Rebuild del frontend
```cmd
docker-compose -f docker-compose.dev.yml build frontend
docker-compose -f docker-compose.dev.yml up -d frontend
```

### Reiniciar un servicio específico
```cmd
docker-compose -f docker-compose.dev.yml restart frontend
```

### Ver logs en tiempo real
```cmd
docker-compose -f docker-compose.dev.yml logs -f frontend
```
## 🔄 ACTUALIZACIÓN - CORRECCIONES DE BUILD APLICADAS

**Fecha de actualización:** 2025-10-22

### ✅ Correcciones aplicadas para resolver error TS5083:

1. **Dockerfile optimizado:**
   - Orden de COPY específico (tsconfig antes del build)
   - Copia explícita de archivos de configuración
   
2. **.dockerignore corregido:**
   - Ya no bloquea archivos de configuración TypeScript
   - Permite tsconfig*.json, vite.config.ts, eslint.config.js
   
3. **vite.config.ts mejorado:**
   - Eliminado `base: '/app/'` problemático
   - Agregado `host: true` y `usePolling: true` para Docker
   
4. **nginx.conf creado:**
   - Configuración SPA completa
   - Proxy reverso a /api opcional
   - Compresión gzip y caché de assets

**📄 Documentos relacionados:**
- `CORRECCIONES_BUILD_APLICADAS.md` - Detalle completo de las correcciones
- `ESTRATEGIA_DE_ORQUESTACION.md` - Plan maestro del proyecto completo

**⚡ Próximo paso:**
```cmd
docker-compose -f docker-compose.dev.yml build --no-cache frontend
docker-compose -f docker-compose.dev.yml up -d frontend
```

---


**Versión:** 1.1 (CORRECCIONES APLICADAS)
**Estado:** ✅ CORRECCIONES APLICADAS - LISTO PARA BUILD
## 📊 PRUEBAS FUNCIONALES

### 1. Login como ADMIN
```
Usuario: admin@clinicaveterinaria.com
Password: admin123
```
✅ Debe redirigir a /admin/dashboard
✅ Debe mostrar opciones de administración en el menú

### 2. Login como VETERINARIO
```
Usuario: ana.vet@clinicaveterinaria.com
Password: vet123
```
✅ Debe redirigir a /veterinario/citas-hoy
✅ Debe mostrar las citas del día

### 3. Login como CLIENTE
```
Usuario: lucia.cliente@clinicaveterinaria.com
Password: cliente123
```
✅ Debe redirigir a /cliente/mascotas
✅ Debe mostrar solo SUS mascotas

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Dockerizar frontend - **COMPLETADO**
2. ✅ Configurar variables de entorno - **COMPLETADO**
3. ✅ Crear docker-compose - **COMPLETADO**
4. ⏳ Probar integración completa
5. ⏳ Documentar APIs consumidas
6. ⏳ Preparar para Azure

---

## 📝 NOTAS IMPORTANTES

- **Variables de entorno:** El frontend usa `import.meta.env.VITE_API_URL`
- **Build time:** Las variables deben estar disponibles durante el build
- **Nginx:** Sirve archivos estáticos y puede hacer proxy reverso a /api
- **Caché:** Los badges usan sessionStorage con TTL de 60 segundos

---

**Fecha:** 2025-10-22
**Versión:** 1.0
**Estado:** ✅ DOCKERIZACIÓN COMPLETADA

