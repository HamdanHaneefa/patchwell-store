# Shopify Storefront API Integration Guide

This project is a high-performance Next.js storefront integrated with **Shopify Storefront API** (GraphQL). It is designed to work out of the box using **mock data** when credentials are not configured, and seamlessly transition to **real-time live Shopify data** once you plug in your credentials.

---

## 🚀 Quick Setup

To connect your Shopify store, create or update `.env.local` in the root of this project:

```env
# Shopify Storefront API Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-handle.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_public_storefront_access_token
```

> [!NOTE]
> Make sure to restart your Next.js development server (`npm run dev`) after updating `.env.local` for the environment variables to load.

---

## 🛠️ Step-by-Step Shopify Configuration

Follow these steps in your Shopify Admin dashboard to create a Custom App and obtain the credentials:

### Step 1: Enable Custom App Development
1. Log in to your **Shopify Admin** dashboard (e.g., `https://admin.shopify.com/store/your-store-handle`).
2. In the bottom left corner, click on **Settings** (⚙️).
3. In the settings sidebar, click on **Apps and sales channels**.
4. Click on **Develop apps** at the top right of the screen.
5. If you haven't enabled it before, click **Allow custom app development** and confirm.

### Step 2: Create Your Storefront Custom App
1. Click **Create an app** (top right).
2. Enter an **App name** (e.g., `Patchwell Next.js Storefront`).
3. Select the **App developer** (your email).
4. Click **Create app**.

### Step 3: Configure Storefront API Scopes
1. In your new custom app dashboard, go to the **Configuration** tab.
2. Under the **Storefront API integration** section, click **Configure**.
3. Check/select the following scopes under **Access Scopes**:
   * [x] `unauthenticated_read_product_listings` — *To fetch and display products*
   * [x] `unauthenticated_read_product_tags` — *To filter products by tag (e.g., sleep, energy)*
   * [x] `unauthenticated_read_collection_listings` — *To display collections*
   * [x] `unauthenticated_write_checkouts` & `unauthenticated_read_checkouts` — *To enable cart checkouts*
   * [x] `unauthenticated_write_customers` & `unauthenticated_read_customer_tags` — *If you plan to implement user profiles*
4. Click **Save** in the bottom bar.

### Step 4: Install App & Copy Access Token
1. Go back to the top right of the page and click **Install app**.
2. Confirm by clicking **Install** in the modal.
3. Switch to the **API credentials** tab.
4. Scroll down to the **Storefront API access token** section.
5. Copy the public **Storefront API access token** (it begins with `shpat_...` or similar).

### Step 5: Locate your Store Domain
* Your Shopify store domain is your primary internal Shopify URL (e.g., `your-store-handle.myshopify.com`).
* Do not include `https://` or trailing slashes (`/`).

---

## 🛍️ Setting up Products in Shopify (To match the layout)

The Patchwell Next.js application uses specific tags and handle naming schemes to organize the home and catalog pages. To ensure your live store loads correctly, configure your Shopify products as follows:

### 🏷️ 1. Categories & Collections
Create collections with these specific handles (or change them in `lib/shopify/index.ts`):
* **Sleep & Relaxation** (Handle: `sleep`)
* **Energy & Stamina** (Handle: `energy`)
* **Clarity & Productivity** (Handle: `focus`)
* **Calm & Balance** (Handle: `calm`)

### 🔑 2. Tags for Filtering
Add these tags to your products so the homepage sections and filtering works:
* Add tag `sleep` to sleep patches.
* Add tag `energy` to energy patches.
* Add tag `focus` to focus patches.
* Add tag `calm` to calm/stress patches.

---

## 🧪 Verification & Debugging

When you run your Next.js application, the site determines whether Shopify is active using the `isShopifyConfigured()` check in `lib/shopify/index.ts`.

* **Mock Mode (Default):** If the credentials are not set, the site displays realistic mock data for Patches (such as *Dream Sleep Patch*, *Energy Boost Patch*, *Focus State Patch*, etc.).
* **Live Mode:** Once the correct `.env.local` details are set, the app will execute GraphQL requests to `https://<your-store-domain>/api/2024-01/graphql.json` to load real products, real variants, and direct the cart's **Secure Checkout** button to Shopify's real checkout domain.
