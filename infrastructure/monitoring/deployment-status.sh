#!/bin/bash
# INAMSOS Deployment Status Monitor

echo "=== INAMSOS DEPLOYMENT STATUS ==="
echo "Timestamp: $(date)"
echo "Deployment Phase: Pilot Implementation"
echo

# System status
echo "🚀 System Components Status:"
echo

# Backend status
if pgrep -f "nest start" > /dev/null; then
    echo "✅ Backend Service: RUNNING"
    backend_pid=$(pgrep -f "nest start")
    echo "   - PID: $backend_pid"
    echo "   - Port: 3001"
else
    echo "❌ Backend Service: NOT RUNNING"
fi

echo

# Frontend status
if pgrep -f "next dev" > /dev/null; then
    echo "✅ Frontend Service: RUNNING"
    frontend_pid=$(pgrep -f "next dev")
    echo "   - PID: $frontend_pid"
    echo "   - Port: 3000"
else
    echo "❌ Frontend Service: NOT RUNNING"
fi

echo

# Hospital readiness
echo "🏥 Pilot Hospital Readiness:"
hospitals=("rs-kanker-dharmais" "rsupn-cipto-mangunkusumo" "rs-kanker-soeharto")

for hospital in "${hospitals[@]}"; do
    if [ -f "config/hospitals/$hospital/config.json" ]; then
        echo "✅ $hospital: CONFIGURED"
    else
        echo "❌ $hospital: NOT CONFIGURED"
    fi
done

echo
echo "=== DEPLOYMENT STATUS COMPLETED ==="
