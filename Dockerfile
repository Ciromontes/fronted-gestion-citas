# ============================================
# Dockerfile para Frontend React (VetCare)
# Build multi-stage: node para build + nginx para servir
# ============================================

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
