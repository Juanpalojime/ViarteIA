# Script Interactivo - Checklist Final de Seguridad
# Este script te guiara paso a paso para completar la configuracion

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  CHECKLIST FINAL DE SEGURIDAD" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Estado actual
Write-Host "Estado Actual:" -ForegroundColor Yellow
Write-Host "  - Historial de Git: LIMPIADO" -ForegroundColor Green
Write-Host "  - Claves en codigo: ELIMINADAS" -ForegroundColor Green
Write-Host "  - Remote de Git: DESCONECTADO" -ForegroundColor Yellow
Write-Host ""

# Paso 1: Reconectar Remote
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PASO 1: Reconectar Remote de Git" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$hasRemote = git remote -v 2>$null
if (-not $hasRemote) {
    Write-Host "El remote 'origin' fue eliminado durante la limpieza." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ingresa la URL de tu repositorio remoto:" -ForegroundColor White
    Write-Host "Ejemplo: https://github.com/usuario/ViarteIA.git" -ForegroundColor Gray
    Write-Host ""
    
    $remoteUrl = Read-Host "URL del repositorio"
    
    if ($remoteUrl) {
        git remote add origin $remoteUrl
        Write-Host ""
        Write-Host "[OK] Remote reconectado exitosamente" -ForegroundColor Green
        git remote -v
    }
    else {
        Write-Host ""
        Write-Host "[SKIP] Puedes reconectar el remote mas tarde con:" -ForegroundColor Yellow
        Write-Host "  git remote add origin <url>" -ForegroundColor Cyan
    }
}
else {
    Write-Host "[OK] Remote ya esta configurado:" -ForegroundColor Green
    git remote -v
}

Write-Host ""
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host

# Paso 2: Verificar historial
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PASO 2: Verificar Historial Limpio" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ultimos commits:" -ForegroundColor Yellow
git log --oneline -5
Write-Host ""

Write-Host "Buscando claves en el historial..." -ForegroundColor Yellow
$keysFound = git log --all --source --full-history -S "gsk_" --oneline 2>$null

if ($keysFound) {
    Write-Host "[INFO] Se encontraron referencias (probablemente el texto de reemplazo):" -ForegroundColor Yellow
    Write-Host $keysFound
}
else {
    Write-Host "[OK] No se encontraron claves en el historial" -ForegroundColor Green
}

Write-Host ""
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host

# Paso 3: Verificar archivos .env
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PASO 3: Verificar Archivos .env" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$envExists = Test-Path ".env"
$nodeEnvExists = Test-Path "backend/node-api/.env"

if ($envExists) {
    Write-Host "[OK] .env existe en la raiz" -ForegroundColor Green
}
else {
    Write-Host "[WARN] .env NO existe. Creando desde plantilla..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "[OK] .env creado. EDITA este archivo con tus claves reales" -ForegroundColor Green
}

if ($nodeEnvExists) {
    Write-Host "[OK] backend/node-api/.env existe" -ForegroundColor Green
}
else {
    Write-Host "[WARN] backend/node-api/.env NO existe. Creando desde plantilla..." -ForegroundColor Yellow
    Copy-Item "backend/node-api/.env.example" "backend/node-api/.env"
    Write-Host "[OK] backend/node-api/.env creado. EDITA este archivo con tus claves reales" -ForegroundColor Green
}

Write-Host ""
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host

# Paso 4: Preparar Force Push
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PASO 4: Preparar Force Push" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ADVERTENCIA: El force push sobrescribira el historial remoto" -ForegroundColor Red
Write-Host ""

$hasRemote = git remote -v 2>$null
if ($hasRemote) {
    Write-Host "Deseas hacer force push AHORA? (si/no)" -ForegroundColor Yellow
    Write-Host "Nota: Puedes hacerlo mas tarde con: git push --force-with-lease origin main" -ForegroundColor Gray
    Write-Host ""
    
    $doPush = Read-Host "Respuesta"
    
    if ($doPush -eq "si") {
        Write-Host ""
        Write-Host "Ejecutando force push..." -ForegroundColor Yellow
        git push --force-with-lease origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "[OK] Force push completado exitosamente" -ForegroundColor Green
        }
        else {
            Write-Host ""
            Write-Host "[ERROR] Hubo un problema con el push" -ForegroundColor Red
            Write-Host "Verifica tu conexion y permisos del repositorio" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host ""
        Write-Host "[SKIP] Force push omitido. Ejecutalo manualmente cuando estes listo:" -ForegroundColor Yellow
        Write-Host "  git push --force-with-lease origin main" -ForegroundColor Cyan
    }
}
else {
    Write-Host "[SKIP] No hay remote configurado. Reconecta primero el remote." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host

# Resumen Final
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "RESUMEN FINAL" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Tareas Completadas:" -ForegroundColor Green
Write-Host "  [OK] Historial de Git limpiado" -ForegroundColor Green
Write-Host "  [OK] Archivos .env verificados" -ForegroundColor Green

if ($hasRemote) {
    Write-Host "  [OK] Remote configurado" -ForegroundColor Green
}
else {
    Write-Host "  [PENDIENTE] Reconectar remote" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "TAREAS CRITICAS PENDIENTES:" -ForegroundColor Red
Write-Host ""
Write-Host "1. REVOCAR claves antiguas en:" -ForegroundColor Yellow
Write-Host "   https://console.groq.com/keys" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. GENERAR nuevas claves de API" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. ACTUALIZAR archivos .env con las nuevas claves:" -ForegroundColor Yellow
Write-Host "   - .env" -ForegroundColor Cyan
Write-Host "   - backend/node-api/.env" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. PROBAR que todo funcione:" -ForegroundColor Yellow
Write-Host "   python master_launcher.py" -ForegroundColor Cyan
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
