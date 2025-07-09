# Docker Setup Guide for WSL 2

## Problem: Docker Compose not found in WSL 2

This issue occurs when Docker Desktop isn't properly integrated with WSL 2.

## Solution Steps:

### 1. Install Docker Desktop for Windows

- Download from: https://www.docker.com/products/docker-desktop
- Install and restart your computer

### 2. Enable WSL 2 Integration

1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Enable "Enable integration with my default WSL distro"
4. Enable integration for your specific distro (e.g., Ubuntu)
5. Click "Apply & Restart"

### 3. Restart WSL

In Windows PowerShell (as Administrator):

```powershell
wsl --shutdown
```

### 4. Restart your WSL terminal

Close and reopen your WSL terminal.

### 5. Verify Installation

```bash
# Run the troubleshoot script
npm run docker:troubleshoot

# Or check manually
docker --version
docker compose version
```

## Alternative: Manual Docker Setup

If you still have issues, you can start PostgreSQL manually:

```bash
# Pull PostgreSQL image
docker pull postgres:15-alpine

# Run PostgreSQL container
docker run -d \
  --name bookscape-postgres \
  -e POSTGRES_DB=bookscape_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine

# Check if it's running
docker ps
```

## Test Database Connection

Once Docker is working, test your setup:

```bash
# Setup with our script
npm run docker:setup

# Or simple setup
npm run docker:simple

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start the server
npm run dev
```

## Common Issues:

### "Docker daemon not running"

- Start Docker Desktop
- Wait for it to fully initialize (green icon in system tray)

### "Cannot connect to Docker daemon"

- Restart Docker Desktop
- Run `wsl --shutdown` in PowerShell and restart WSL

### "Permission denied"

- Run Docker Desktop as Administrator
- Check WSL 2 integration settings

## Quick Commands:

```bash
# Check Docker status
npm run docker:troubleshoot

# Start simple PostgreSQL only
npm run docker:simple

# View container logs
docker logs bookscape-postgres

# Connect to PostgreSQL
docker exec -it bookscape-postgres psql -U postgres -d bookscape_db
```
