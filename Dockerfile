# ============================================
# Dockerfile para Frontend React (VetCare)
# Build multi-stage: node para build + nginx para servir
# ============================================

# ===== STAGE 1: Build =====
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache)
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para tsc/vite)
RUN npm ci

# Copiar archivos de configuración de TypeScript (requeridos por 'tsc -b')
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./

# Copiar configuración de Vite
COPY vite.config.ts ./

# Copiar archivos HTML de entrada
COPY index.html ./

# Copiar código fuente y assets
COPY src ./src
COPY public ./public

# Construir la aplicación para producción
RUN npm run build

# ===== STAGE 2: Servidor nginx =====
FROM nginx:alpine

# Copiar configuración personalizada de nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos build desde stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Healthcheck para verificar que nginx responde
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando por defecto (nginx en foreground)
CMD ["nginx", "-g", "daemon off;"]
