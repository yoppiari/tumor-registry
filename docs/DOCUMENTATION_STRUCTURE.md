# Documentation Structure

This document describes the organized structure of the INAMSOS Cancer Registry System documentation.

## Directory Structure

```
tumor-registry/
├── backend/                  # Backend NestJS application
│   └── prisma/               # Database schema, migrations, and seed files
├── frontend/                 # Frontend Next.js application
├── docs/                     # All documentation
│   ├── assets/
│   │   ├── screenshots/      # UI screenshots and test results
│   │   └── images/           # Other image assets
│   ├── deployment/           # Deployment guides and infrastructure docs
│   ├── guides/               # User and developer guides
│   ├── reports/              # Implementation and status reports
│   ├── testing/              # Test files, snapshots, and logs
│   └── sprint-artifacts/     # Sprint-specific deliverables
├── infrastructure/           # Infrastructure configuration
│   ├── monitoring/           # Prometheus, Grafana, Alertmanager configs
│   ├── nginx/                # Nginx reverse proxy configuration
│   └── postgres-init/        # PostgreSQL initialization scripts
├── config/                   # Application configuration
│   ├── hospitals/            # Hospital-specific configurations
│   └── redis.conf            # Redis configuration
├── scripts/                  # Utility scripts
├── ssl/                      # SSL certificates (not in git)
└── [core files]             # README, docker-compose, dev.sh, etc.
```

## Documentation Categories

### `/docs/deployment/`
Deployment-related documentation:
- `PILOT_DEPLOYMENT_GUIDE.md` - Guide for pilot deployment
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Production deployment procedures
- `README_DEVELOPMENT.md` - Development environment setup
- `README_PRODUCTION.md` - Production environment documentation
- `SIMPLE_LOCAL_SETUP.md` - Quick local setup guide
- `hospital-selection-matrix.md` - Hospital selection criteria
- `resource-allocation-plan.md` - Resource planning
- `risk-assessment-matrix.md` - Risk analysis
- `success-metrics-dashboard.md` - Success metrics tracking

### `/docs/guides/`
User and developer guides:
- `INAMSOS-USER-ROLES-COMPLETE-GUIDE.md` - Complete user roles documentation
- `SYSTEM-ADMIN-USER-MANAGEMENT-GUIDE.md` - Admin guide for user management
- `CONTRIBUTING.md` - Contribution guidelines
- `DEVELOPMENT_GUIDE.md` - Developer setup and workflows
- `FRONTEND_ACCESS_GUIDE.md` - Frontend access and usage

### `/docs/reports/`
Implementation reports and status updates:
- `EPIC-3-IMPLEMENTATION-REPORT.md` - Epic 3 implementation summary
- `EPIC-6-IMPLEMENTATION-SUMMARY.md` - Epic 6 implementation details
- `EPIC-6-FILES-LIST.md` - Epic 6 file inventory
- `SPRINT-2-API-REFERENCE.md` - Sprint 2 API documentation
- `SPRINT-2-IMPLEMENTATION-REPORT.md` - Sprint 2 implementation status
- `SPRINT_3_IMPLEMENTATION_SUMMARY.md` - Sprint 3 summary
- `FRONTEND-IMPLEMENTATION-ANALYSIS.md` - Frontend implementation analysis
- `PERFORMANCE_OPTIMIZATION_SUMMARY.md` - Performance optimization details
- `SERVER_STATUS.md` - Server status documentation

### `/docs/testing/`
Test files, snapshots, and logs:
- `CHROME-DEVTOOLS-DASHBOARD-TEST-REPORT.md` - Chrome DevTools test results
- `*.md` - Various test snapshots (login tests, UI snapshots, etc.)
- `*.html` - Test HTML files
- `*.log` - Historical log files from testing

### `/docs/assets/screenshots/`
Screenshots and visual documentation:
- Login flow screenshots
- Dashboard screenshots
- UI test results
- Error state captures

## Other Directories

### `/infrastructure/`
Infrastructure configuration and deployment:
- `/monitoring/` - Prometheus, Grafana, Alertmanager configuration
- `/nginx/` - Nginx reverse proxy configuration
- `/postgres-init/` - PostgreSQL initialization scripts

### `/config/`
Application-specific configuration:
- `/hospitals/` - Hospital-specific configurations for multi-tenant setup
- `redis.conf` - Redis server configuration

### `/backend/prisma/`
Database-related files (moved from root):
- Database schema definition
- Migration files
- Seed data files (`init.sql`, `seed.sql`)

## Root Directory Files

Essential project files remain in the root:
- `README.md` - Main project documentation
- `docker-compose.yml` - Docker configuration
- `dev.sh` - Development startup script
- `.env` - Environment configuration
- `sprint-rollout-status.yaml` - Current sprint status

## Accessing Documentation

### For Developers
1. Start with `/docs/guides/DEVELOPMENT_GUIDE.md`
2. Review `/docs/deployment/README_DEVELOPMENT.md` for local setup
3. Check `/docs/guides/CONTRIBUTING.md` for contribution guidelines

### For System Administrators
1. Review `/docs/guides/SYSTEM-ADMIN-USER-MANAGEMENT-GUIDE.md`
2. Check `/docs/deployment/PRODUCTION_DEPLOYMENT_GUIDE.md`
3. Reference `/docs/guides/INAMSOS-USER-ROLES-COMPLETE-GUIDE.md`

### For Project Managers
1. Check `/docs/reports/` for implementation status
2. Review `sprint-rollout-status.yaml` for current progress
3. Access `/docs/deployment/success-metrics-dashboard.md` for metrics

## File Organization Principles

1. **Separation of Concerns**: Documentation is organized by purpose (deployment, guides, reports, testing)
2. **Logical Grouping**: Related files are kept together
3. **Clear Naming**: Files use descriptive names indicating their content
4. **Asset Management**: Binary files (images, screenshots) are separate from text documentation
5. **Root Minimalism**: Only essential project files remain in root directory

## Maintenance

- Keep documentation up to date as features are added
- Archive old implementation reports when no longer relevant
- Update this structure document when adding new categories
- Screenshots and test files should be cleaned periodically

---
**Last Updated**: 2025-11-21
**Organized by**: Claude Code (Automated Organization)
