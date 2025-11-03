# ============================================
# Script de Deploy SIMPLIFICADO a Azure
# ============================================
# Este script usa SWA CLI directamente
# ============================================

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY FRONTEND A AZURE (SWA CLI)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuracion
$APP_NAME = "brave-island-0600c480f"
$DIST_DIR = "./dist"

# Paso 1: Verificar que dist existe
Write-Host "[1/3] Verificando build..." -ForegroundColor Yellow

if (-not (Test-Path $DIST_DIR)) {
    Write-Host "ERROR: El directorio dist no existe" -ForegroundColor Red
    Write-Host "Ejecutando build..." -ForegroundColor Yellow
    npm run build

    if (-not (Test-Path $DIST_DIR)) {
        Write-Host "ERROR: Build fallo" -ForegroundColor Red
        exit 1
    }
}

Write-Host "OK: Directorio dist encontrado" -ForegroundColor Green

# Paso 2: Verificar/Instalar SWA CLI
Write-Host ""
Write-Host "[2/3] Verificando SWA CLI..." -ForegroundColor Yellow

$swaInstalled = Get-Command swa -ErrorAction SilentlyContinue

if (-not $swaInstalled) {
    Write-Host "Instalando @azure/static-web-apps-cli..." -ForegroundColor Yellow
    npm install -g @azure/static-web-apps-cli

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo instalar SWA CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host "OK: SWA CLI disponible" -ForegroundColor Green

# Paso 3: Deploy
Write-Host ""
Write-Host "[3/3] Desplegando a Azure..." -ForegroundColor Green
Write-Host "   App: $APP_NAME" -ForegroundColor Gray
Write-Host "   Source: $DIST_DIR" -ForegroundColor Gray
Write-Host ""
Write-Host "IMPORTANTE: Necesitas el deployment token" -ForegroundColor Yellow
Write-Host "Para obtenerlo, ve a:" -ForegroundColor Yellow
Write-Host "https://portal.azure.com -> Static Web Apps -> $APP_NAME -> Overview -> Manage deployment token" -ForegroundColor Cyan
Write-Host ""

$token = Read-Host "Pega el deployment token aqui"

if ([string]::IsNullOrEmpty($token)) {
    Write-Host "ERROR: Token vacio" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Desplegando..." -ForegroundColor Yellow

swa deploy $DIST_DIR `
    --deployment-token $token `
    --app-name $APP_NAME `
    --env production

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Deploy fallo" -ForegroundColor Red
    Write-Host "Verifica que el token sea correcto" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY COMPLETADO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: https://$APP_NAME.3.azurestaticapps.net" -ForegroundColor Green
Write-Host ""

$openBrowser = Read-Host "Abrir navegador? (S/N)"

if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Start-Process "msedge" -ArgumentList "--inprivate", "https://$APP_NAME.3.azurestaticapps.net"
}

Write-Host ""
Write-Host "Listo!" -ForegroundColor Green

