// Cambiar de:
fetch('http://localhost:8080/api/auth/login', { ... })

// A:
fetch('/api/auth/login', { ... })
```

---

## 3️⃣ ACTUALIZAR DOCKERFILE (Verificar)

**Archivo:** `frontend-gestion-citas/Dockerfile`

Asegúrate de que tenga esta estructura:

```dockerfile
# ========== STAGE 1: Build ==========
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar archivos de configuración
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./

# Copiar código fuente
COPY src ./src
COPY public ./public

# Build de producción
RUN npm run build

# ========== STAGE 2: Serve ==========
FROM nginx:alpine

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4️⃣ VERIFICAR .DOCKERIGNORE

**Archivo:** `frontend-gestion-citas/.dockerignore`

Asegúrate de que NO bloquee archivos necesarios:

```
# ✅ BLOQUEAR ESTOS:
node_modules
npm-debug.log
dist
build
.vite
.env.local
.env.development.local
.vscode
.idea
.git
.gitignore
README.md
docker-compose*.yml
.dockerignore

# ❌ NO BLOQUEAR ESTOS (deben estar disponibles):
# tsconfig*.json
# vite.config.ts
# index.html
# src/
# public/
# package.json
# package-lock.json
```

---

## 5️⃣ ELIMINAR DOCKER-COMPOSE.DEV.YML (Ya no se usa)

**Acción:** Eliminar o renombrar el archivo `frontend-gestion-citas/docker-compose.dev.yml`

**Razón:** Ahora usamos `docker-compose.full.yml` en la raíz del proyecto que orquesta TODO.

```powershell
# Opcional: renombrar por si se necesita después
mv docker-compose.dev.yml docker-compose.dev.yml.backup
```

---

## 🧪 PRUEBAS LOCALES DEL FRONTEND

### Antes de integrar con docker-compose.full.yml:

```powershell
# En la carpeta frontend-gestion-citas/

# 1. Asegúrate de que el backend esté corriendo
# (En otra terminal, en la carpeta gestion-citas/)
docker-compose up -d

# 2. Build de la imagen del frontend
docker build -t vetclinic-frontend:test .

# 3. Ejecutar contenedor de prueba
docker run -d \
  --name frontend-test \
  -p 3001:80 \
  --add-host=host.docker.internal:host-gateway \
  vetclinic-frontend:test

# 4. Probar en el navegador
start http://localhost:3001

# 5. Ver logs
docker logs frontend-test -f

# 6. Limpiar después de probar
docker stop frontend-test
docker rm frontend-test
```

---

## 🚀 INTEGRACIÓN FINAL

Una vez que confirmes que el frontend funciona con los cambios:

### El backend ejecutará:

```powershell
cd gestion-citas
.\start.ps1
```

**Esto levantará automáticamente:**
- MySQL (puerto 3306)
- Backend (puerto 8080)
- Frontend (puerto 3000) ← **TU CONTENEDOR**

### URLs finales:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **MySQL:** localhost:3306

---

## ✅ CHECKLIST DE VALIDACIÓN

Antes de confirmar los cambios, verifica:

- [ ] `nginx.conf` actualizado con proxy al backend
- [ ] Código frontend usa rutas relativas (`/api/...`)
- [ ] `Dockerfile` tiene multi-stage build correcto
- [ ] `.dockerignore` no bloquea archivos necesarios
- [ ] Build local exitoso: `docker build -t vetclinic-frontend:test .`
- [ ] Contenedor corre sin errores: `docker run -p 3001:80 vetclinic-frontend:test`
- [ ] Página de login carga en http://localhost:3001
- [ ] Login funciona y conecta con backend
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores de CORS

---

## 🐛 TROUBLESHOOTING

### Error: "ERR_FAILED http://localhost:8080/api/..."
**Causa:** El código aún usa URL absoluta en lugar de relativa.

**Solución:** Cambiar todas las llamadas a la API:
```typescript
// ❌ INCORRECTO
fetch('http://localhost:8080/api/auth/login')

// ✅ CORRECTO
fetch('/api/auth/login')
```

---

### Error: "502 Bad Gateway" en /api/...
**Causa:** Nginx no puede alcanzar el backend en `host.docker.internal:8080`.

**Solución Windows:** Verificar que el backend esté corriendo:
```powershell
curl http://localhost:8080/actuator/health
```

**Solución Linux/Mac:** Cambiar en `nginx.conf`:
```nginx
# Cambiar:
proxy_pass http://host.docker.internal:8080/api/;

# Por:
proxy_pass http://172.17.0.1:8080/api/;  # IP del host en Docker
```

---

### Error: "Cannot read tsconfig.app.json"
**Causa:** `.dockerignore` está bloqueando archivos de configuración.

**Solución:** Verificar que `.dockerignore` NO incluya:
```
# NO DEBE ESTAR:
# tsconfig*.json
```

---

### El contenedor no inicia
**Debug:**
```powershell
# Ver logs detallados
docker logs vetclinic-frontend

# Ejecutar en modo interactivo
docker run -it --rm vetclinic-frontend:test sh

# Dentro del contenedor, verificar archivos
ls -la /usr/share/nginx/html/
cat /etc/nginx/conf.d/default.conf
```

---

## 📊 ARQUITECTURA FINAL

```
┌─────────────────────────────────────┐
│  NAVEGADOR                          │
│  http://localhost:3000              │
└─────────────┬───────────────────────┘
              │
              │ HTTP Request: /api/login
              │
┌─────────────▼───────────────────────┐
│  NGINX (Frontend Container)         │
│  - Sirve archivos estáticos React   │
│  - Proxy /api/* → backend           │
└─────────────┬───────────────────────┘
              │
              │ proxy_pass
              │
┌─────────────▼───────────────────────┐
│  host.docker.internal:8080          │
│  Backend Spring Boot                │
└─────────────┬───────────────────────┘
              │
              │ JDBC
              │
┌─────────────▼───────────────────────┐
│  MySQL Container                    │
└─────────────────────────────────────┘
```

---

## 📝 COMMITS RECOMENDADOS

Después de aplicar los cambios:

```powershell
git add nginx.conf Dockerfile .dockerignore src/
git commit -m "feat: configurar nginx proxy y rutas relativas API

- Actualizar nginx.conf con proxy al backend
- Cambiar llamadas API a rutas relativas
- Optimizar Dockerfile multi-stage
- Actualizar .dockerignore"

git push origin main
```

---

## 🎯 RESULTADO ESPERADO

Después de aplicar estos cambios, el backend podrá ejecutar:

```powershell
.\start.ps1
```

Y TODO funcionará integrado:
- ✅ Frontend carga en http://localhost:3000
- ✅ Login funciona
- ✅ Dashboard carga datos del backend
- ✅ No hay errores de CORS
- ✅ No hay errores de conexión

---

## 📞 SOPORTE

Si tienes dudas o problemas:
1. Revisa los logs: `docker logs vetclinic-frontend -f`
2. Verifica la red: `docker network inspect vetclinic-network`
3. Prueba conectividad: `docker exec vetclinic-frontend wget -O- http://host.docker.internal:8080/actuator/health`

---

**Última actualización:** 2025-10-22  
**Versión:** 1.0 - Integración con docker-compose.full.yml  
**Autor:** Equipo Backend - Sistema Clínica Veterinaria
# 🎨 INSTRUCCIONES PARA EL EQUIPO FRONTEND

## 🎯 OBJETIVO
Integrar el frontend React con el sistema dockerizado del backend usando `docker-compose.full.yml`.

---

## 📋 CAMBIOS REQUERIDOS EN EL FRONTEND

### ✅ ESTADO ACTUAL
- Dockerfile creado ✅
- Frontend funciona standalone ✅
- Build de TypeScript corregido ✅

### 🔧 CAMBIOS NECESARIOS

---

## 1️⃣ ACTUALIZAR NGINX.CONF

**Archivo:** `frontend-gestion-citas/nginx.conf`

**Reemplazar TODO el contenido con:**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # ========== FRONTEND ROUTES ==========
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ========== PROXY AL BACKEND ==========
    # Esto permite que las peticiones a /api/* se redirijan al backend
    location /api/ {
        # host.docker.internal permite acceder al host desde el contenedor
        proxy_pass http://host.docker.internal:8080/api/;
        
        # Headers necesarios para el proxy
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Headers CORS (por si el backend no los envía)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        # Responder a preflight requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # ========== HEALTH CHECK ==========
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

**📝 ¿Por qué este cambio?**
- Permite que el frontend haga peticiones a `/api/...` (ruta relativa)
- Nginx redirige automáticamente al backend en `http://host.docker.internal:8080/api/`
- Soluciona problemas de CORS
- Facilita el cambio entre ambientes (dev, producción)

---

## 2️⃣ ACTUALIZAR CONFIGURACIÓN DE API EN EL CÓDIGO

**Opción A: Si usas archivo de configuración (config.ts/js)**

```typescript
// frontend-gestion-citas/src/config/api.config.ts
export const API_CONFIG = {
  // En Docker, usa ruta relativa (nginx hace el proxy)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

**Opción B: Si usas axios directamente**

```typescript
// frontend-gestion-citas/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // ✅ Ruta relativa, nginx hace el proxy
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Opción C: Si usas fetch directamente**

```typescript

