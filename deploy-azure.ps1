# ============================================
# Script de Deploy Automático a Azure
# ============================================
# Este script hace el build y deploy del frontend a Azure Static Web Apps
#
# USO:
#   .\deploy-azure.ps1
#
# REQUISITOS:
#   - Azure CLI instalado (az)
#   - Sesión de Azure activa (az login)
# ============================================

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY FRONTEND A AZURE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$PROJECT_DIR = "D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas"
$APP_NAME = "brave-island-0600c480f"
$RESOURCE_GROUP = "clinicaveterinaria"
$DIST_DIR = "./dist"

# Cambiar al directorio del proyecto
Write-Host "📁 Cambiando al directorio del proyecto..." -ForegroundColor Yellow
Set-Location $PROJECT_DIR

# Paso 1: Build
Write-Host ""
Write-Host "🔨 PASO 1: Construyendo el frontend..." -ForegroundColor Green
Write-Host "   Comando: npm run build" -ForegroundColor Gray
Write-Host ""

try {
    npm run build
    Write-Host "✅ Build completado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en el build" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Verificar que dist existe
if (-not (Test-Path $DIST_DIR)) {
    Write-Host "❌ Error: El directorio dist no existe" -ForegroundColor Red
    Write-Host "   El build puede haber fallado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Directorio dist encontrado" -ForegroundColor Green

# Paso 2: Verificar Azure CLI
Write-Host ""
Write-Host "🔐 PASO 2: Verificando sesión de Azure..." -ForegroundColor Green
Write-Host ""

try {
    $account = az account show 2>$null | ConvertFrom-Json
    Write-Host "✅ Sesión activa: $($account.user.name)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No hay sesión activa en Azure" -ForegroundColor Yellow
    Write-Host "   Iniciando login..." -ForegroundColor Yellow
    az login

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al iniciar sesión en Azure" -ForegroundColor Red
        exit 1
    }
}

# Paso 3: Deploy
Write-Host ""
Write-Host "🚀 PASO 3: Desplegando a Azure Static Web Apps..." -ForegroundColor Green
Write-Host "   App: $APP_NAME" -ForegroundColor Gray
Write-Host "   Resource Group: $RESOURCE_GROUP" -ForegroundColor Gray
Write-Host "   Source: $DIST_DIR" -ForegroundColor Gray
Write-Host ""

try {
    az staticwebapp deploy `
        --name $APP_NAME `
        --resource-group $RESOURCE_GROUP `
        --source $DIST_DIR

    if ($LASTEXITCODE -ne 0) {
        throw "Deploy falló con código de salida $LASTEXITCODE"
    }

    Write-Host ""
    Write-Host "✅ Deploy completado exitosamente" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "⚠️  El comando az staticwebapp deploy falló" -ForegroundColor Yellow
    Write-Host "   Intentando método alternativo con SWA CLI..." -ForegroundColor Yellow
    Write-Host ""

    # Verificar si swa está instalado
    $swaInstalled = Get-Command swa -ErrorAction SilentlyContinue

    if (-not $swaInstalled) {
        Write-Host "📦 Instalando @azure/static-web-apps-cli..." -ForegroundColor Yellow
        npm install -g @azure/static-web-apps-cli
    }

    # Obtener token
    Write-Host "🔑 Obteniendo token de deployment..." -ForegroundColor Yellow
    $token = az staticwebapp secrets list `
        --name $APP_NAME `
        --resource-group $RESOURCE_GROUP `
        --query "properties.apiKey" -o tsv

    if ([string]::IsNullOrEmpty($token)) {
        Write-Host "❌ No se pudo obtener el token de deployment" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Token obtenido" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Desplegando con SWA CLI..." -ForegroundColor Yellow

    swa deploy $DIST_DIR `
        --deployment-token $token `
        --app-name $APP_NAME `
        --env production

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Deploy falló" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "✅ Deploy completado exitosamente (con SWA CLI)" -ForegroundColor Green
}

# Paso 4: Verificacion
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ DEPLOY COMPLETADO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 URL del frontend:" -ForegroundColor Green
Write-Host "   https://$APP_NAME.3.azurestaticapps.net" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Proximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Abre el navegador en modo privado" -ForegroundColor Gray
Write-Host "   2. Ve a: https://$APP_NAME.3.azurestaticapps.net" -ForegroundColor Gray
Write-Host "   3. Presiona F12 → Network tab" -ForegroundColor Gray
Write-Host "   4. Verifica que las peticiones vayan a:" -ForegroundColor Gray
Write-Host "      https://vetclinic-backend-2025.azurewebsites.net/api/..." -ForegroundColor Gray
Write-Host ""

# Preguntar si abrir el navegador
$openBrowser = Read-Host "Quieres abrir el navegador ahora? (S/N)"

if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Write-Host "🌐 Abriendo navegador..." -ForegroundColor Green
    Start-Process "msedge" -ArgumentList "--inprivate", "https://$APP_NAME.3.azurestaticapps.net"
}

Write-Host ""
Write-Host "✨ Todo listo!" -ForegroundColor Green
Write-Host ""

