#!/bin/bash

echo "=== Testing CORS from vexto.pro to api.vexto.pro ==="
echo ""

echo "1. Testing health endpoint with CORS:"
curl -v -X OPTIONS https://api.vexto.pro/api/health \
  -H "Origin: https://vexto.pro" \
  -H "Access-Control-Request-Method: GET" \
  2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "2. Testing auth endpoint with CORS:"
curl -v -X OPTIONS https://api.vexto.pro/api/auth/discord/callback \
  -H "Origin: https://vexto.pro" \
  -H "Access-Control-Request-Method: GET" \
  2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "3. Check backend CORS_ORIGIN env:"
echo "SSH to server and run: cat ~/vexto.pro-project/backend/.env | grep CORS_ORIGIN"

echo ""
echo "=== Expected CORS_ORIGIN ==="
echo "CORS_ORIGIN=https://vexto.pro"
