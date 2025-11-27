# Deployment Guide

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

\`\`\`bash
git init
git add .
git commit -m "Initial commit: TaskFlow platform"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

### Step 2: Connect to Vercel

1. Go to vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the project root directory

### Step 3: Configure Environment Variables

In Vercel project settings, add:

\`\`\`
DATABASE_URL=postgresql://user:password@host:5432/taskflow
JWT_SECRET=your-super-secret-key
NEXT_PUBLIC_URL=https://your-domain.com
RESEND_API_KEY=re_xxx (optional)
STRIPE_SECRET_KEY=sk_xxx (optional)
STRIPE_PUBLISHABLE_KEY=pk_xxx (optional)
\`\`\`

### Step 4: Database Setup

For production, use a managed database:

- **Vercel Postgres** (easiest)
- **Neon** (PostgreSQL)
- **Supabase** (PostgreSQL with auth)
- **RDS** (AWS)

After setting up, update DATABASE_URL.

### Step 5: Run Migrations

Once deployed:

\`\`\`bash
# Connect to your Vercel project
vercel env pull

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
\`\`\`

### Step 6: Deploy

Push to main branch:

\`\`\`bash
git push origin main
\`\`\`

Vercel will automatically build and deploy.

## Self-Hosted Deployment

### Prerequisites

- Linux server (Ubuntu 22.04+)
- Node.js 18+
- PostgreSQL 14+
- Git

### Step 1: Setup Server

\`\`\`bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
\`\`\`

### Step 2: Setup Database

\`\`\`bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE taskflow;
CREATE USER taskflow_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE taskflow TO taskflow_user;

# Exit psql
\q
\`\`\`

### Step 3: Clone Repository

\`\`\`bash
cd /var/www
git clone <your-repo-url> taskflow
cd taskflow

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
\`\`\`

### Step 4: Build Application

\`\`\`bash
# Build Next.js
npm run build

# Test production build
npm run start
\`\`\`

### Step 5: Setup PM2

\`\`\`bash
# Create PM2 config
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: "taskflow",
    script: "npm start",
    cwd: "/var/www/taskflow",
    env: {
      NODE_ENV: "production"
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Setup startup
pm2 startup
pm2 save
\`\`\`

### Step 6: Configure Nginx

\`\`\`bash
# Create Nginx config
sudo tee /etc/nginx/sites-available/taskflow > /dev/null << EOF
upstream taskflow {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://taskflow;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
\`\`\`

### Step 7: Setup SSL

\`\`\`bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew SSL
sudo systemctl enable certbot.timer
\`\`\`

### Step 8: Migrate Database

\`\`\`bash
cd /var/www/taskflow
npx prisma migrate deploy
npx prisma db seed
\`\`\`

## Monitoring

### Logs

\`\`\`bash
# View PM2 logs
pm2 logs

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql.log
\`\`\`

### Health Check

\`\`\`bash
# Check application health
curl https://your-domain.com/api/health
\`\`\`

## Backup Strategy

### Daily Backups

\`\`\`bash
# Create backup script
cat > /usr/local/bin/backup-taskflow.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/taskflow"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump taskflow | gzip > $BACKUP_DIR/taskflow_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "taskflow_*.sql.gz" -mtime +30 -delete

echo "Backup completed: taskflow_$DATE.sql.gz"
EOF

chmod +x /usr/local/bin/backup-taskflow.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-taskflow.sh") | crontab -
\`\`\`

## Troubleshooting

### Port Already in Use
\`\`\`bash
sudo lsof -i :3000
kill -9 <PID>
\`\`\`

### Database Connection Issues
\`\`\`bash
# Test connection
psql -h localhost -U taskflow_user -d taskflow
\`\`\`

### PM2 Not Starting
\`\`\`bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 list
\`\`\`

## Performance Optimization

- Enable database query caching
- Use CDN for static assets
- Implement Redis for session storage
- Enable gzip compression in Nginx
- Monitor and optimize slow queries
