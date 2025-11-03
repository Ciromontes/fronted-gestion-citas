# ⏰ INSTRUCCIONES - Después de 15-20 Minutos

## 🔍 PASO 1: Verificar GitHub Actions

Abre este link y verifica que el último workflow tenga ✅ verde:
```
https://github.com/Ciromontes/fronted-gestion-citas/actions
```

Busca el workflow con mensaje: **"fix: Actualizar todos los endpoints..."**

---

## 🌐 PASO 2: Abrir Frontend en Modo Privado

Ejecuta este comando en PowerShell:

```powershell
Start-Process "msedge" -ArgumentList "--inprivate", "https://brave-island-0600c480f.3.azurestaticapps.net"
```

**¿Por qué modo privado?**
- Evita caché local del navegador
- Asegura que veas la última versión desplegada

---

## 🔧 PASO 3: Verificar que Apunta a Azure (NO localhost)

### 3.1 Abrir Herramientas de Desarrollador
1. Presiona **F12** en el navegador
2. Ve a pestaña **"Network"** (Red)
3. Asegúrate que esté grabando (botón rojo arriba)

### 3.2 Intentar Login
1. Ingresa credenciales de cualquier usuario
2. **Mira en la pestaña Network** las peticiones HTTP

### 3.3 Verificar URLs
**✅ CORRECTO (debe verse así):**
```
https://vetclinic-backend-2025.azurewebsites.net/api/auth/login  → 200 OK
https://vetclinic-backend-2025.azurewebsites.net/api/mascotas/mias  → 200 OK
https://vetclinic-backend-2025.azurewebsites.net/api/citas/mis-citas  → 200 OK
```

**❌ INCORRECTO (si vez esto, hay problema):**
```
http://localhost:8080/api/auth/login  → ERR_CONNECTION_REFUSED
```

---

## ✅ PASO 4: Probar Funcionalidades

### 4.1 Login
```
✅ Debe permitir login
✅ No debe mostrar "Network Error"
✅ Debe redirigir al dashboard
```

### 4.2 Dashboard Cliente
```
✅ Debe cargar mascotas (no "No se pudieron cargar tus mascotas")
✅ Debe poder agendar citas
✅ Debe listar veterinarios disponibles
```

### 4.3 Consola del Navegador (F12 → Console)
```
✅ Debe ver: "🔄 Cargando mascotas..."
✅ Debe ver: "✅ Mascotas mapeadas: [...]"
❌ NO debe ver: "❌ Error cargando mascotas: Network Error"
```

---

## 🚨 SI AÚN NO FUNCIONA

### Opción 1: Esperar un poco más
El CDN de Azure puede tardar hasta **25-30 minutos** en propagarse completamente.

### Opción 2: Limpiar Caché Manualmente

**En Azure Portal:**
1. Ve a https://portal.azure.com
2. Busca "Static Web Apps"
3. Selecciona "brave-island-0600c480f"
4. En el menú izquierdo, busca "Configuration" o "Settings"
5. Busca opción de "Purge CDN Cache" o similar

**O ejecuta en PowerShell:**
```powershell
# Forzar redeploy completo
cd D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas
.\deploy-azure.ps1
```

### Opción 3: Verificar CORS en Backend

Si ves errores de CORS en la consola del navegador:

```powershell
# Verificar configuración CORS actual
az webapp cors show --resource-group clinicaveterinaria --name vetclinic-backend-2025

# Agregar frontend a CORS si no está
az webapp cors add `
  --resource-group clinicaveterinaria `
  --name vetclinic-backend-2025 `
  --allowed-origins "https://brave-island-0600c480f.3.azurestaticapps.net"
```

---

## 📊 Checklist Final

- [ ] GitHub Actions completado con ✅ verde
- [ ] Frontend abierto en modo privado
- [ ] F12 → Network muestra peticiones a Azure (NO localhost)
- [ ] Login funciona correctamente
- [ ] Dashboard carga mascotas sin errores
- [ ] Se pueden agendar citas
- [ ] NO aparecen errores "Network Error" en consola

---

## 🎉 Si Todo Funciona

**¡Felicidades!** El frontend ahora está correctamente configurado para usar el backend de Azure.

**Lo que se corrigió:**
1. ✅ `.env.production` sin `/api` duplicado
2. ✅ `.env` creado con URL de Azure
3. ✅ `TablaUsuarios.tsx` usando configuración centralizada
4. ✅ Todos los endpoints apuntan a Azure

**Arquitectura actual:**
```
Frontend (Azure Static Web Apps)
    ↓
https://brave-island-0600c480f.3.azurestaticapps.net
    ↓
    ↓ Peticiones HTTP
    ↓
Backend (Azure App Service)
    ↓
https://vetclinic-backend-2025.azurewebsites.net
    ↓
    ↓ Consultas SQL
    ↓
Base de Datos (Azure Database for MySQL)
```

---

## 📞 Comandos Útiles para Futuras Verificaciones

```powershell
# Ver logs de GitHub Actions
Start-Process "https://github.com/Ciromontes/fronted-gestion-citas/actions"

# Abrir frontend
Start-Process "msedge" -ArgumentList "--inprivate", "https://brave-island-0600c480f.3.azurestaticapps.net"

# Verificar backend está activo
curl https://vetclinic-backend-2025.azurewebsites.net/api/auth/login

# Ver configuración CORS
az webapp cors show --resource-group clinicaveterinaria --name vetclinic-backend-2025

# Rebuild y redeploy frontend
cd D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas
npm run build
.\deploy-azure.ps1
```

