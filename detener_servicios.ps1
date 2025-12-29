Write-Host "Deteniendo servicios de ViarteIA..." -ForegroundColor Yellow
Write-Host ""

# Detener procesos de Node relacionados con ViarteIA
Write-Host "Deteniendo procesos Node..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -eq "node" } | ForEach-Object {
    try {
        Stop-Process -Id $_.Id -Force
        Write-Host "  Detenido Node (PID: $($_.Id))" -ForegroundColor Green
    }
    catch {
        Write-Host "  No se pudo detener PID: $($_.Id)" -ForegroundColor Yellow
    }
}

# Detener procesos de Python relacionados con ViarteIA
Write-Host "Deteniendo procesos Python..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -eq "python" } | ForEach-Object {
    try {
        Stop-Process -Id $_.Id -Force
        Write-Host "  Detenido Python (PID: $($_.Id))" -ForegroundColor Green
    }
    catch {
        Write-Host "  No se pudo detener PID: $($_.Id)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Esperando 2 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Servicios detenidos. Ahora ejecuta:" -ForegroundColor Cyan
Write-Host "  python master_launcher.py" -ForegroundColor White
Write-Host ""
