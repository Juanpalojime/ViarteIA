Write-Host "Starting Production Sanity Check..." -ForegroundColor Cyan

# 1. Check Node API
Write-Host -NoNewline "Checking Node API... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Get -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "OK" -ForegroundColor Green
        
        # 1.1 Check security headers (Helmet is usually pre-configured in Fastify)
        $headers = $response.Headers
        if ($headers["X-Frame-Options"]) {
             Write-Host "   - Security Headers: Found ($($headers["X-Frame-Options"]))" -ForegroundColor Gray
        }

        # 1.2 Version/Status Check
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   - API Status: $($data.status)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "FAILED (Is server running?)" -ForegroundColor Red
}

# 2. Check Python AI Engine
Write-Host -NoNewline "Checking Python AI Engine... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method Get -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "OK" -ForegroundColor Green
    }
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
}

# 3. Check GPU Status
Write-Host -NoNewline "Checking GPU (CUDA)... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health/gpu" -Method Get -UseBasicParsing -ErrorAction Stop
    $gpuStatus = $response.Content | ConvertFrom-Json
    if ($gpuStatus.cuda_available -eq $true) {
        Write-Host "OK (Device: $($gpuStatus.device))" -ForegroundColor Green
    }
    else {
        Write-Host "OFFLINE (CPU Only)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Unable to check Python GPU endpoint" -ForegroundColor Yellow
}

# 4. Check .env Validation
Write-Host "Validating Secrets..."
$requiredKeys = @("GROQ_API_KEY", "JWT_SECRET")
$foundKeys = 0

if (Test-Path "backend/node-api/.env") {
    $content = Get-Content "backend/node-api/.env"
    foreach ($key in $requiredKeys) {
        if ($content -match "$key=") {
            $foundKeys++
        }
    }
    if ($foundKeys -eq $requiredKeys.Count) {
        Write-Host "✅ .env keys validated" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Missing keys in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ backend/node-api/.env not found" -ForegroundColor Red
}

Write-Host "Sanity check complete." -ForegroundColor Cyan
