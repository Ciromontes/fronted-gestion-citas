tá ha# ============================================
# Script de Build y Prueba - Frontend Integrado
# ============================================

Write-Host "[INFO] Iniciando proceso de build del frontend integrado..." -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del frontend
Set-Location "D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas"

Write-Host "[VERIFICACION] Archivos de configuracion actualizados..." -ForegroundColor Yellow
Write-Host "  [OK] nginx.conf - con proxy al backend" -ForegroundColor Green
Write-Host "  [OK] Dockerfile - multi-stage con health check" -ForegroundColor Green
Write-Host "  [OK] api.config.ts - rutas relativas /api" -ForegroundColor Green
Write-Host "  [OK] .env.local - VITE_API_URL=/api" -ForegroundColor Green
Write-Host ""

Write-Host "[PASO 1] Build de la imagen del frontend..." -ForegroundColor Cyan
docker build -t vetclinic-frontend:test .
$buildExitCode = $LASTEXITCODE

if ($buildExitCode -ne 0) {
    Write-Host "[ERROR] Build fallo. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host "[EXITO] Imagen construida correctamente!" -ForegroundColor Green
Write-Host ""

Write-Host "[PASO 2] Deteniendo contenedores anteriores..." -ForegroundColor Yellow
docker stop frontend-test 2>$null
docker rm frontend-test 2>$null
Write-Host ""

Write-Host "[PASO 3] Iniciando contenedor de prueba..." -ForegroundColor Cyan
Write-Host "  Puerto: 3001" -ForegroundColor White
Write-Host "  Backend: host.docker.internal:8080" -ForegroundColor White
docker run -d `
  --name frontend-test `
  -p 3001:80 `
  --add-host=host.docker.internal:host-gateway `
  vetclinic-frontend:test

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "[VERIFICACION] Estado del contenedor:" -ForegroundColor Yellow
docker ps | Select-String "frontend-test"

Write-Host ""
Write-Host "[LOGS] Primeras lineas del contenedor:" -ForegroundColor Yellow
Write-Host "------------------------------------------------" -ForegroundColor Cyan
docker logs frontend-test --tail 15
Write-Host "------------------------------------------------" -ForegroundColor Cyan

Write-Host ""
Write-Host "[HEALTH CHECK] Esperando que el contenedor este saludable (30 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verificar health
$health = docker inspect --format='{{.State.Health.Status}}' frontend-test 2>$null
if ($health -eq "healthy") {
    Write-Host "  [OK] Contenedor saludable!" -ForegroundColor Green
} else {
    Write-Host "  [ADVERTENCIA] Health status: $health (puede tardar hasta 30s)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[PRUEBA 1] Verificando que nginx responde..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "  [OK] Nginx responde correctamente (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Nginx no responde: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "[PRUEBA 2] Verificando que el frontend carga..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 5
    if ($response.Content -match "VetCare|login|root") {
        Write-Host "  [OK] Frontend carga correctamente (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "  [ADVERTENCIA] Frontend responde pero el contenido parece incorrecto" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ERROR] Frontend no carga: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "[PRUEBA 3] Verificando que el backend esta accesible..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "  [OK] Backend responde (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Backend no responde: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  [INFO] Asegurate de que el backend este corriendo:" -ForegroundColor Yellow
    Write-Host "         cd ..\gestion-citas" -ForegroundColor White
    Write-Host "         .\start.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "[LISTO] Frontend de prueba corriendo!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[NAVEGADOR] Abriendo http://localhost:3001 ..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "[INSTRUCCIONES] Pruebas manuales a realizar:" -ForegroundColor Yellow
Write-Host "  1. Verificar que la pagina de login carga correctamente" -ForegroundColor White
Write-Host "  2. Abrir DevTools (F12) y verificar que no hay errores en Console" -ForegroundColor White
Write-Host "  3. Intentar login con: admin@clinicaveterinaria.com / admin123" -ForegroundColor White
Write-Host "  4. Si el backend esta corriendo, el login deberia funcionar" -ForegroundColor White
Write-Host "  5. Verificar en Network (F12) que las peticiones /api/ funcionan" -ForegroundColor White
Write-Host ""
Write-Host "[COMANDOS UTILES]" -ForegroundColor Yellow
Write-Host "  Ver logs en tiempo real:" -ForegroundColor White
Write-Host "    docker logs frontend-test -f" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Detener contenedor de prueba:" -ForegroundColor White
Write-Host "    docker stop frontend-test" -ForegroundColor Cyan
Write-Host "    docker rm frontend-test" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Rebuild completo:" -ForegroundColor White
Write-Host "    docker build --no-cache -t vetclinic-frontend:test ." -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

