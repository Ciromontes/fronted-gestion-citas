# 🚀 SOLUCIÓN FINAL - DEPLOY MANUAL CON TOKEN

## ⚠️ PROBLEMA IDENTIFICADO

Tu instalación de Azure CLI **NO tiene el comando `az staticwebapp deploy`**. Esto es porque:
- Versión antigua de Azure CLI
- Comando no disponible en tu instalación

**SOLUCIÓN:** Usar SWA CLI directamente con deployment token.

---

## 📋 PASOS PARA HACER EL DEPLOY

### **OPCIÓN 1: DEPLOY MANUAL (MÁS SIMPLE)** ⭐ RECOMENDADO

#### **Paso 1: Obtener el Deployment Token**

Ve al portal de Azure y sigue estos pasos:

1. Abre: https://portal.azure.com
2. En el buscador escribe: `brave-island-0600c480f`
3. Click en tu Static Web App
4. En el menú lateral, click en **"Overview"** o **"Manage deployment token"**
5. Click en **"Manage deployment token"** o **"Reset deployment token"**
6. Aparecerá un token largo como este:
   ```
   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...
   ```
7. **COPIA ESE TOKEN** (Ctrl+C)

#### **Paso 2: Ejecutar el script simplificado**

```powershell
cd D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas

.\deploy-manual.ps1
```

El script te preguntará:
```
Pega el deployment token aqui:
```

**Pega el token** (Ctrl+V) y presiona Enter.

El script hará el deploy automáticamente.

---

### **OPCIÓN 2: DEPLOY COMPLETAMENTE MANUAL**

Si prefieres hacerlo todo manualmente:

#### **1. Instalar SWA CLI (si no lo tienes):**
```powershell
npm install -g @azure/static-web-apps-cli
```

#### **2. Obtener el token** (ver Paso 1 de Opción 1)

#### **3. Ejecutar deploy:**
```powershell
cd D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas

swa deploy ./dist `
  --deployment-token "PEGA_AQUI_TU_TOKEN" `
  --app-name brave-island-0600c480f `
  --env production
```

**Reemplaza `PEGA_AQUI_TU_TOKEN` con el token que copiaste.**

---

## 🎯 SCREENSHOTS PARA OBTENER EL TOKEN

### **Método 1: Desde el Portal**
1. Portal Azure → Buscar "brave-island" → Click en la app
2. Overview → Ver "Manage deployment token"
3. Click → Se muestra el token
4. Copy to clipboard

### **Método 2: Desde Settings**
1. Static Web App → Settings
2. Configuration
3. Deployment tokens
4. Copy

---

## ⏱️ TIEMPO ESTIMADO

| Paso | Tiempo |
|------|--------|
| Obtener token | 1 min |
| Ejecutar script | 2-3 min |
| Verificar | 1 min |
| **TOTAL** | **4-5 min** |

---

## ✅ DESPUÉS DEL DEPLOY

### **Verás algo como:**
```
Uploading content...
✓ Upload complete (xxx files)
✓ Deployment complete

App deployed to:
https://brave-island-0600c480f.3.azurestaticapps.net
```

### **Verificación:**
1. Abre https://brave-island-0600c480f.3.azurestaticapps.net (modo privado)
2. F12 → Network tab
3. Haz login o carga datos
4. Verifica que las peticiones vayan a:
   ```
   https://vetclinic-backend-2025.azurewebsites.net/api/...
   ```

---

## 🆘 TROUBLESHOOTING

### **"swa command not found"**
```powershell
npm install -g @azure/static-web-apps-cli
```

### **"Invalid deployment token"**
- El token expiró → Genera uno nuevo en Azure Portal
- Copiaste mal → Asegúrate de copiar TODO el token

### **"Deployment failed"**
- Verifica que `./dist` exista
- Ejecuta `npm run build` primero

---

## 📄 SCRIPTS DISPONIBLES

| Script | Descripción | Cuándo usar |
|--------|-------------|-------------|
| `deploy-azure.ps1` | Intenta con Azure CLI primero | Si tienes Azure CLI actualizado |
| `deploy-manual.ps1` | Pide token manualmente | **USAR ESTE** si Azure CLI falla |
| Comandos manuales | Deploy directo con swa | Si prefieres control total |

---

## 🎊 RESUMEN EJECUTIVO

### **Lo que pasó:**
- ✅ Código actualizado (17 endpoints)
- ✅ Build exitoso (dist generado)
- ❌ `az staticwebapp deploy` no existe en tu CLI
- ✅ **Solución:** SWA CLI con token manual

### **Lo que debes hacer:**
1. Obtener token de Azure Portal (1 min)
2. Ejecutar `.\deploy-manual.ps1` (2-3 min)
3. Pegar token cuando se pida
4. ¡Listo!

### **Resultado esperado:**
```
Frontend actualizado → https://vetclinic-backend-2025.azurewebsites.net ✅
```

---

## 📞 COMANDOS RÁPIDOS

### **Para ejecutar el deploy:**
```powershell
cd D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas

# Opción recomendada:
.\deploy-manual.ps1

# Opción manual:
swa deploy ./dist --deployment-token "TU_TOKEN" --app-name brave-island-0600c480f --env production
```

### **Para obtener el token:**
```
1. https://portal.azure.com
2. Buscar: brave-island-0600c480f
3. Overview → Manage deployment token
4. Copy → Pegar en el script
```

---

**ACCIÓN INMEDIATA: Ejecuta `.\deploy-manual.ps1` y sigue las instrucciones.** 🚀

El script es muy simple, solo pide el token y hace todo el resto automáticamente.

