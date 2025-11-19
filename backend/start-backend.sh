#!/bin/bash

# INAMSOS Backend Startup Script
echo "🇮🇩 Starting INAMSOS Cancer Registry Backend..."
echo "📊 Indonesian National Cancer Database System"
echo ""

# Kill any existing process on port 3334
fuser -k 3334/tcp 2>/dev/null || true

# Start the backend server
echo "🚀 Starting backend server on port 3334..."
PORT=3334 npx ts-node src/main.minimal.ts

echo ""
echo "✅ Backend startup completed!"
echo "🌐 API Base URL: http://localhost:3334/api/v1"
echo "💚 Health Check: http://localhost:3334/api/v1/health"
echo "🔗 Frontend should connect to: http://localhost:3334"