# INAMSOS Deployment Quick Reference

## 🚀 Quick Start Commands

```bash
# Initial deployment
./scripts/deploy.sh

# Health check
./scripts/health-check.sh

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart services
docker-compose -f docker-compose.production.yml restart
```

## 🔧 Common Tasks

### Backup Database
```bash
./scripts/backup-database.sh
```

### Update Application
```bash
git pull origin main
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

### View Service Status
```bash
docker-compose -f docker-compose.production.yml ps
```

### Run Migrations
```bash
docker-compose -f docker-compose.production.yml exec backend npx prisma migrate deploy
```

## 🆘 Emergency Commands

### Stop All Services
```bash
docker-compose -f docker-compose.production.yml down
```

### Complete Restart
```bash
docker-compose -f docker-compose.production.yml restart
```

### Restore from Backup
```bash
gunzip -c backup.sql.gz | docker-compose -f docker-compose.production.yml exec -T postgres psql -U inamsos_prod -d inamsos_prod
```

## 📊 Monitoring

### Real-time Stats
```bash
docker stats
```

### Check Disk Space
```bash
df -h
docker system df
```

### Clean Up
```bash
docker system prune -a --volumes -f
```

## 🔐 Security

### Renew SSL
```bash
sudo certbot renew
docker-compose -f docker-compose.production.yml restart nginx
```

### Update Secrets
```bash
nano .env.production
docker-compose -f docker-compose.production.yml restart
```

## 📞 Support

- **Docs**: [deployment-guide.md](./deployment-guide.md)
- **Email**: tech-support@inamsos.kemenkes.go.id
- **Emergency**: +62-XXX-XXXX-XXXX
