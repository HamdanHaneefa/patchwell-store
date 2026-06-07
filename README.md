# Patchwell - Premium Wellness Patches E-Commerce Store

A fully functional Next.js 14 e-commerce application for selling transdermal wellness patches. Built with TypeScript, React, and integrated with Shopify Storefront API (with mock data fallback).

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse all wellness patches with filtering by category, price, and sale status
- **Product Details**: Individual product pages with image galleries, variant selection, and detailed descriptions
- **Shopping Cart**: Full cart functionality with add/remove items, quantity adjustment, and checkout
- **Collections**: Organized product collections (Sleep, Energy, Focus, Calm)
- **Search**: Product search functionality
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop

### Pages
- **Home**: Hero section, featured products, how it works, benefits, reviews, and email signup
- **Shop**: All products with advanced filtering sidebar
- **Product Detail**: Full product information with variant selector and add to cart
- **Collections**: Category-specific product pages
- **Cart**: Full cart page with summary and checkout
- **FAQ**: Accordion-style frequently asked questions
- **About**: Company story, mission, science, and values

### Components
- Reusable UI components (buttons, cards, forms)
- Product components (card, grid, filters, images, variant selector)
- Cart components (drawer, items, summary)
- Home page sections (hero, features, reviews, email signup)
- Layout components (header, footer, announcement bar)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS with design tokens
- **Icons**: Lucide React
- **E-commerce**: Shopify Storefront API integration
- **State Management**: React Context API (Cart)
- **Image Optimization**: Next.js Image component

## 📦 Project Structure

```
Patchwell/
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── cart/                     # Cart page
│   ├── collections/[handle]/     # Dynamic collection pages
│   ├── faq/                      # FAQ page
│   ├── shop/                     # Shop pages
│   │   ├── [handle]/             # Dynamic product pages
│   │   ├── page.tsx              # Shop listing
│   │   └── ShopClient.tsx        # Client-side filtering
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── cart/                     # Cart components
│   ├── home/                     # Home page sections
│   ├── layout/                   # Header, Footer, Announcement
│   ├── product/                  # Product components
│   └── shop/                     # Shop components
├── context/
│   └── CartContext.tsx           # Shopping cart state
├── lib/
│   └── shopify/                  # Shopify API integration
│       ├── index.ts              # Main API functions
│       ├── types.ts              # TypeScript types
│       └── queries/              # GraphQL queries
├── public/
│   └── images/                   # Static assets
└── .env.local                    # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd Patchwell
   npm install
   ```

2. **Configure environment variables:**
   
   Edit `.env.local` with your Shopify credentials:
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   ```

   **Note**: The app works with mock data if Shopify isn't configured.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

### Color Palette
- **Background**: Warm cream tones (#fdfaf6, #f7f5f0)
- **Primary**: Dark purple (#2e2a39)
- **Accent**: Muted plum (#7c6b8a)
- **Success**: Green (#4caf7d)
- **Sale**: Red (#e22828)

### Typography
- **Headings**: Outfit (Google Fonts)
- **Body**: Nunito Sans (Google Fonts)

### Spacing System
- xs: 0.25rem → 4xl: 6rem

## 🔌 Shopify Integration

### Mock Data Fallback
The app includes comprehensive mock data for all 6 products:
- Dream Sleep Patch
- Energy Boost Patch
- Focus State Patch
- Stress Down Patch
- Berberine GLP-1 Patch
- Collagen Glow Patch

### API Functions
- `getAllProducts()` - Fetch all products
- `getProductByHandle()` - Get single product
- `searchProducts()` - Search functionality
- `getAllCollections()` - Fetch collections
- `getCollectionByHandle()` - Get collection with products
- `createCart()` - Create shopping cart
- `addToCart()` - Add items to cart
- `updateCartLine()` - Update quantities
- `removeFromCart()` - Remove items

## 🛒 Cart Functionality

The shopping cart uses React Context and localStorage for persistence:
- Add products with variants
- Update quantities
- Remove items
- Auto-calculate totals and shipping
- Persistent across page refreshes
- Side drawer UI for quick access
- Full cart page for checkout

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Key Features

### Product Filtering
- Filter by category tags (sleep, energy, focus, calm)
- Filter by price ranges
- Show only sale items
- Real-time filtering without page reload

### SEO Optimization
- Dynamic meta tags for all pages
- Structured data
- Semantic HTML
- Image alt texts
- Proper heading hierarchy

### Performance
- Next.js Image optimization
- Static generation for product pages
- Lazy loading components
- Optimized bundle size

## 🐛 Known Limitations

1. **Unsplash Images**: Mock product images may return 404s (expected behavior)
2. **Checkout**: Redirects to Shopify Checkout (requires real Shopify store)
3. **Search Page**: Basic implementation (can be enhanced)
4. **User Authentication**: Not implemented (Shopify handles this at checkout)

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Set these in your deployment platform:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

## 📝 Future Enhancements

- User accounts and order history
- Product reviews and ratings system
- Wishlist functionality
- Advanced search with filters
- Blog/content section
- Subscription management
- Multi-currency support
- Internationalization (i18n)

## 🤝 Contributing

This is a complete, production-ready e-commerce template. Feel free to customize:
- Update product data in `lib/shopify/index.ts`
- Modify colors in `app/globals.css`
- Add new pages in the `app/` directory
- Extend Shopify queries in `lib/shopify/queries/`

## 📄 License

This project is open source and available for commercial use.

## 💡 Credits

- **Design**: Custom wellness-focused design system
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Outfit, Nunito Sans)
- **Images**: Unsplash (for demo purposes)

---

**Built with ❤️ using Next.js 14**
