# Database Setup - PostgreSQL

SIFIX dApp menggunakan PostgreSQL dengan Prisma ORM.

## Prerequisites

- PostgreSQL 14+ installed
- Node.js 18+

## Local Development Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
Download dari https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Login as postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE sifix;
CREATE USER sifix_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sifix TO sifix_user;

# Exit
\q
```

### 3. Configure Environment

Update `.env.local`:

```env
DATABASE_URL="postgresql://sifix_user:your_secure_password@localhost:5432/sifix?schema=public"
```

### 4. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations (production)
npx prisma migrate deploy
```

### 5. Seed Database (Optional)

```bash
npx prisma db seed
```

## Production Setup (Vercel)

### Option 1: Vercel Postgres (Recommended)

1. Go to Vercel Dashboard → Storage → Create Database
2. Select PostgreSQL
3. Copy connection string
4. Add to Vercel Environment Variables:
   ```
   DATABASE_URL=postgres://...
   ```

### Option 2: External PostgreSQL (Supabase, Railway, etc.)

1. Create PostgreSQL instance
2. Get connection string
3. Add to Vercel Environment Variables

## Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Push schema changes (dev)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Schema Overview

### Core Tables

- **addresses** - Wallet addresses with risk scores
- **threat_reports** - User-submitted threat reports
- **transaction_scans** - AI analysis results
- **reputation_scores** - User reputation system

### System Tables

- **user_profiles** - User settings and stats
- **search_history** - Search queries log
- **sync_logs** - 0G Storage sync status

## Backup & Restore

### Backup

```bash
pg_dump -U sifix_user -d sifix > backup.sql
```

### Restore

```bash
psql -U sifix_user -d sifix < backup.sql
```

## Troubleshooting

### Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U sifix_user -d sifix -h localhost
```

### Migration Errors

```bash
# Reset migrations (⚠️ dev only)
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset
```

### Permission Issues

```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE sifix TO sifix_user;
GRANT ALL ON SCHEMA public TO sifix_user;
```

## Performance Tips

1. **Indexes** - Already defined in schema for common queries
2. **Connection Pooling** - Use Prisma connection pooling in production
3. **Query Optimization** - Use Prisma Studio to inspect queries

## Security

- ✅ Never commit `.env.local` with real credentials
- ✅ Use strong passwords for production
- ✅ Enable SSL for production connections
- ✅ Restrict database access by IP
- ✅ Regular backups

## Migration from SQLite

Already done! Schema is compatible. Just:

1. Update `DATABASE_URL` in `.env.local`
2. Run `npx prisma db push`
3. Data migration (if needed): export from SQLite → import to PostgreSQL
