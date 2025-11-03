- Backend API: http://localhost:8080/api
- MySQL: localhost:3306

---

### ⏳ FASE 5: DESPLIEGUE EN AZURE
**Duración estimada:** 4-6 horas  
**Objetivo:** Aplicación desplegada en Azure Container Apps

**Pasos:**

#### 5.1. Preparar imágenes
```cmd
# Tag para Azure Container Registry
docker tag gestion-citas-backend:latest vetclinicregistry.azurecr.io/backend:latest
docker tag vetclinic-frontend:latest vetclinicregistry.azurecr.io/frontend:latest
docker tag vetclinic-landing:latest vetclinicregistry.azurecr.io/landing:latest
```

#### 5.2. Crear Azure Container Registry
```bash
az acr create --resource-group vetclinic-rg \
              --name vetclinicregistry \
              --sku Basic
```

#### 5.3. Push de imágenes
```bash
az acr login --name vetclinicregistry
docker push vetclinicregistry.azurecr.io/backend:latest
docker push vetclinicregistry.azurecr.io/frontend:latest
docker push vetclinicregistry.azurecr.io/landing:latest
```

#### 5.4. Crear Azure Database for MySQL
```bash
az mysql flexible-server create \
  --resource-group vetclinic-rg \
  --name vetclinic-mysql \
  --admin-user adminuser \
  --admin-password <PASSWORD> \
  --sku-name Standard_B1ms \
  --storage-size 20
```

#### 5.5. Crear Container Apps
```bash
# Backend
az containerapp create \
  --name vetclinic-backend \
  --resource-group vetclinic-rg \
  --image vetclinicregistry.azurecr.io/backend:latest \
  --target-port 8080 \
  --ingress external

# Frontend
az containerapp create \
  --name vetclinic-frontend \
  --resource-group vetclinic-rg \
  --image vetclinicregistry.azurecr.io/frontend:latest \
  --target-port 80 \
  --ingress external

# Landing
az containerapp create \
  --name vetclinic-landing \
  --resource-group vetclinic-rg \
  --image vetclinicregistry.azurecr.io/landing:latest \
  --target-port 80 \
  --ingress external
```

#### 5.6. Configurar variables de entorno en Azure
```bash
az containerapp update \
  --name vetclinic-backend \
  --resource-group vetclinic-rg \
  --set-env-vars \
    SPRING_DATASOURCE_URL="jdbc:mysql://vetclinic-mysql.mysql.database.azure.com:3306/gestion_citas_db" \
    SPRING_DATASOURCE_USERNAME="adminuser" \
    SPRING_DATASOURCE_PASSWORD="<PASSWORD>"
```

#### 5.7. Configurar dominio personalizado
```bash
az containerapp hostname add \
  --hostname www.vetclinic.com \
  --name vetclinic-landing \
  --resource-group vetclinic-rg
```

**Resultado final:**
- Landing: https://www.vetclinic.com
- Frontend: https://www.vetclinic.com/app
- Backend: https://api.vetclinic.com
- MySQL: Managed Azure Database

---

## 📊 MATRIZ DE DEPENDENCIAS

```
┌─────────────────────────────────────────────────┐
│                   LANDING PAGE                   │
│              (nginx, puerto 80)                  │
│          http://localhost                        │
└───────────────────┬─────────────────────────────┘
                    │
                    │ proxy /app
                    ↓
┌─────────────────────────────────────────────────┐
│                FRONTEND (React)                  │
│           (nginx + SPA, puerto 3000)            │
│       http://localhost:3000                      │
└───────────────────┬─────────────────────────────┘
                    │
                    │ HTTP requests /api
                    ↓
┌─────────────────────────────────────────────────┐
│             BACKEND (Spring Boot)                │
│              (Tomcat, puerto 8080)               │
│       http://localhost:8080/api                  │
└───────────────────┬─────────────────────────────┘
                    │
                    │ JDBC connection
                    ↓
┌─────────────────────────────────────────────────┐
│                MYSQL DATABASE                    │
│               (MySQL 8.0, puerto 3306)          │
│       jdbc:mysql://mysql:3306/gestion_citas_db  │
└─────────────────────────────────────────────────┘
```

---

## 🐛 TROUBLESHOOTING GENERAL

### Problema: Frontend no se conecta a backend
**Síntomas:** Errores CORS, peticiones fallan

**Solución:**
1. Verificar que backend permite origen del frontend:
   ```java
   // SecurityConfig.java
   configuration.setAllowedOrigins(Arrays.asList(
       "http://localhost:3000",
       "http://localhost"
   ));
   ```

2. Verificar URL en frontend:
   ```typescript
   // src/config/api.config.ts
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
   ```

3. Verificar que backend está corriendo:
   ```cmd
   curl http://localhost:8080/actuator/health
   ```

---

### Problema: Backend no se conecta a MySQL
**Síntomas:** "Connection refused", "Unknown database"

**Solución:**
1. Verificar que MySQL está corriendo:
   ```cmd
   docker ps | findstr mysql
   ```

2. Verificar conexión:
   ```cmd
   docker exec -it vetclinic-mysql-dev mysql -u root -p
   ```

3. Verificar que la base de datos existe:
   ```sql
   SHOW DATABASES;
   USE gestion_citas_db;
   SHOW TABLES;
   ```

4. Verificar variables de entorno del backend:
   ```cmd
   docker exec vetclinic-backend-dev env | findstr MYSQL
   ```

---

### Problema: Contenedor se detiene inmediatamente
**Síntomas:** `docker ps` no muestra el contenedor

**Solución:**
1. Ver logs:
   ```cmd
   docker logs <container_name>
   ```

2. Ver eventos:
   ```cmd
   docker events --since 5m
   ```

3. Inspeccionar contenedor:
   ```cmd
   docker inspect <container_name>
   ```

---

### Problema: Puerto ya en uso
**Síntomas:** "Bind for 0.0.0.0:3000 failed: port is already allocated"

**Solución:**
1. Identificar proceso usando el puerto:
   ```cmd
   netstat -ano | findstr :3000
   ```

2. Matar proceso:
   ```cmd
   taskkill /PID <PID> /F
   ```

3. O cambiar el puerto en docker-compose:
   ```yaml
   ports:
     - "3001:80"  # Usar 3001 en lugar de 3000
   ```

---

## 📝 DOCUMENTOS DE REFERENCIA

| Documento | Propósito | Estado |
|-----------|-----------|--------|
| `DOCKER_SETUP_GUIDE.md` | Guía inicial de dockerización | ✅ Completo |
| `CORRECCIONES_BUILD_APLICADAS.md` | Correcciones de build frontend | ✅ Completo |
| `FRONTEND_TEST_GUIDE.md` | Pruebas funcionales frontend | ⏳ Por ejecutar |
| `ENDPOINTS_PARA_BACKEND_MYSQL.md` | Documentación API backend | ✅ Completo |
| `PROMPT_BACKEND_MYSQL.md` | Configuración backend | ✅ Completo |
| `ESTRATEGIA_DE_ORQUESTACION.md` | Este documento | ✅ Completo |

---

## 🎯 MÉTRICAS DE ÉXITO

### FASE 1 (Desarrollo Local)
- ✅ Backend: 100% endpoints funcionales (26/26)
- 🔄 Frontend: Build exitoso (pendiente validación)
- ⏳ Integración: 0% (por iniciar)

### FASE 2 (Orquestación)
- ⏳ Docker Compose: 0% (por iniciar)
- ⏳ Networking: 0% (por iniciar)
- ⏳ Volúmenes: 50% (MySQL funcional)

### FASE 3 (Landing)
- ⏳ Landing dockerizada: 0% (por iniciar)
- ⏳ Integración con app: 0% (por iniciar)

### FASE 4 (Stack Completo)
- ⏳ Compose maestro: 0% (por iniciar)
- ⏳ Redes configuradas: 0% (por iniciar)
- ⏳ SSL/HTTPS: 0% (por iniciar)

### FASE 5 (Azure)
- ⏳ ACR configurado: 0% (por iniciar)
- ⏳ Container Apps: 0% (por iniciar)
- ⏳ Base de datos Azure: 0% (por iniciar)
- ⏳ Dominio configurado: 0% (por iniciar)

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Tareas | Duración | Estado |
|------|--------|----------|--------|
| 1A | Backend dockerizado | 2-3 horas | ✅ Completado |
| 1B | Correcciones frontend | 1 hora | ✅ Completado |
| 1C | Validación frontend | 30 min | 🔄 En progreso |
| 2 | Integración completa | 2 horas | ⏳ Pendiente |
| 3 | Landing page | 2 horas | ⏳ Pendiente |
| 4 | Compose maestro | 3 horas | ⏳ Pendiente |
| 5 | Despliegue Azure | 6 horas | ⏳ Pendiente |
| **TOTAL** | | **~17 horas** | **30% completado** |

---

## 🎯 ACCIÓN INMEDIATA REQUERIDA

### ⚡ PASO SIGUIENTE (AHORA MISMO):

```cmd
cd D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas

# 1. Limpiar
docker-compose -f docker-compose.dev.yml down

# 2. Build
docker-compose -f docker-compose.dev.yml build --no-cache frontend

# 3. Levantar
docker-compose -f docker-compose.dev.yml up -d frontend

# 4. Ver logs
docker logs vetclinic-frontend-dev

# 5. Probar
start http://localhost:3000
```

### ✅ Criterio de éxito:
- Build completa sin errores TS5083
- Contenedor corriendo
- Login accesible en puerto 3000

### ❌ Si falla:
- Consultar `CORRECCIONES_BUILD_APLICADAS.md`
- Verificar logs: `docker logs vetclinic-frontend-dev`
- Verificar archivos en contenedor: `docker exec vetclinic-frontend-dev ls -la /app/`

---

## 📞 SIGUIENTE ACTUALIZACIÓN

Después de ejecutar los comandos de la **Fase 1C**, reporta:

1. ✅ o ❌ Build exitoso
2. ✅ o ❌ Contenedor corriendo
3. ✅ o ❌ Puerto 3000 accesible
4. ✅ o ❌ Login funcional
5. ✅ o ❌ Conexión con backend

**Si todo es ✅:** Proceder a **FASE 2** (Integración)  
**Si algo es ❌:** Troubleshooting específico del problema

---

**🎉 DOCUMENTO MAESTRO COMPLETO - LISTO PARA EJECUTAR**

---

**Última actualización:** 2025-10-22  
**Versión:** 1.0  
**Autor:** GitHub Copilot (Agente Frontend + Backend)  
**Fases completadas:** 1A ✅, 1B ✅  
**Fase actual:** 1C 🔄  
**Progreso total:** 30%
# 🎯 ESTRATEGIA DE ORQUESTACIÓN COMPLETA - VETCLINIC

**Fecha de creación:** 2025-10-22  
**Proyecto:** Sistema de Gestión de Citas Veterinarias  
**Stack:** React + Spring Boot + MySQL + Docker

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ COMPLETADO (FASE 1A - Backend)
- [x] Backend Spring Boot dockerizado y funcional
- [x] MySQL dockerizado y funcional
- [x] 26 endpoints API validados exitosamente
- [x] Autenticación JWT funcionando
- [x] CORS configurado correctamente
- [x] Health checks implementados
- [x] Docker Compose para backend + MySQL

### ✅ COMPLETADO (FASE 1B - Frontend Correcciones)
- [x] Dockerfile optimizado con orden de COPY correcto
- [x] .dockerignore actualizado para no bloquear configuraciones
- [x] vite.config.ts optimizado para Docker
- [x] nginx.conf creado con configuración SPA completa
- [x] Archivos tsconfig verificados y accesibles

### 🔄 EN PROGRESO (FASE 1C - Validación Frontend)
- [ ] **Build de Docker del frontend** ← **PRÓXIMO PASO INMEDIATO**
- [ ] Prueba de acceso a http://localhost:3000
- [ ] Validación de login funcional
- [ ] Verificación de conexión Frontend ↔ Backend

### ⏳ PENDIENTE (FASE 2 - Integración Completa)
- [ ] Levantar stack completo con docker-compose
- [ ] Pruebas de integración Frontend + Backend
- [ ] Validación de flujos completos (cliente, veterinario, admin)
- [ ] Optimización de variables de entorno

### ⏳ PENDIENTE (FASE 3 - Landing Page)
- [ ] Dockerizar landing page
- [ ] Configurar nginx para landing
- [ ] Integrar landing con frontend de aplicación

### ⏳ PENDIENTE (FASE 4 - Orquestación Maestro)
- [ ] Crear docker-compose maestro (todos los servicios)
- [ ] Configurar redes Docker
- [ ] Configurar volúmenes persistentes
- [ ] Documentar arquitectura completa

### ⏳ PENDIENTE (FASE 5 - Despliegue Azure)
- [ ] Preparar imágenes para Azure
- [ ] Configurar Azure Container Registry
- [ ] Desplegar servicios en Azure
- [ ] Configurar dominios y SSL

---

## 🚀 COMANDOS PARA EJECUTAR AHORA (FASE 1C)

### Paso 1: Verificar Docker Desktop
```cmd
docker --version
docker info
```

**Criterio de éxito:** Docker responde sin errores

---

### Paso 2: Limpiar builds anteriores
```cmd
cd D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas

docker-compose -f docker-compose.dev.yml down
docker rmi frontend-gestion-citas-frontend 2>nul
```

**Criterio de éxito:** Contenedores detenidos, imágenes antiguas eliminadas

---

### Paso 3: Build del frontend (CON LAS CORRECCIONES APLICADAS)
```cmd
docker-compose -f docker-compose.dev.yml build --no-cache frontend
```

**Resultado esperado:**
```
[+] Building 120.5s (18/18) FINISHED
 => [builder 5/9] COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
 => [builder 6/9] COPY vite.config.ts ./
 => [builder 11/9] RUN npm run build
 ✔ built in 45s
Successfully built...
```

**❌ Si falla:** Revisar logs y consultar `CORRECCIONES_BUILD_APLICADAS.md`

**✅ Si tiene éxito:** Continuar al Paso 4

---

### Paso 4: Levantar contenedor frontend
```cmd
docker-compose -f docker-compose.dev.yml up -d frontend
```

**Criterio de éxito:**
```
✔ Container vetclinic-frontend-dev   Started
```

---

### Paso 5: Verificar logs
```cmd
docker logs vetclinic-frontend-dev
```

**Logs esperados:**
```
/docker-entrypoint.sh: Configuration complete; ready for start up
```

**Sin errores de:** TypeScript, npm, Vite, o nginx

---

### Paso 6: Probar acceso
```cmd
start http://localhost:3000
```

**Criterio de éxito:**
- ✅ Página de login carga
- ✅ Estilos CSS aplicados
- ✅ Sin errores en consola del navegador (F12)

---

### Paso 7: Probar login
```
Email: admin@clinicaveterinaria.com
Password: admin123
```

**Criterio de éxito:**
- ✅ Login exitoso
- ✅ Redirecciona a /admin/dashboard
- ✅ Token guardado en localStorage

---

### Paso 8: Verificar conexión Frontend → Backend

**Abrir DevTools (F12) > Network**

**Verificar:**
- ✅ Peticiones a `http://localhost:8080/api/...` se completan
- ✅ Sin errores de CORS
- ✅ Respuestas 200 OK
- ✅ Datos del backend se muestran en el dashboard

---

## 📋 CHECKLIST DE VALIDACIÓN COMPLETA (FASE 1C)

### Build y Contenedor
- [ ] Build de Docker completa sin errores TS5083
- [ ] Contenedor `vetclinic-frontend-dev` está corriendo
- [ ] Puerto 3000 accesible desde el host
- [ ] Nginx sirve archivos correctamente

### Frontend Funcional
- [ ] http://localhost:3000 carga la página de login
- [ ] Estilos CSS aplicados correctamente
- [ ] Formulario de login es interactivo
- [ ] Sin errores en consola del navegador

### Autenticación
- [ ] Login con credenciales de ADMIN funciona
- [ ] Login con credenciales de VETERINARIO funciona
- [ ] Login con credenciales de CLIENTE funciona
- [ ] Token JWT se guarda en localStorage
- [ ] Redirección según rol funciona

### Comunicación Backend
- [ ] Peticiones a /api/auth/login completan sin CORS
- [ ] Dashboard carga datos del backend
- [ ] Badges muestran contadores correctos
- [ ] Tablas cargan datos de MySQL

---

## 🎯 ROADMAP DETALLADO (TODAS LAS FASES)

### ✅ FASE 1A: BACKEND DOCKERIZADO (COMPLETADA)
**Duración:** Completada  
**Archivos creados:**
- `backend/Dockerfile`
- `backend/docker-compose.yml`
- `backend/application-docker.properties`

**Validación:**
- 26 endpoints probados con éxito
- MySQL persistente con volúmenes
- Health checks funcionando

---

### ✅ FASE 1B: CORRECCIONES FRONTEND (COMPLETADA)
**Duración:** Completada  
**Archivos modificados:**
- `frontend/Dockerfile` (orden de COPY optimizado)
- `frontend/.dockerignore` (permite tsconfig)
- `frontend/vite.config.ts` (config Docker)
- `frontend/nginx.conf` (creado, config SPA)

**Problema resuelto:**
```
❌ error TS5083: Cannot read file '/app/tsconfig.app.json'
✅ Archivos de configuración ahora accesibles en build
```

---

### 🔄 FASE 1C: VALIDACIÓN FRONTEND (EN PROGRESO)
**Duración estimada:** 15-30 minutos  
**Objetivo:** Confirmar que el frontend funciona en Docker

**Tareas:**
1. Build de Docker exitoso
2. Contenedor corriendo sin errores
3. Login funcional
4. Conexión con backend verificada

**Criterio de éxito:**
- Frontend accesible en http://localhost:3000
- Login con las 3 credenciales funciona
- Dashboard carga datos del backend
- Sin errores de CORS

**Documentos de referencia:**
- `CORRECCIONES_BUILD_APLICADAS.md`
- `FRONTEND_TEST_GUIDE.md`

---

### ⏳ FASE 2: INTEGRACIÓN FRONTEND + BACKEND
**Duración estimada:** 1-2 horas  
**Objetivo:** Stack completo funcionando con docker-compose

**Tareas:**
1. Actualizar `docker-compose.dev.yml` con 3 servicios:
   - MySQL (puerto 3306)
   - Backend (puerto 8080)
   - Frontend (puerto 3000)

2. Configurar redes Docker:
   ```yaml
   networks:
     vetclinic-network:
       driver: bridge
   ```

3. Configurar variables de entorno:
   - Frontend: `VITE_API_URL=http://backend:8080/api`
   - Backend: `MYSQL_HOST=mysql`

4. Configurar dependencias:
   ```yaml
   frontend:
     depends_on:
       - backend
   backend:
     depends_on:
       - mysql
   ```

5. Probar flujos completos:
   - Cliente: Ver mascotas, agendar cita
   - Veterinario: Ver citas del día, crear historia
   - Admin: Gestionar usuarios, ver todas las citas

**Comando único:**
```cmd
docker-compose -f docker-compose.dev.yml up -d
```

**Criterio de éxito:**
- 3 contenedores corriendo
- Frontend se conecta a backend por nombre de servicio
- Backend se conecta a MySQL
- Todos los flujos funcionan end-to-end

---

### ⏳ FASE 3: LANDING PAGE
**Duración estimada:** 1-2 horas  
**Objetivo:** Landing page dockerizada y accesible

**Estructura propuesta:**
```
landing-page/
├── Dockerfile
├── nginx-landing.conf
├── index.html
├── css/
├── js/
└── assets/
```

**Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY nginx-landing.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx-landing.conf:**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Redirigir /app a la aplicación frontend
    location /app {
        proxy_pass http://frontend:80;
    }
}
```

**Integración:**
- Landing en puerto 80
- Frontend en puerto 3000 (interno)
- Nginx de landing hace proxy a frontend en /app

---

### ⏳ FASE 4: DOCKER COMPOSE MAESTRO
**Duración estimada:** 2-3 horas  
**Objetivo:** Orquestación completa de todos los servicios

**Archivo:** `docker-compose.master.yml`

**Servicios:**
1. **MySQL** (mysql:8.0)
   - Puerto: 3306
   - Volumen: vetclinic-mysql-data
   - Red: backend-network

2. **Backend** (gestion-citas-backend:latest)
   - Puerto: 8080
   - Depende de: mysql
   - Red: backend-network, frontend-network
   - Health check: /actuator/health

3. **Frontend** (vetclinic-frontend:latest)
   - Puerto: 3000 (interno)
   - Depende de: backend
   - Red: frontend-network, public-network

4. **Landing** (vetclinic-landing:latest)
   - Puerto: 80 (público)
   - Depende de: frontend
   - Red: public-network
   - Proxy a /app → frontend

**Redes:**
```yaml
networks:
  backend-network:
    driver: bridge
  frontend-network:
    driver: bridge
  public-network:
    driver: bridge
```

**Volúmenes:**
```yaml
volumes:
  vetclinic-mysql-data:
    driver: local
  vetclinic-mysql-config:
    driver: local
```

**Variables de entorno:**
```yaml
# MySQL
MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE: gestion_citas_db

# Backend
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/gestion_citas_db
SPRING_PROFILES_ACTIVE: docker

# Frontend
VITE_API_URL: http://backend:8080/api
```

**Comando único:**
```cmd
docker-compose -f docker-compose.master.yml up -d
```

**Resultado:**
- Landing: http://localhost
- Frontend app: http://localhost/app

