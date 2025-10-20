# 🚀 QUICKSTART - Frontend Gestión Citas Dockerizado

## 📋 Resumen

Este frontend React se dockeriza con **nginx** para servir los archivos estáticos de forma eficiente en producción.

**Arquitectura:**
- 🌐 Landing-Page (HTML) → `http://localhost/`
- ⚛️ Frontend React (SPA) → `http://localhost/app`
- 🔧 Backend API (Spring Boot) → `http://localhost/api`

---

## 🛠️ Prerrequisitos

- Docker 20.10+
- Docker Compose 2.0+
- Backend corriendo (vetcare-backend:8080)
- Landing-page corriendo (vetcare-nginx:80)

---

## 📦 Estructura de Archivos

```
frontend/
├── Dockerfile                    # Build multi-stage con nginx
├── .dockerignore                 # Excluye node_modules, dist, etc.
├── nginx.conf                    # Configuración nginx para la SPA
├── nginx-landing.conf            # Configuración para landing-page (proxy)
├── docker-compose.snippet.yml    # Snippet para integrar
└── QUICKSTART.md                 # Este archivo
```

---

## 🚀 Opción 1: Build y Run Manual

### Paso 1: Construir la imagen

```powershell
cd D:\Downloads\Chagpt5ClinicVet\frontend
docker build -t frontend-gestion-citas:prod .
```

**Resultado esperado:**
```
[+] Building 45.2s (14/14) FINISHED
 => => naming to docker.io/library/frontend-gestion-citas:prod
```

### Paso 2: Ejecutar contenedor standalone

```powershell
docker run --rm -p 5173:80 --name frontend-gestion-citas frontend-gestion-citas:prod
```

### Paso 3: Verificar

Abrir navegador: `http://localhost:5173`

**Deberías ver:** La aplicación React funcionando ✅

---

## 🐳 Opción 2: Docker Compose (Recomendado)

### Paso 1: Integrar snippet en docker-compose.yml principal

Copia el contenido de `docker-compose.snippet.yml` al archivo principal `docker-compose.yml` del proyecto (junto con backend, nginx, etc.)

### Paso 2: Levantar todos los servicios

```powershell
cd D:\Downloads\Chagpt5ClinicVet
docker compose up -d
```

### Paso 3: Verificar estado

```powershell
docker compose ps
```

**Resultado esperado:**
```
NAME                        IMAGE                          STATUS
frontend-gestion-citas      frontend-gestion-citas         Up (healthy)
vetcare-backend             vetcare-backend                Up (healthy)
vetcare-nginx               nginx:alpine                   Up
```

### Paso 4: Ver logs

```powershell
# Logs del frontend
docker compose logs -f frontend-gestion-citas

# Logs de todos los servicios
docker compose logs -f
```

---

## 🌐 Rutas de Acceso

| Componente       | URL                          | Descripción                    |
|------------------|------------------------------|--------------------------------|
| Landing-Page     | `http://localhost/`          | Página HTML estática          |
| Frontend React   | `http://localhost/app`       | Aplicación SPA (dashboard)    |
| Backend API      | `http://localhost/api`       | Endpoints REST del backend    |
| Health Frontend  | `http://localhost/app/health`| Verificación de salud         |

---

## 🔧 Configuración de nginx en Landing-Page

**IMPORTANTE:** La landing-page debe tener esta configuración en su `nginx.conf`:

```nginx
# Proxy a frontend React
location /app {
    rewrite ^/app/(.*)$ /$1 break;
    rewrite ^/app$ / break;
    proxy_pass http://frontend-gestion-citas:80;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Proxy a backend API
location /api {
    proxy_pass http://vetcare-backend:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**Archivo de referencia:** `nginx-landing.conf` (copia este contenido al nginx de la landing)

---

## 🧪 Verificación de Funcionalidad

### Test 1: Frontend responde

```powershell
curl http://localhost/app
```

**Esperado:** HTML de la SPA con `<div id="root">`

### Test 2: Healthcheck

```powershell
docker inspect frontend-gestion-citas | findstr "Health"
```

**Esperado:** `"Status": "healthy"`

### Test 3: Logs sin errores

```powershell
docker compose logs frontend-gestion-citas | findstr "error"
```

**Esperado:** Sin errores críticos

---

## 🐛 Solución de Problemas

### Problema 1: `404 Not Found` en `/app`

**Causa:** nginx de landing no está configurado correctamente

**Solución:**
```powershell
# Verificar que vetcare-nginx use nginx-landing.conf
docker exec vetcare-nginx cat /etc/nginx/conf.d/default.conf
```

### Problema 2: `502 Bad Gateway`

**Causa:** Frontend no está corriendo o red Docker incorrecta

**Solución:**
```powershell
# Verificar estado
docker compose ps frontend-gestion-citas

# Verificar red
docker network inspect vetcare-network
```

### Problema 3: Rutas de React Router devuelven 404

**Causa:** nginx del frontend no tiene `try_files` correcto

**Solución:** Verificar que `nginx.conf` tenga:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 📸 Capturas para Evidencia (QA - Melisa)

### Captura 1: docker compose ps
```powershell
docker compose ps
```
📷 Capturar salida mostrando servicios `Up (healthy)`

### Captura 2: Landing-Page
Abrir `http://localhost/` en navegador
📷 Capturar página HTML funcionando

### Captura 3: Frontend React
Abrir `http://localhost/app` en navegador
📷 Capturar dashboard de la clínica veterinaria

### Captura 4: Backend API
```powershell
curl http://localhost/api/auth/health
```
📷 Capturar respuesta JSON

### Captura 5: Logs limpios
```powershell
docker compose logs --tail=50 frontend-gestion-citas
```
📷 Capturar logs sin errores críticos

---

## 🛑 Detener Servicios

```powershell
# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes
docker compose down -v

# Detener solo frontend
docker compose stop frontend-gestion-citas
```

---

## 🔄 Rebuild después de cambios

```powershell
# Rebuild solo frontend
docker compose build frontend-gestion-citas

# Rebuild y reiniciar
docker compose up -d --build frontend-gestion-citas
```

---

## 📊 Diferencias: H2 vs MySQL en Dockerización

### ✅ Backend Actual (H2 en memoria)

**Ventajas:**
- ✅ No requiere contenedor MySQL separado
- ✅ Menos complejidad en docker-compose
- ✅ Datos resetean al reiniciar (útil para demos)

**docker-compose.yml simplificado:**
```yaml
services:
  vetcare-backend:
    build: ./backend
    environment:
      - SPRING_PROFILES_ACTIVE=dev
    # NO necesita depends_on: mysql
```

### 🔄 Si fuera MySQL

**Requeriría:**
```yaml
services:
  vetcare-mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: vetcare_db
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"

  vetcare-backend:
    depends_on:
      - vetcare-mysql
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://vetcare-mysql:3306/vetcare_db
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=rootpass

volumes:
  mysql-data:
```

**Desventajas:**
- ❌ Más lento al iniciar
- ❌ Requiere gestión de volúmenes
- ❌ Mayor consumo de recursos

**Recomendación:** Para evidencias del SENA, **H2 es suficiente y más práctico** ✅

---

## 📞 Contacto Equipo

- **Frontend:** [Tu nombre]
- **Backend:** [Nombre del responsable]
- **QA/Testing:** Melisa
- **Infraestructura:** [Responsable Docker]

---

## ✅ Checklist Final

Antes de entregar evidencias:

- [ ] `docker compose ps` muestra todos los servicios `Up (healthy)`
- [ ] `http://localhost/` muestra landing-page
- [ ] `http://localhost/app` muestra frontend React
- [ ] `http://localhost/api/auth/health` responde JSON
- [ ] Login funciona en `http://localhost/app`
- [ ] No hay errores en `docker compose logs`
- [ ] Capturas de pantalla tomadas
- [ ] README.md actualizado con instrucciones

---

**Fecha de creación:** 2025-01-11  
**Versión:** 1.0.0  
**Evidencia:** GA7-220501096-AA4-EV03
