# 🔒 Guía de Seguridad - Git y Despliegue

## ⚠️ ARCHIVOS QUE NUNCA DEBES SUBIR A GIT

### 1. Variables de Entorno (.env)
**Archivo:** `.env`, `.env.local`, `.env.production`

❌ **NO SUBIR:**
```env
VITE_API_BASE_URL=http://mi-servidor-real.com
VITE_JWT_SECRET=mi-clave-super-secreta-12345
```

✅ **SÍ SUBIR:** `.env.example` (sin datos reales)
```env
VITE_API_BASE_URL=http://localhost:8080
```

**¿Por qué?** Pueden contener URLs de producción, tokens, y claves secretas.

---

### 2. Dependencias (node_modules)
**Carpeta:** `node_modules/`

❌ **NO SUBIR:** Esta carpeta pesa cientos de MB y se regenera con `npm install`

✅ **SÍ SUBIR:** `package.json` y `package-lock.json`

---

### 3. Build Artifacts (dist/)
**Carpeta:** `dist/`, `build/`

❌ **NO SUBIR:** Archivos compilados que se generan con `npm run build`

**¿Por qué?** Se regeneran en cada deploy y ocupan mucho espacio.

---

### 4. Archivos del Sistema Operativo
❌ **NO SUBIR:**
- `.DS_Store` (macOS)
- `Thumbs.db` (Windows)
- `desktop.ini` (Windows)

**¿Por qué?** Son archivos del sistema que no tienen utilidad para el proyecto.

---

### 5. Configuración del IDE
❌ **NO SUBIR (mayormente):**
- `.idea/` (IntelliJ IDEA)
- `.vscode/` (excepto `extensions.json`)
- `*.iml`

**¿Por qué?** Son configuraciones personales que varían entre desarrolladores.

---

## ✅ ARCHIVOS QUE SÍ DEBES SUBIR

### Configuración de Ejemplo
- ✅ `.env.example` - Plantilla sin datos sensibles
- ✅ `README.md` - Documentación
- ✅ `package.json` - Dependencias del proyecto
- ✅ `Dockerfile` - Configuración de contenedor
- ✅ `docker-compose.yml` - Orquestación
- ✅ `.gitignore` - Reglas de exclusión
- ✅ Todo el código fuente en `src/`

---

## 🚨 SI YA SUBISTE ARCHIVOS SENSIBLES

### Eliminar archivo del historial de Git:

```bash
# 1. Eliminar del índice (mantener en local)
git rm --cached .env

# 2. Hacer commit
git commit -m "Remove sensitive .env file"

# 3. Agregar al .gitignore
echo .env >> .gitignore

# 4. Commit del .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"

# 5. Push
git push origin main
```

### ⚠️ IMPORTANTE:
Si subiste contraseñas o tokens, **CÁMBIALOS INMEDIATAMENTE** aunque los elimines del repositorio, ya que quedan en el historial.

---

## 📋 Checklist Antes de Hacer Push

Antes de ejecutar `git push`, verifica:

- [ ] ¿El archivo `.env` está en el `.gitignore`?
- [ ] ¿Solo está versionado `.env.example`?
- [ ] ¿No hay contraseñas en el código?
- [ ] ¿No hay tokens o API keys hardcodeadas?
- [ ] ¿La carpeta `node_modules` no está incluida?
- [ ] ¿La carpeta `dist` no está incluida?

---

## 🔐 Buenas Prácticas de Seguridad

### 1. Usa Variables de Entorno
```typescript
// ❌ MAL
const API_URL = "http://mi-servidor.com";
const API_KEY = "abc123xyz";

// ✅ BIEN
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

### 2. Nunca Hardcodees Credenciales
```typescript
// ❌ MAL
const password = "admin123";

// ✅ BIEN
// Las credenciales se envían desde el login, nunca se almacenan en código
```

### 3. Usa .env.example como Plantilla
Mantén actualizado `.env.example` con todas las variables necesarias pero SIN valores reales.

### 4. No Comitees Logs con Información Sensible
Si generas logs, asegúrate de que no contengan tokens, contraseñas o datos de usuarios.

---

## 🛡️ Protección del Backend

Si tienes un backend (Spring Boot, Node.js, etc.), asegúrate de tener un `.gitignore` similar:

### Backend Spring Boot - NO SUBIR:
- ❌ `application.properties` (con contraseñas de BD)
- ❌ `application-prod.properties`
- ❌ `target/` (build de Maven)
- ❌ `.mvn/`

### Backend Spring Boot - SÍ SUBIR:
- ✅ `application.properties.example`
- ✅ `pom.xml`
- ✅ Código fuente en `src/`

---

## 📞 En Caso de Emergencia

### Si accidentalmente subiste credenciales:

1. **Cambiar inmediatamente** todas las contraseñas/tokens comprometidos
2. Eliminar el archivo del repositorio (ver comandos arriba)
3. Limpiar el historial de Git (avanzado)
4. Rotar credenciales de bases de datos
5. Revisar logs de acceso por actividad sospechosa

---

## 📚 Referencias

- [GitHub - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [gitignore.io](https://www.toptal.com/developers/gitignore) - Generador de .gitignore
- [OWASP - Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

---

**Fecha:** Enero 2025  
**Proyecto:** GA7-220501096-AA4-EV03

