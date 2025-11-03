### 📝 PROMPT PARA AGENTE FRONTEND

```markdown
# 🚀 TAREA: DOCKERIZAR Y CONECTAR FRONTEND CON BACKEND

## CONTEXTO ACTUAL
- Backend Spring Boot ya dockerizado: `http://localhost:8080/api`
- MySQL funcionando en Docker: puerto 3306
- 26 pruebas API exitosas validadas con Postman
- Frontend React con Vite existente en: `frontend-gestion-citas/`
- Dockerfile básico ya creado pero sin configuración de red

## OBJETIVO
Configurar el frontend para que funcione en Docker y se comunique con el backend dockerizado.

## TAREAS ESPECÍFICAS

### 1. CONFIGURAR VARIABLES DE ENTORNO
Crear/modificar `.env` files:

**Para desarrollo local (sin Docker):**
```env
VITE_API_URL=http://localhost:8080/api
```

**Para Docker (desarrollo):**
```env
VITE_API_URL=http://backend:8080/api
```

**Para Azure (producción):**
```env
VITE_API_URL=https://backend-vetclinic.azurewebsites.net/api
```

### 2. ACTUALIZAR DOCKERFILE
Asegurar que el Dockerfile:
- Use node:18-alpine como base
- Copie package.json y package-lock.json
- Instale dependencias con `npm ci`
- Copie código fuente
- Build la aplicación con `npm run build`
- Use nginx para servir archivos estáticos
- Exponga puerto 80

### 3. CREAR DOCKER-COMPOSE LOCAL
Crear `docker-compose.dev.yml` en `frontend-gestion-citas/`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vetclinic-frontend-dev
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://backend:8080/api
    networks:
      - vetclinic-network
    depends_on:
      - backend

  backend:
    image: gestion-citas-backend:latest
    container_name: vetclinic-backend-dev
    ports:
      - "8080:8080"
    networks:
      - vetclinic-network

networks:
  vetclinic-network:
    driver: bridge
```

### 4. CONFIGURAR NGINX
Crear `nginx.conf` en `frontend-gestion-citas/`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. COMANDOS DE PRUEBA
```bash
# Build y levantar solo frontend
docker-compose -f docker-compose.dev.yml build frontend
docker-compose -f docker-compose.dev.yml up frontend

# Verificar que responde
curl http://localhost:3000

# Verificar logs
docker logs vetclinic-frontend-dev
```

## CRITERIOS DE ÉXITO
- [ ] Frontend responde en `http://localhost:3000`
- [ ] Página de login carga correctamente
- [ ] Al hacer login, el frontend puede autenticarse contra `http://backend:8080/api/auth/login`
- [ ] Dashboard carga datos desde el backend
- [ ] No hay errores de CORS
- [ ] Logs de Docker muestran comunicación exitosa

## ENTREGABLES
1. `.env.development` y `.env.production` configurados
2. `Dockerfile` optimizado para producción
3. `nginx.conf` con proxy reverso
4. `docker-compose.dev.yml` funcional
5. Documentación de comandos de prueba
6. Capturas de pantalla de frontend funcionando
```

---