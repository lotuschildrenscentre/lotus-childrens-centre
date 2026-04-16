# Deployment Guide — Lotus Children's Centre

This guide explains how to deploy the Lotus Children's Centre website on your own infrastructure, completely independent of Manus. The project is a full-stack Node.js application (React + Express + MySQL) and requires a server that can run Node.js and a MySQL-compatible database.

---

## Architecture Overview

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite | Built into static files, served by the Express server |
| Backend | Node.js 22 + Express 4 + tRPC | Single server process |
| Database | MySQL 8 / PlanetScale / TiDB | Any MySQL-compatible service works |
| File Storage | S3-compatible API | Used for image/logo uploads |
| Authentication | Manus OAuth | Required for admin login |

---

## Step 1 — Export Code to GitHub

Before deploying anywhere, export the code to your own GitHub repository:

1. In the Manus Management UI, go to **Settings → GitHub**.
2. Choose your GitHub account and create a new repository (e.g. `lotus-childrens-centre`).
3. Click **Export** — Manus will push all code to your repository.
4. You now own the code permanently.

---

## Step 2 — Set Up a MySQL Database

You need a MySQL 8-compatible database. The recommended free/low-cost options are:

| Service | Free Tier | Notes |
|---|---|---|
| **PlanetScale** | Yes (hobby plan) | MySQL-compatible, serverless, easy setup |
| **Railway MySQL** | Yes (small usage) | Managed MySQL, same platform as the app |
| **Aiven** | Yes (free tier) | Managed MySQL, good for production |
| **Supabase** (Postgres) | No — MySQL only | Not compatible |

After creating your database, copy the **connection string** (format: `mysql://user:password@host:port/dbname`). You will need this as `DATABASE_URL`.

### Run Database Migrations

After your first deployment, run the migration command once to create all tables:

```bash
pnpm db:push
```

This command generates and applies all Drizzle migrations to your database.

---

## Step 3 — Set Up File Storage

The website uses an S3-compatible API for uploading partner logos, gallery images, and team photos. You have two options:

**Option A — Keep using Manus Storage (recommended while transitioning)**
Copy the current `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY` values from your Manus project secrets. These will continue to work even after you stop the Manus subscription for a grace period.

**Option B — Use your own S3 bucket (for full independence)**
Set up an AWS S3 bucket or a compatible service (Cloudflare R2, Backblaze B2). You will need to update `server/storage.ts` to use the AWS SDK directly with your own credentials. This requires a small code change — contact a developer if needed.

---

## Step 4 — Set Up Authentication

The admin login uses Manus OAuth. To keep using it after cancelling your Manus subscription, you have two options:

**Option A — Keep Manus OAuth (simplest)**
The OAuth credentials (`VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`) continue to work independently of the hosting subscription. Copy these values from your Manus project secrets.

**Option B — Replace with a different auth system**
You can replace the Manus OAuth with any standard OAuth provider (Google, GitHub) or a username/password system. This requires code changes to `server/_core/oauth.ts` and `client/src/const.ts`.

---

## Deployment Option A — Railway (Recommended)

Railway is the simplest option. It supports Node.js natively and has a built-in MySQL add-on.

### Steps

1. Go to [railway.app](https://railway.app) and sign up with your GitHub account.
2. Click **New Project → Deploy from GitHub repo** and select your repository.
3. Railway will detect the `railway.json` file and configure the build automatically.
4. Add a **MySQL** database plugin: click **New → Database → MySQL** in your project.
5. Railway will automatically set `DATABASE_URL` from the MySQL plugin.
6. Go to your web service → **Variables** and add all required environment variables (see table below).
7. Click **Deploy**. Railway will build and start the server.
8. After the first deploy, open the Railway shell and run `pnpm db:push` to create the database tables.
9. Go to **Settings → Domains** to add your custom domain.

### Required Environment Variables for Railway

| Variable | Where to get it | Required |
|---|---|---|
| `DATABASE_URL` | Auto-set by Railway MySQL plugin | Yes |
| `JWT_SECRET` | Generate a random 64-character string | Yes |
| `VITE_APP_ID` | Copy from Manus project secrets | Yes |
| `OAUTH_SERVER_URL` | Copy from Manus project secrets | Yes |
| `VITE_OAUTH_PORTAL_URL` | Copy from Manus project secrets | Yes |
| `OWNER_OPEN_ID` | Copy from Manus project secrets | Yes |
| `OWNER_NAME` | Copy from Manus project secrets | Yes |
| `BUILT_IN_FORGE_API_URL` | Copy from Manus project secrets | Yes (for file uploads) |
| `BUILT_IN_FORGE_API_KEY` | Copy from Manus project secrets | Yes (for file uploads) |
| `VITE_FRONTEND_FORGE_API_KEY` | Copy from Manus project secrets | Yes |
| `VITE_FRONTEND_FORGE_API_URL` | Copy from Manus project secrets | Yes |
| `VITE_APP_TITLE` | `Lotus Children's Centre` | Yes |
| `NODE_ENV` | `production` | Yes |

> **Important:** Variables starting with `VITE_` are baked into the frontend at build time. If you change them, you must trigger a new build.

---

## Deployment Option B — Render.com

Render is another simple option with a generous free tier.

### Steps

1. Go to [render.com](https://render.com) and sign up with your GitHub account.
2. Click **New → Web Service** and connect your GitHub repository.
3. Render will detect the `render.yaml` file automatically.
4. Create a separate **MySQL** database: click **New → MySQL** (or use PlanetScale for the free tier).
5. Copy the database connection string and set it as `DATABASE_URL` in your web service environment variables.
6. Add all other required environment variables from the table above.
7. Click **Create Web Service**. Render will build and deploy.
8. After the first deploy, use the Render shell to run `pnpm db:push`.
9. Go to **Settings → Custom Domains** to add your domain.

---

## Deployment Option C — VPS with Docker (Full Control)

For maximum control and lowest long-term cost, deploy on a VPS using Docker.

### Recommended VPS Providers

| Provider | Cheapest Plan | Notes |
|---|---|---|
| **Hetzner** | ~€4/mo (CX22) | Best value, EU-based |
| **DigitalOcean** | $6/mo (Basic) | Easy to use, good docs |
| **Vultr** | $6/mo | Good global coverage |

### Steps

```bash
# 1. SSH into your VPS
ssh root@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com | sh

# 3. Install Docker Compose
apt install docker-compose-plugin -y

# 4. Clone your repository
git clone https://github.com/your-username/lotus-childrens-centre.git
cd lotus-childrens-centre

# 5. Create your environment file
# Copy all required variables from the table above into a .env file
nano .env

# 6. Build and start the container
docker build -t lotus-app .
docker run -d \
  --name lotus-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  lotus-app

# 7. Run database migrations (first time only)
docker exec lotus-app sh -c "pnpm db:push"

# 8. Set up Nginx as a reverse proxy (optional, for custom domain + HTTPS)
apt install nginx certbot python3-certbot-nginx -y
```

### Nginx Configuration (for custom domain)

Create `/etc/nginx/sites-available/lotus`:

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then enable it and get an SSL certificate:

```bash
ln -s /etc/nginx/sites-available/lotus /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Finding Your Manus Secret Values

To copy your current environment variable values from Manus before cancelling:

1. In the Manus Management UI, go to **Settings → Secrets**.
2. You will see all the environment variables listed. Copy each value.
3. Store them securely (e.g. in a password manager or a private `.env` file).

Alternatively, you can view them in the sandbox terminal:

```bash
# In the Manus sandbox terminal
printenv | grep -E "VITE_APP_ID|OAUTH|JWT_SECRET|OWNER|FORGE"
```

---

## After Deployment — Checklist

- [ ] Visit the live URL and confirm the homepage loads
- [ ] Test the admin panel at `/admin` — log in with your Manus account
- [ ] Upload a test gallery image to confirm file storage works
- [ ] Add a test partner logo in Admin → Our Partners
- [ ] Submit a test contact form to confirm the database is writing correctly
- [ ] Set up your custom domain and confirm HTTPS is working
- [ ] Set up automatic database backups (most managed DB services offer this)

---

## Keeping the Site Updated

After making code changes in the future:

```bash
# Pull latest code
git pull origin main

# Rebuild and restart (Docker)
docker build -t lotus-app . && docker stop lotus-app && docker rm lotus-app
docker run -d --name lotus-app --restart unless-stopped -p 3000:3000 --env-file .env lotus-app

# Or on Railway/Render: simply push to GitHub — it redeploys automatically
git push origin main
```

---

## Support

If you encounter issues during deployment, the following resources are helpful:

- **Railway docs:** [docs.railway.app](https://docs.railway.app)
- **Render docs:** [render.com/docs](https://render.com/docs)
- **Drizzle ORM docs:** [orm.drizzle.team](https://orm.drizzle.team)
- **PlanetScale docs:** [planetscale.com/docs](https://planetscale.com/docs)
