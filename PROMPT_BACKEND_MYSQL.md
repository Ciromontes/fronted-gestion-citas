# 🔄 PROMPT PARA CORRECCIÓN DEL BACKEND - Migración H2 a MySQL

## 📋 Contexto

El backend actual usa **H2 (base de datos en memoria)** que:
- ✅ **Ventaja:** Simple, no requiere servidor MySQL externo
- ❌ **Desventaja:** Datos se pierden al reiniciar el contenedor

Para un entorno de producción real con Docker, necesitamos migrar a **MySQL** para persistencia de datos.

---

## 🎯 Objetivo

Actualizar el backend Spring Boot para usar MySQL en lugar de H2, con configuración lista para Docker Compose.

---

## 📝 CAMBIOS NECESARIOS EN EL BACKEND

### 1. Actualizar `pom.xml` (si usa Maven)

**ANTES (H2):**
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

**DESPUÉS (MySQL):**
```xml
<!-- Eliminar H2 -->
<!-- <dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency> -->

<!-- Agregar MySQL -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

### 2. Actualizar `application.properties` o `application.yml`

**ANTES (H2):**
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

**DESPUÉS (MySQL con variables de entorno):**
```properties
# MySQL Configuration
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/vetcare_db}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:rootpass}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# MySQL specific settings
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

---

### 3. Crear archivo `application-docker.properties` (perfil Docker)

```properties
# Profile específico para Docker Compose
spring.datasource.url=jdbc:mysql://vetcare-mysql:3306/vetcare_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=rootpass
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

---

### 4. Actualizar `Dockerfile` del backend

**Agregar variable de entorno:**

```dockerfile
# ... resto del Dockerfile ...

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=docker
ENV DB_URL=jdbc:mysql://vetcare-mysql:3306/vetcare_db
ENV DB_USERNAME=root
ENV DB_PASSWORD=rootpass

# ... resto del Dockerfile ...
```

---

### 5. Actualizar `docker-compose.yml` - Agregar MySQL

**NUEVO SERVICIO MySQL:**

```yaml
services:
  # ===== BASE DE DATOS MYSQL =====
  vetcare-mysql:
    image: mysql:8.0
    container_name: vetcare-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: vetcare_db
      MYSQL_USER: vetcare_user
      MYSQL_PASSWORD: vetcare123
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - vetcare-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-prootpass"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    labels:
      - "com.vetcare.description=Base de datos MySQL"
      - "com.vetcare.service=database"

  # ===== BACKEND SPRING BOOT (actualizado) =====
  vetcare-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: vetcare-backend
    restart: unless-stopped
    depends_on:
      vetcare-mysql:
        condition: service_healthy
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DB_URL=jdbc:mysql://vetcare-mysql:3306/vetcare_db
      - DB_USERNAME=root
      - DB_PASSWORD=rootpass
    ports:
      - "8080:8080"
    networks:
      - vetcare-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    labels:
      - "com.vetcare.description=Backend Spring Boot"
      - "com.vetcare.service=backend"

volumes:
  mysql-data:
    driver: local

networks:
  vetcare-network:
    driver: bridge
```

---

### 6. Script SQL de Inicialización (Opcional)

Crear `backend/src/main/resources/db/init.sql` para datos iniciales:

```sql
-- Script de inicialización para MySQL
-- Se ejecuta automáticamente al crear la base de datos

-- Crear tabla usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('CLIENTE', 'VETERINARIO', 'RECEPCIONISTA', 'ADMIN') NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto
INSERT INTO usuarios (nombre, email, password, rol, activo)
VALUES ('Administrador', 'admin@clinicaveterinaria.com', '$2a$10$hashedpassword', 'ADMIN', true)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ... más tablas según tu modelo de datos ...
```

---

## 🔄 MIGRACIÓN DE DATOS H2 A MYSQL

### Opción 1: Export/Import Manual

```sql
-- 1. Exportar datos de H2 (ejecutar en consola H2)
SCRIPT TO 'backup.sql';

-- 2. Adaptar sintaxis a MySQL (reemplazar tipos de datos)
-- H2: TIMESTAMP → MySQL: DATETIME
-- H2: BOOLEAN → MySQL: TINYINT(1)

-- 3. Importar en MySQL
mysql -u root -p vetcare_db < backup.sql
```

### Opción 2: Usar Liquibase o Flyway (Recomendado)

Agregar en `pom.xml`:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

Crear scripts en `src/main/resources/db/migration/`:
- `V1__Create_tables.sql`
- `V2__Insert_initial_data.sql`

---

## 📊 COMPARACIÓN: H2 vs MySQL EN DOCKER

### ✅ Backend Actual (H2 en memoria)

**docker-compose.yml simplificado:**
```yaml
services:
  vetcare-backend:
    build: ./backend
    ports:
      - "8080:8080"
    # NO necesita MySQL
```

**Pros:**
- ✅ Menos complejidad
- ✅ Inicio rápido
- ✅ Ideal para demos/evidencias

**Contras:**
- ❌ Datos se pierden al reiniciar
- ❌ No es production-ready
- ❌ Limitaciones de concurrencia

---

### 🔄 Backend con MySQL

**docker-compose.yml con MySQL:**
```yaml
services:
  vetcare-mysql:
    image: mysql:8.0
    volumes:
      - mysql-data:/var/lib/mysql
    # Persistencia de datos

  vetcare-backend:
    depends_on:
      - vetcare-mysql
    environment:
      - DB_URL=jdbc:mysql://vetcare-mysql:3306/vetcare_db
```

**Pros:**
- ✅ Persistencia real de datos
- ✅ Production-ready
- ✅ Mejor rendimiento en concurrencia
- ✅ Backups y recuperación

**Contras:**
- ❌ Mayor complejidad inicial
- ❌ Más lento al iniciar (espera a MySQL)
- ❌ Requiere gestión de volúmenes

---

## 🎯 RECOMENDACIÓN PARA EVIDENCIA SENA

### Para Evidencia GA7-220501096-AA4-EV03:

**USAR H2 (configuración actual) ✅**

**Razones:**
1. ✅ Más simple para demostraciones
2. ✅ No requiere gestión de base de datos
3. ✅ Inicia más rápido (importante en demos)
4. ✅ Suficiente para propósitos académicos
5. ✅ Menos variables que pueden fallar

### Para Producción Real:

**MIGRAR A MYSQL** siguiendo los pasos de este prompt.

---

## 🧪 TESTING DESPUÉS DE LA MIGRACIÓN

### Test 1: Verificar conexión MySQL

```powershell
docker exec -it vetcare-mysql mysql -u root -p
# Ingresar password: rootpass

mysql> SHOW DATABASES;
mysql> USE vetcare_db;
mysql> SHOW TABLES;
```

### Test 2: Verificar logs del backend

```powershell
docker compose logs vetcare-backend | findstr "MySQL"
```

**Esperado:** `HikariPool-1 - Start completed.`

### Test 3: Probar endpoints

```powershell
curl http://localhost:8080/api/auth/health
```

### Test 4: Verificar persistencia

```powershell
# 1. Crear un usuario
curl -X POST http://localhost:8080/api/usuarios -H "Content-Type: application/json" -d "{...}"

# 2. Reiniciar backend
docker compose restart vetcare-backend

# 3. Verificar que el usuario sigue existiendo
curl http://localhost:8080/api/usuarios
```

---

## ✅ CHECKLIST DE MIGRACIÓN

- [ ] Agregar dependencia `mysql-connector-j` en `pom.xml`
- [ ] Actualizar `application.properties` con configuración MySQL
- [ ] Crear `application-docker.properties` para Docker
- [ ] Actualizar `Dockerfile` con variables de entorno
- [ ] Agregar servicio `vetcare-mysql` en `docker-compose.yml`
- [ ] Agregar volumen `mysql-data` para persistencia
- [ ] Configurar `depends_on` en backend
- [ ] Probar conexión local primero
- [ ] Probar con Docker Compose
- [ ] Verificar logs sin errores
- [ ] Probar persistencia de datos
- [ ] Actualizar README.md con instrucciones MySQL

---

## 📞 DECISIÓN FINAL

**¿Deberías migrar a MySQL ahora?**

### SÍ, si:
- ✅ Vas a desplegar en producción real
- ✅ Necesitas persistencia de datos
- ✅ Tienes tiempo para probar y debuggear

### NO, si:
- ❌ Solo necesitas evidencia académica
- ❌ Estás cerca de la fecha de entrega
- ❌ H2 ya funciona correctamente

**Para GA7-220501096-AA4-EV03 → MANTENER H2** es la opción más segura ✅

---

## 📝 COMANDO RÁPIDO SI DECIDES MIGRAR

```powershell
# 1. Actualizar pom.xml y properties
# 2. Rebuild backend
cd backend
mvn clean package -DskipTests

# 3. Agregar MySQL a docker-compose
# (copiar bloque de arriba)

# 4. Levantar servicios
cd ..
docker compose up -d

# 5. Verificar
docker compose ps
docker compose logs -f
```

---

**Fecha:** 2025-01-11  
**Versión:** 1.0.0  
**Propósito:** Guía de migración H2 → MySQL para VetCare Backend

