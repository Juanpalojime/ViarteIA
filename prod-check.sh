#!/bin/bash

# ViarteIA Production Sanity Check Script
echo "🔍 Starting Production Sanity Check..."

# 1. Check Node API
echo -n "Checking Node API... "
curl -sf http://localhost:3001/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ OK"
    # 1.1 Check Security Headers
    echo -n "   - Security Headers (Helmet)... "
    HEADERS=$(curl -sI http://localhost:3001/health)
    if [[ $HEADERS == *"X-Frame-Options: DENY"* ]]; then
        echo "✅ Active (DENY)"
    else
        echo "⚠️  Missing or Insecure (Expected DENY)"
        echo "Got headers: $HEADERS"
    fi
    # 1.2 Rate Limiting check
    echo -n "   - Rate Limit Test... "
    for i in {1..120}; do curl -s http://localhost:3001/health > /dev/null; done
    echo "✅ Completed (Check logs for 'Too Many Requests')"
else
    echo "❌ FAILED (Is server running?)"
fi

# 2. Check Python AI Engine
echo -n "Checking Python AI Engine... "
curl -sf http://localhost:8000/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

# 3. Check GPU Status via API
echo -n "Checking GPU (CUDA)... "
GPU_STATUS=$(curl -s http://localhost:3001/api/health/gpu)
if [[ $GPU_STATUS == *"true"* ]]; then
    echo "✅ OK (Available)"
else
    echo "⚠️ OFFLINE/NOT FOUND"
fi

# 4. Check MinIO (Object Storage)
echo -n "Checking MinIO... "
MINIO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/minio/health/live)
if [ "$MINIO_STATUS" -eq 200 ]; then
    echo "✅ OK"
else
    echo "❌ FAILED (Status: $MINIO_STATUS)"
fi

# 4. Check Environment Variables
echo -n "Validating .env... "
if [ -f .env ]; then
    echo "✅ Found"
else
    echo "⚠️  Not found (Expected in production root)"
fi

echo "🚀 Sanity check complete."
