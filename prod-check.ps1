Write-Host "🔍 Starting Production Sanity Check..." -ForegroundColor Cyan

# 1. Check Node API
Write-Host -NoNewline "Checking Node API... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Head -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ OK" -ForegroundColor Green
        
        # 1.1 Check Security Headers
        Write-Host -NoNewline "   - Security Headers (Helmet)... "
        $headers = $response.Headers
        if ($headers["X-Frame-Options"] -eq "DENY") {
            Write-Host "✅ Active (DENY)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Missing or Insecure (Expected DENY)" -ForegroundColor Yellow
            Write-Host "     Got: $($headers["X-Frame-Options"])" -ForegroundColor DarkGray
        }

        # 1.2 Rate Limiting Check
        Write-Host -NoNewline "   - Rate Limit Test (120 reqs)... "
        $rateLimitHit = $false
        for ($i=1; $i -le 120; $i++) {
            try {
                Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Get -ErrorAction Stop | Out-Null
            } catch {
                if ($_.Exception.Response.StatusCode -eq 429) {
                    $rateLimitHit = $true
                    break
                }
            }
        }
        if ($rateLimitHit) {
            Write-Host "✅ Verified (429 Hit)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Not triggered (Check limit settings)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ FAILED (Is server running?)" -ForegroundColor Red
}

# 2. Check Python AI Engine
Write-Host -NoNewline "Checking Python AI Engine... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method Head -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ OK" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
}

# 3. Check GPU Status via API
Write-Host -NoNewline "Checking GPU (CUDA)... "
try {
    $gpuStatus = Invoke-RestMethod -Uri "http://localhost:3001/api/health/gpu" -ErrorAction SilentlyContinue
    if ($gpuStatus -match "true") {
        Write-Host "✅ OK (Available)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  OFFLINE/NOT FOUND" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Unable to check" -ForegroundColor Yellow
}

# 4. Check MinIO
Write-Host -NoNewline "Checking MinIO... "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9000/minio/health/live" -Method Get -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ OK" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
}

# 5. Check .env
Write-Host -NoNewline "Validating .env... "
if (Test-Path ".env") {
    Write-Host "✅ Found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Not found" -ForegroundColor Yellow
}

Write-Host "🚀 Sanity check complete." -ForegroundColor Cyan
