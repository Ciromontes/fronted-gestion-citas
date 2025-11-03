# 🔧 SOLUCIÓN AL ERROR "Network Error" - CONFIGURAR CORS

## 🎯 PROBLEMA IDENTIFICADO

**Tu frontend SÍ está desplegado correctamente y apunta a Azure.**

El problema es que el **backend en Azure NO tiene configurado CORS** para permitir peticiones desde tu frontend.

### **Evidencia:**
```
✅ Login: 200 OK (funciona)
❌ /api/mascotas/mias: Network Error (CORS bloqueado)
❌ /api/citas: Network Error (CORS bloqueado)
```

---

## ✅ SOLUCIÓN: CONFIGURAR CORS EN EL BACKEND

### **OPCIÓN 1: Desde el Portal de Azure (RECOMENDADO)**

#### **Paso 1: Ir al backend**
1. Abre: https://portal.azure.com
2. En el buscador escribe: `vetclinic-backend-2025`
3. Click en tu **App Service**

#### **Paso 2: Configurar CORS**
1. En el menú lateral, busca **"CORS"** (en la sección API)
2. En **"Allowed Origins"**, agrega:
   ```
   https://brave-island-0600c480f.3.azurestaticapps.net
   ```
3. **NO marques** "Enable Access-Control-Allow-Credentials" (por ahora)
4. Click en **"Save"** (arriba)

#### **Paso 3: Esperar 1-2 minutos**
Azure necesita aplicar los cambios.

#### **Paso 4: Recargar tu frontend**
1. Ve a: https://brave-island-0600c480f.3.azurestaticapps.net
2. Presiona **Ctrl + Shift + R** (recarga forzada)
3. Intenta cargar las mascotas nuevamente

---

### **OPCIÓN 2: Desde Azure CLI (si funciona)**

```powershell
az webapp cors add \
  --name vetclinic-backend-2025 \
  --resource-group clinicaveterinaria \
  --allowed-origins "https://brave-island-0600c480f.3.azurestaticapps.net"
```

**Verificar:**
```powershell
az webapp cors show \
  --name vetclinic-backend-2025 \
  --resource-group clinicaveterinaria
```

Deberías ver:
```json
{
  "allowedOrigins": [
    "https://brave-island-0600c480f.3.azurestaticapps.net"
  ]
}
```

---

## 🎯 ALTERNATIVA: CONFIGURAR CORS EN EL CÓDIGO DEL BACKEND

Si no tienes acceso al portal, puedes configurar CORS en el código Spring Boot:

### **Archivo: `src/main/java/config/WebConfig.java`**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "https://brave-island-0600c480f.3.azurestaticapps.net",
                    "http://localhost:5173" // Para desarrollo
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

