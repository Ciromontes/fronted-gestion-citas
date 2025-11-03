# ============================================
# Script de Build y Validacion del Frontend
# ============================================

Write-Host ">>> INICIANDO BUILD DEL FRONTEND..." -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del frontend
Set-Location "D:\CopiaF\AnalisisYDesarrolloDeSoftware\2025sena\ProyectoFinalClinVet\gestion-citas\frontend-gestion-citas"

Write-Host "[INFO] Directorio actual:" -ForegroundColor Yellow
Get-Location
Write-Host ""

Write-Host "[VERIFICACION] Archivos necesarios para el build..." -ForegroundColor Yellow
if (Test-Path "tsconfig.json") {
    Write-Host "  [OK] tsconfig.json existe" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] tsconfig.json NO existe" -ForegroundColor Red
}

if (Test-Path "tsconfig.app.json") {
    Write-Host "  [OK] tsconfig.app.json existe" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] tsconfig.app.json NO existe" -ForegroundColor Red
}

if (Test-Path "tsconfig.node.json") {
    Write-Host "  [OK] tsconfig.node.json existe" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] tsconfig.node.json NO existe" -ForegroundColor Red
}

if (Test-Path "vite.config.ts") {
    Write-Host "  [OK] vite.config.ts existe" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] vite.config.ts NO existe" -ForegroundColor Red
}

if (Test-Path "index.html") {
    Write-Host "  [OK] index.html existe" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] index.html NO existe" -ForegroundColor Red
}
Write-Host ""

Write-Host "[LIMPIEZA] Deteniendo contenedores anteriores..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down
Write-Host ""

Write-Host "[LIMPIEZA] Eliminando imagen anterior (si existe)..." -ForegroundColor Yellow
docker rmi frontend-gestion-citas-frontend 2>$null
Write-Host ""

Write-Host "[BUILD] Iniciando build (esto puede tomar 2-3 minutos)..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml build --no-cache frontend
$buildExitCode = $LASTEXITCODE
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($buildExitCode -eq 0) {
    Write-Host "[EXITO] Build completado correctamente!" -ForegroundColor Green
    Write-Host ""

    Write-Host "[DEPLOY] Levantando contenedor..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml up -d frontend

    Write-Host ""
    Write-Host "[ESPERA] Esperando 5 segundos para que el contenedor inicie..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    Write-Host ""
    Write-Host "[ESTADO] Verificando contenedor:" -ForegroundColor Yellow
    docker ps | Select-String "frontend"

    Write-Host ""
    Write-Host "[LOGS] Salida del contenedor:" -ForegroundColor Yellow
    Write-Host "------------------------------------------------" -ForegroundColor Cyan
    docker logs vetclinic-frontend-dev
    Write-Host "------------------------------------------------" -ForegroundColor Cyan

    Write-Host ""
    Write-Host "[LISTO] Frontend desplegado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "[NAVEGADOR] Abriendo http://localhost:3000 ..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"

    Write-Host ""
    Write-Host "[PRUEBAS] Lista de verificacion:" -ForegroundColor Yellow
    Write-Host "  1. Verificar que la pagina de login carga correctamente" -ForegroundColor White
    Write-Host "  2. Verificar que los estilos CSS se aplican" -ForegroundColor White
    Write-Host "  3. Probar login con: admin@clinicaveterinaria.com / admin123" -ForegroundColor White
    Write-Host "  4. Verificar que no hay errores en la consola del navegador (F12)" -ForegroundColor White

} else {
    Write-Host "[ERROR] Build fallo con codigo de salida: $buildExitCode" -ForegroundColor Red
    Write-Host ""
    Write-Host "[DIAGNOSTICO] Pasos a seguir:" -ForegroundColor Yellow
    Write-Host "  1. Revisa los errores arriba en rojo" -ForegroundColor White
    Write-Host "  2. Si el error es 'not found' para tsconfig, ejecuta:" -ForegroundColor White
    Write-Host "     Get-ChildItem -Filter 'tsconfig*'" -ForegroundColor Cyan
    Write-Host "  3. Si el error persiste, verifica el .dockerignore" -ForegroundColor White
    Write-Host ""
    Write-Host "[INFO] Consulta: CORRECCIONES_BUILD_APLICADAS.md" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Script completado" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

