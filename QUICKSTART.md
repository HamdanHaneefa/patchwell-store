# Quick Start Guide - Patchwell

Get your Patchwell e-commerce store running in under 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd Patchwell
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:3000**

That's it! The app runs with mock data out of the box.

## 🎯 What You'll See

- **Homepage**: Full landing page with hero, products, reviews, and more
- **Shop**: All 6 wellness patches with filtering
- **Product Pages**: Detailed product views with variants
- **Cart**: Fully functional shopping cart
- **Collections**: Product categories (Sleep, Energy, Focus, Calm)
- **Search**: Product search functionality
- **FAQ**: Frequently asked questions
- **About**: Company information

## 🛍️ Testing the Cart

1. Click any product
2. Select variant (pack size)
3. Click "Add to Cart"
4. Cart drawer opens automatically
5. Adjust quantities or remove items
6. Click "Secure Checkout" (redirects to Shopify checkout URL)

## 🎨 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --color-accent: #7c6b8a;  /* Your brand color */
  --color-dark: #2e2a39;    /* Primary dark */
}
```

### Update Logo
Replace `public/images/logo.png` with your logo (recommended: 200x60px)

### Modify Products
Edit mock products in `lib/shopify/index.ts`:
```typescript
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Your Product Name',
    price: '19.99',
    // ... more fields
  }
];
```

## 🔌 Connect to Shopify (Optional)

### Step 1: Create Shopify Store
1. Sign up at [shopify.com](https://shopify.com)
2. Create a new store

### Step 2: Get API Credentials
1. Go to **Apps** → **Develop apps**
2. Create new app
3. Enable Storefront API
4. Copy access token

### Step 3: Add to .env.local
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
```

### Step 4: Restart Server
```bash
npm run dev
```

Now your products load from Shopify!

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Your site will be live in seconds!

## 📖 Need More Help?

- **Full Documentation**: See [README.md](README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Complete Features**: See [FEATURES.md](FEATURES.md)

## 🐛 Common Issues

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Build Errors
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

### Images Not Loading
- Mock products use Unsplash URLs (may 404)
- Replace with your own images in `lib/shopify/index.ts`
- Or connect real Shopify store

## ✅ Next Steps

1. ✅ Run the dev server
2. ✅ Browse the site
3. ✅ Test cart functionality
4. ⬜ Customize colors and branding
5. ⬜ Add your products
6. ⬜ Deploy to production

## 💡 Tips

- **Hot Reload**: Changes auto-refresh in dev mode
- **TypeScript**: Get type hints in VS Code
- **CSS**: All styles in `app/globals.css`
- **Components**: Reusable components in `components/`

---

**Happy Selling! 🎉**
