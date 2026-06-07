# Deployment Guide - Patchwell

This guide will help you deploy the Patchwell e-commerce store to production.

## ✅ Pre-Deployment Checklist

- [x] Project builds successfully (`npm run build`)
- [x] All pages render correctly in development
- [x] Cart functionality works
- [x] Product pages load with mock data
- [x] Responsive design tested
- [ ] Shopify store configured (optional)
- [ ] Environment variables set
- [ ] Custom domain ready (optional)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd Patchwell
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `patchwell` (or your choice)
   - Directory: `./`
   - Override settings: `N`

5. **Set Environment Variables (Optional):**
   ```bash
   vercel env add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
   vercel env add NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
   ```

6. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

Your site will be live at: `https://patchwell.vercel.app` (or your custom domain)

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `.next`

### Option 3: Custom Server (VPS/Cloud)

For AWS, Google Cloud, DigitalOcean, etc:

1. **SSH into your server**

2. **Install Node.js 18+:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd Patchwell
   npm install
   npm run build
   ```

4. **Set environment variables:**
   ```bash
   nano .env.local
   ```
   Add your Shopify credentials

5. **Install PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "patchwell" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx (reverse proxy):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Certbot:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## 🔐 Environment Variables

### Required (if using Shopify):
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

### Getting Shopify Credentials:

1. Go to your Shopify Admin Dashboard
2. Navigate to **Apps** → **Develop apps**
3. Click **Create an app**
4. Name it "Patchwell Frontend"
5. Go to **Configuration** → **Storefront API**
6. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
7. Click **Save** and **Install app**
8. Copy the **Storefront API access token**

## 🎨 Customization Before Deployment

### Update Mock Data (if not using Shopify):

Edit `Patchwell/lib/shopify/index.ts`:
- Update product information in `MOCK_PRODUCTS`
- Update collections in `MOCK_COLLECTIONS`
- Replace Unsplash image URLs with your own

### Update Branding:

1. **Logo**: Replace `public/images/logo.png`
2. **Colors**: Edit CSS variables in `app/globals.css`
3. **Content**: Update text in page components

### Add Google Analytics:

Edit `app/layout.tsx` and add:
```tsx
import Script from 'next/script';

// In the <head> section:
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

## 🧪 Testing Production Build Locally

Before deploying, test the production build:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and test:
- [ ] Homepage loads
- [ ] Shop page displays products
- [ ] Product details work
- [ ] Cart functionality
- [ ] Collections pages
- [ ] Search works
- [ ] FAQ and About pages
- [ ] Responsive on mobile

## 🔧 Troubleshooting

### Build Errors

**Error: Image optimization not working**
- Ensure image domains are configured in `next.config.js`
- Check `images.remotePatterns` includes your image hosts

**Error: Module not found**
- Run `npm install` to ensure all dependencies are installed
- Clear cache: `rm -rf .next node_modules && npm install`

**Error: Environment variables not working**
- Ensure `.env.local` exists and is properly formatted
- In production, set environment variables in your hosting platform
- Remember `NEXT_PUBLIC_` prefix for client-side variables

### Runtime Errors

**Cart not working**
- Check browser console for errors
- Clear localStorage
- Ensure CartProvider wraps the app in `layout.tsx`

**Products not loading**
- Check Shopify credentials if using real store
- Verify API token has correct permissions
- Check network tab for API errors

## 📊 Performance Optimization

### Before Production:

1. **Optimize Images:**
   - Use WebP format
   - Compress images (TinyPNG, Squoosh)
   - Ensure Next.js Image component is used

2. **Enable Analytics:**
   - Google Analytics
   - Vercel Analytics (if using Vercel)
   - Shopify Analytics

3. **SEO Checklist:**
   - Verify all pages have unique titles
   - Add Open Graph images
   - Submit sitemap to Google Search Console
   - Add structured data for products

4. **Security:**
   - Enable HTTPS (automatic on Vercel/Netlify)
   - Add security headers in `next.config.js`
   - Keep dependencies updated

## 🌐 Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

### DNS Configuration:
```
A Record:    @     →  [IP Address]
CNAME:       www   →  your-site.vercel.app
```

## 🔄 CI/CD Setup (Optional)

### GitHub Actions:

Create `.github/workflows/deploy.yml`:
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
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📈 Post-Deployment

1. **Test everything** on the live site
2. **Monitor performance** with Lighthouse
3. **Set up error tracking** (Sentry, LogRocket)
4. **Configure CDN** if needed
5. **Set up backups** for database/content

## 🎉 Success!

Your Patchwell store is now live! Here's what to do next:

- [ ] Test complete purchase flow
- [ ] Set up abandoned cart recovery
- [ ] Configure shipping rates in Shopify
- [ ] Add payment gateways
- [ ] Enable customer accounts
- [ ] Set up email notifications
- [ ] Create marketing campaigns

---

**Need Help?** Check the [README.md](README.md) for more information.
