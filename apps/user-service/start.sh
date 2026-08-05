#!/bin/sh

set -e

echo "======================================"
echo "Running Prisma migrations..."
echo "======================================"

cd /app/apps/user-service

npx prisma migrate deploy

echo "======================================"
echo "Starting User Service..."
echo "======================================"

exec node /app/apps/user-service/dist/main.js
