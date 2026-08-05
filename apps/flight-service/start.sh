#!/bin/sh

set -e

echo "======================================"
echo "Running Prisma migrations..."
echo "======================================"

cd /app/apps/flight-service

npx prisma migrate deploy

echo "======================================"
echo "Starting Flight Service..."
echo "======================================"

exec node /app/apps/flight-service/dist/main.js
