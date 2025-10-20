# GULL Deployment Guide

## Overview

This guide covers deploying GULL Accounting Management System to production.

---

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Supabase project created
- [ ] Database migrated
- [ ] RLS policies tested
- [ ] Performance optimized
- [ ] Security reviewed

---

## Deployment Options

### Option 1: Vercel (Recommended) ⚡

**Why Vercel:**
- Zero configuration
- Automatic deployments
- Edge network (fast globally)
- Free SSL
- Preview deployments
- Analytics included

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     VITE_ENABLE_OFFLINE_MODE=false
     ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

6. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your domain
   - Update DNS records

**vercel.json** (optional configuration):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

### Option 2: Netlify 🎯

**Steps:**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Configure Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add variables (same as Vercel)

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

### Option 3: GitHub Pages 📦

**Steps:**

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/repository-name/', // Your repo name
     plugins: [react(), VitePWA({...})],
   })
   ```

3. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: gh-pages branch
   - Save

**Note:** GitHub Pages doesn't support environment variables easily. Consider using a different host for production with Supabase.

---

### Option 4: Self-Hosted (Docker) 🐳

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_ENABLE_OFFLINE_MODE=false

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_ENABLE_OFFLINE_MODE=$VITE_ENABLE_OFFLINE_MODE

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  gull:
    build:
      context: .
      args:
        VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
        VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY}
    ports:
      - "80:80"
    restart: unless-stopped
```

**Deploy:**
```bash
docker-compose up -d
```

---

## Supabase Setup for Production

### 1. Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose production-tier plan
4. Select region closest to users
5. Set strong database password
6. Wait for provisioning

### 2. Run Migration

**Option A: SQL Editor**
1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Run query
4. Verify in Table Editor

**Option B: Supabase CLI**
```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-production-ref

# Run migrations
supabase db push
```

### 3. Configure Authentication

1. Go to Authentication → Providers
2. Enable **Email** provider
3. Configure email templates:
   - Confirmation email
   - Password reset
   - Magic link (optional)

4. Set Site URL:
   - Go to Authentication → URL Configuration
   - Set Site URL to your production URL
   - Add Redirect URLs:
     - `https://yourdomain.com`
     - `https://yourdomain.com/**`

### 4. Configure Storage (Optional)

If using file uploads in future:
1. Go to Storage
2. Create buckets
3. Set RLS policies
4. Configure CORS

### 5. Set Up Database Backups

1. Go to Settings → Database
2. Enable automatic backups
3. Configure retention period
4. Test restore procedure

### 6. Monitor & Alerts

1. Go to Reports → Usage
2. Set up alerts:
   - Database size
   - API requests
   - Auth users
3. Monitor query performance
4. Review logs regularly

---

## Environment Variables

### Production `.env` (never commit!)

```env
# Supabase
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# App Config
VITE_ENABLE_OFFLINE_MODE=false
VITE_APP_NAME=GULL
VITE_APP_VERSION=1.0.0

# Analytics (optional)
VITE_GA_TRACKING_ID=UA-XXXXX-X
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Feature Flags (optional)
VITE_FEATURE_AUDIO=true
VITE_FEATURE_REALTIME=true
```

---

## Performance Optimization

### 1. Build Optimization

Already configured in `vite.config.ts`:
- Code splitting
- Tree shaking
- Minification
- PWA caching

### 2. CDN Configuration

If using Vercel/Netlify, CDN is automatic. For self-hosted:
- Use Cloudflare
- Configure caching rules
- Enable compression

### 3. Image Optimization

```bash
# Optimize PWA icons
npm install -D imagemin imagemin-pngquant

# Create script
npx imagemin public/*.png --out-dir=public/optimized
```

### 4. Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({ open: true })
]

# Build and see report
npm run build
```

---

## Security Checklist

- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] Environment variables not in code
- [ ] `.env` in `.gitignore`
- [ ] API keys rotated for production
- [ ] RLS policies tested
- [ ] SQL injection prevented (Supabase handles)
- [ ] XSS prevention (React handles)
- [ ] CSRF protection (Supabase handles)
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting (Supabase provides)

---

## Monitoring & Analytics

### 1. Supabase Monitoring

- Database performance
- API usage
- Auth metrics
- Error logs

### 2. Application Monitoring

**Sentry (Error Tracking):**
```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
```

**Google Analytics:**
```typescript
// src/utils/analytics.ts
export const trackEvent = (category: string, action: string) => {
  if (window.gtag) {
    window.gtag('event', action, { event_category: category });
  }
};
```

### 3. Custom Logging

```typescript
// src/utils/logger.ts
export const log = {
  info: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, data);
    }
    // Send to logging service in production
  },
  error: (message: string, error: unknown) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to Sentry or similar
  }
};
```

---

## CI/CD Pipeline

### GitHub Actions

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Rollback Strategy

### Vercel/Netlify
- Previous deployments available
- One-click rollback from dashboard
- Or use CLI:
  ```bash
  vercel rollback
  ```

### Self-Hosted
- Keep previous Docker images:
  ```bash
  docker tag gull:latest gull:v1.0.0
  ```
- Deploy specific version:
  ```bash
  docker-compose up -d gull:v1.0.0
  ```

### Database
- Supabase maintains automatic backups
- Test restore before rollback
- Consider migration rollback scripts

---

## Post-Deployment

### 1. Smoke Tests

- [ ] Homepage loads
- [ ] Sign up works
- [ ] Sign in works
- [ ] Create project
- [ ] Add transaction
- [ ] View dashboard
- [ ] Export works
- [ ] No console errors

### 2. Performance Check

- Run Lighthouse audit
- Check load times
- Monitor server metrics
- Review error rates

### 3. User Communication

- Announce deployment
- Document new features
- Provide support channels
- Gather feedback

---

## Scaling Considerations

### Database
- Supabase auto-scales with plan
- Consider read replicas for high traffic
- Index optimization
- Query optimization

### Frontend
- CDN handles scaling automatically
- Consider edge caching
- Optimize images
- Code splitting already implemented

### Costs
- Supabase: Based on usage
- Vercel: Free for hobby, paid for team
- Monitor usage to avoid surprises

---

## Backup & Disaster Recovery

### 1. Database Backups
- Automated daily (Supabase)
- Test restore monthly
- Keep 30 days of backups

### 2. Code Backups
- GitHub is source of truth
- Tag releases: `git tag v1.0.0`
- Keep production branch protected

### 3. Recovery Plan
1. Identify issue
2. Roll back deployment if needed
3. Restore database if needed
4. Communicate with users
5. Post-mortem analysis

---

## Support & Maintenance

### Regular Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Monitor database size

**Monthly:**
- Update dependencies
- Security audit
- Backup verification
- Performance optimization

**Quarterly:**
- Major updates
- Feature releases
- User feedback review

---

## Helpful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check

# Lint
npm run lint

# Deploy to Vercel
vercel --prod

# View Vercel logs
vercel logs

# Check deployment status
vercel ls

# Supabase status
supabase status

# Supabase logs
supabase db logs
```

---

## Troubleshooting

### Build Fails
- Check environment variables
- Verify all dependencies installed
- Clear cache: `rm -rf node_modules dist .vite`
- Reinstall: `npm install`

### Deploy Succeeds but App Doesn't Work
- Check console for errors
- Verify environment variables set correctly
- Check network tab for failed API calls
- Verify Supabase URL and keys

### Database Connection Issues
- Verify Supabase project is active
- Check RLS policies
- Verify API keys
- Check network/firewall

### Performance Issues
- Check bundle size
- Review Lighthouse report
- Optimize images
- Enable caching
- Use CDN

---

## Resources

- **Vite Documentation**: https://vitejs.dev/
- **Vercel Documentation**: https://vercel.com/docs
- **Netlify Documentation**: https://docs.netlify.com/
- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev/

---

**Deployment Checklist Complete!** 🚀✅

Your GULL app is now ready for production!

