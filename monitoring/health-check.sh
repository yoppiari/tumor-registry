#!/bin/bash
# INAMSOS Health Monitoring Script

echo "=== INAMSOS SYSTEM HEALTH CHECK ==="
echo "Timestamp: $(date)"
echo "Environment: Production Pilot"
echo

# Check backend health
echo "🔍 Backend API Health Check..."
if curl -f -s http://localhost:3001/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend API: HEALTHY"
    echo "   - URL: http://localhost:3001/api/v1"
    echo "   - Status: Responding normally"
else
    echo "❌ Backend API: UNHEALTHY"
    echo "   - URL: http://localhost:3001/api/v1"
    echo "   - Status: Not responding"
fi

echo

# Check frontend health
echo "🎨 Frontend Health Check..."
if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: HEALTHY"
    echo "   - URL: http://localhost:3000"
    echo "   - Status: Accessible"
else
    echo "❌ Frontend: UNHEALTHY"
    echo "   - URL: http://localhost:3000"
    echo "   - Status: Not accessible"
fi

echo

# Check configuration files
echo "📋 Configuration Files Check..."
config_count=$(find config/hospitals -name "config.json" | wc -l)
echo "Hospital configurations: $config_count/3"

if [ "$config_count" -eq 3 ]; then
    echo "✅ All hospital configurations present"
else
    echo "⚠️ Missing hospital configurations"
fi

echo

# System resources
echo "💻 System Resources Check..."
echo "Disk usage: $(df -h . | tail -1 | awk '{print $5}')"
echo "Memory usage: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
echo "Load average: $(uptime | awk -F'load average:' '{print $2}')"

echo
echo "=== HEALTH CHECK COMPLETED ==="
