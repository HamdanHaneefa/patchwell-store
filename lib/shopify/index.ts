// Shopify Storefront API — Main fetch wrapper & helper functions

import {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  Product,
  Collection,
  Cart,
  CartItem,
} from './types';
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  SEARCH_PRODUCTS,
} from './queries/products';
import {
  GET_ALL_COLLECTIONS,
  GET_COLLECTION_BY_HANDLE,
} from './queries/collections';
import {
  CREATE_CART,
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART,
  REMOVE_FROM_CART,
} from './queries/cart';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const accessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// ─── Shopify Check ───────────────────────────────────────────────────────────

export function isShopifyConfigured(): boolean {
  return Boolean(
    domain &&
      domain !== 'your-store.myshopify.com' &&
      accessToken &&
      accessToken !== 'your_storefront_access_token_here'
  );
}

// ─── Core Fetch ──────────────────────────────────────────────────────────────

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}

export async function shopifyFetch<T = unknown>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: ShopifyFetchOptions): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error(
      'Shopify store domain and access token must be set in .env.local'
    );
  }

  const isServer = typeof window === 'undefined';
  const endpoint = isServer
    ? `https://${domain}/api/2024-01/graphql.json`
    : `/api/shopify-graphql`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isServer) {
    headers['X-Shopify-Storefront-Access-Token'] = accessToken;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: isServer ? cache : undefined,
    next: isServer && tags ? { tags } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'Unknown Shopify GraphQL error');
  }

  return json.data as T;
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeProduct(product: ShopifyProduct): Product {
  const price = product.priceRange.minVariantPrice.amount;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount;
  const isOnSale =
    compareAtPrice !== undefined &&
    parseFloat(compareAtPrice) > parseFloat(price);

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml || `<p>${product.description}</p>`,
    price,
    compareAtPrice: isOnSale ? compareAtPrice : null,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    featuredImage: product.featuredImage,
    images: product.images?.edges ? product.images.edges.map((e) => e.node) : [],
    variants: product.variants?.edges ? product.variants.edges.map((e) => e.node) : [],
    tags: product.tags,
    vendor: product.vendor,
    productType: product.productType,
    availableForSale: product.availableForSale,
    isOnSale,
  };
}

function normalizeCart(cart: ShopifyCart): Cart {
  const items: CartItem[] = cart.lines?.edges
    ? cart.lines.edges.map(({ node }) => ({
        id: node.id,
        quantity: node.quantity,
        variantId: node.merchandise.id,
        productTitle: node.merchandise.product.title,
        variantTitle: node.merchandise.title,
        productHandle: node.merchandise.product.handle,
        image: node.merchandise.product.featuredImage,
        price: node.merchandise.price.amount,
        totalPrice: node.cost.totalAmount.amount,
        currencyCode: node.cost.totalAmount.currencyCode,
        selectedOptions: node.merchandise.selectedOptions,
      }))
    : [];

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.cost.totalAmount.amount,
    subtotalAmount: cart.cost.subtotalAmount.amount,
    currencyCode: cart.cost.totalAmount.currencyCode,
    items,
  };
}

// ─── Mock Data for Fallback/Demo ──────────────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_dream',
    handle: 'dream-patch',
    title: 'Dream Sleep Patch (Magnesium & Melatonin)',
    description: 'Unwind and fall asleep naturally with our slow-release magnesium and melatonin patches. Designed to support deep, restful sleep and wake up refreshed without morning grogginess.',
    descriptionHtml: '<p>Unwind and fall asleep naturally with our slow-release magnesium and melatonin patches. Designed to support deep, restful sleep and wake up refreshed without morning grogginess.</p><h5>Key Benefits:</h5><ul><li>Promotes rapid sleep onset</li><li>Improves sleep quality & duration</li><li>Wake up refreshed, not groggy</li><li>100% drug-free & non-habit forming</li></ul>',
    price: '299.00',
    compareAtPrice: '399.00',
    currencyCode: 'INR',
    featuredImage: {
      url: '/images/patch-placeholder.svg',
      altText: 'Dream Sleep Patch',
      width: 600,
      height: 600,
    },
    images: [
      {
        url: '/images/patch-placeholder.svg',
        altText: 'Dream Sleep Patch Pack',
        width: 600,
        height: 600,
      },
      {
        url: '/images/patch-placeholder.svg',
        altText: 'Dream Sleep Patch Application',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'var_dream_30',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '299.00', currencyCode: 'INR' },
        compareAtPrice: { amount: '399.00', currencyCode: 'INR' },
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }],
        image: null,
      },
      {
        id: 'var_dream_60',
        title: '60-Pack (2 Month Supply)',
        availableForSale: true,
        price: { amount: '499.00', currencyCode: 'INR' },
        compareAtPrice: { amount: '699.00', currencyCode: 'INR' },
        selectedOptions: [{ name: 'Pack Size', value: '60-Pack' }],
        image: null,
      }
    ],
    tags: ['sleep', 'calm'],
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    availableForSale: true,
    isOnSale: true,
  },
  {
    id: 'prod_energy',
    handle: 'energy-boost',
    title: 'Energy Boost Patch (Extra Strong B12)',
    description: 'Ditch the sugary energy drinks and jittery caffeine crashes. Get clean, sustained, day-long focus and stamina with transdermal Vitamin B12, CoQ10, and Green Tea Extract.',
    descriptionHtml: '<p>Ditch the sugary energy drinks and jittery caffeine crashes. Get clean, sustained, day-long focus and stamina with transdermal Vitamin B12, CoQ10, and Green Tea Extract.</p><h5>Key Benefits:</h5><ul><li>Sustained 8-hour clean energy release</li><li>Zero sugar, zero calories, zero crashes</li><li>Supports nervous system health</li><li>Enhances physical stamina</li></ul>',
    price: '349.00',
    compareAtPrice: null,
    currencyCode: 'INR',
    featuredImage: {
      url: '/images/patch-placeholder.svg',
      altText: 'Energy Boost Patch',
      width: 600,
      height: 600,
    },
    images: [
      {
        url: '/images/patch-placeholder.svg',
        altText: 'Energy Boost Patch Product',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'var_energy_30',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '349.00', currencyCode: 'INR' },
        compareAtPrice: null,
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }],
        image: null,
      }
    ],
    tags: ['energy'],
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    availableForSale: true,
    isOnSale: false,
  },
  {
    id: 'prod_focus',
    handle: 'focus-state',
    title: 'Focus State Patch (Cognitive Support)',
    description: 'Unlock maximum productivity. Enhance cognitive function, mental clarity, and attention span. Infused with Ginkgo Biloba, L-Theanine, and Bacopa Monnieri.',
    descriptionHtml: '<p>Unlock maximum productivity. Enhance cognitive function, mental clarity, and attention span. Infused with Ginkgo Biloba, L-Theanine, and Bacopa Monnieri.</p><h5>Key Benefits:</h5><ul><li>Improves concentration and learning</li><li>Reduces mental fatigue during work/study</li><li>Promotes alpha brain waves for flow state</li><li>Fast acting transdermal absorption</li></ul>',
    price: '399.00',
    compareAtPrice: '499.00',
    currencyCode: 'INR',
    featuredImage: {
      url: '/images/patch-placeholder.svg',
      altText: 'Focus State Patch',
      width: 600,
      height: 600,
    },
    images: [
      {
        url: '/images/patch-placeholder.svg',
        altText: 'Focus State Patch Flow',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'var_focus_30',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '399.00', currencyCode: 'INR' },
        compareAtPrice: { amount: '499.00', currencyCode: 'INR' },
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }],
        image: null,
      }
    ],
    tags: ['focus'],
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    availableForSale: true,
    isOnSale: true,
  },
  {
    id: 'prod_stress',
    handle: 'stress-down',
    title: 'Stress Down Patch (Calm & Balance)',
    description: 'Soothe daily anxiety and keep your cortisol in check. Features natural GABA, Ashwagandha, and L-Theanine to keep you feeling relaxed, centered, and balanced throughout the day.',
    descriptionHtml: '<p>Soothe daily anxiety and keep your cortisol in check. Features natural GABA, Ashwagandha, and L-Theanine to keep you feeling relaxed, centered, and balanced throughout the day.</p><h5>Key Benefits:</h5><ul><li>Relieves stress and daily anxiety</li><li>Lowers cortisol levels naturally</li><li>Supports mental stability and calm</li><li>Non-drowsy, relaxing formula</li></ul>',
    price: '299.00',
    compareAtPrice: null,
    currencyCode: 'INR',
    featuredImage: {
      url: '/images/patch-placeholder.svg',
      altText: 'Stress Down Patch',
      width: 600,
      height: 600,
    },
    images: [
      {
        url: '/images/patch-placeholder.svg',
        altText: 'Stress Down Calm',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'var_stress_30',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '299.00', currencyCode: 'INR' },
        compareAtPrice: null,
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }],
        image: null,
      }
    ],
    tags: ['calm'],
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    availableForSale: true,
    isOnSale: false,
  },
  {
    id: 'prod_berberine',
    handle: 'berberine-glp1',
    title: 'Berberine Upgraded GLP-1 Patch (Metabolism)',
    description: 'Optimize your metabolic rate, support blood sugar levels, and control cravings. Formulated with high-strength Berberine, Chromium Picolinate, and Green Tea Extract.',
    descriptionHtml: '<p>Optimize your metabolic rate, support blood sugar levels, and control cravings. Formulated with high-strength Berberine, Chromium Picolinate, and Green Tea Extract.</p><h5>Key Benefits:</h5><ul><li>Supports metabolic rate and fat loss</li><li>Regulates appetite and cravings naturally</li><li>Supports healthy blood sugar levels</li><li>Direct transdermal delivery bypasses stomach irritation</li></ul>',
    price: '499.00',
    compareAtPrice: '699.00',
    currencyCode: 'INR',
    featuredImage: {
      url: '/images/patch-placeholder.svg',
      altText: 'Berberine Upgraded GLP-1 Patch',
      width: 600,
      height: 600,
    },
    images: [
      {
        url: '/images/patch-placeholder.svg',
        altText: 'Berberine Product Image',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'var_berberine_30',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '499.00', currencyCode: 'INR' },
        compareAtPrice: { amount: '699.00', currencyCode: 'INR' },
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }],
        image: null,
      }
    ],
    tags: ['energy', 'calm'],
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    availableForSale: true,
    isOnSale: true,
  },
  {
    id: 'prod_collagen',
    handle: 'collagen-glow',
    title: 'Collagen Glow Patch (Beauty Boost)',
    description: 'Promote youthful skin elasticity, deep hydration, and glowing radiance from the inside out. Delivers slow-release marine collagen, Hyaluronic Acid, and Biotin directly to your system.',
    descriptionHtml: '<p>Promote youthful skin elasticity, deep hydration, and glowing radiance from the inside out. Delivers slow-release marine collagen, Hyaluronic Acid, and Biotin directly to your system.</p><h5>Key Benefits:</h5><ul><li>Supports skin elasticity and firmness</li><li>Reduces the appearance of fine lines</li><li>Strengthens hair and nails</li><li>Sustained release over 12 hours</li></ul>',
    price: '399.00',
    compareAtPrice: null,
    currencyCode: 'INR',
    featuredImage: {
      url: '/images/patch-placeholder.svg',
      altText: 'Collagen Glow Patch',
      width: 600,
      height: 600,
    },
    images: [
      {
        url: '/images/patch-placeholder.svg',
        altText: 'Collagen Glow Beauty',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'var_collagen_30',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '399.00', currencyCode: 'INR' },
        compareAtPrice: null,
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }],
        image: null,
      }
    ],
    tags: ['sleep', 'calm'],
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    availableForSale: true,
    isOnSale: false,
  }
];

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col_all',
    handle: 'all',
    title: 'Shop All Patches',
    description: 'Explore our full line of premium wellness patches.',
    image: null,
    products: MOCK_PRODUCTS,
  },
  {
    id: 'col_sleep',
    handle: 'sleep',
    title: 'Sleep & Relaxation',
    description: 'Drift off naturally and wake up refreshed.',
    image: null,
    products: MOCK_PRODUCTS.filter((p) => p.tags.includes('sleep')),
  },
  {
    id: 'col_energy',
    handle: 'energy',
    title: 'Energy & Stamina',
    description: 'Clean energy without caffeine jitters or crashes.',
    image: null,
    products: MOCK_PRODUCTS.filter((p) => p.tags.includes('energy')),
  },
  {
    id: 'col_focus',
    handle: 'focus',
    title: 'Clarity & Productivity',
    description: 'Sharpen your focus and enter your flow state.',
    image: null,
    products: MOCK_PRODUCTS.filter((p) => p.tags.includes('focus')),
  },
  {
    id: 'col_calm',
    handle: 'calm',
    title: 'Calm & Balance',
    description: 'Reduce stress levels and keep cortisol in check.',
    image: null,
    products: MOCK_PRODUCTS.filter((p) => p.tags.includes('calm')),
  }
];

// Local Storage Helper for Mock Cart
function getMockCart(cartId: string): Cart | null {
  if (typeof window === 'undefined') {
    return {
      id: cartId,
      checkoutUrl: '#',
      totalQuantity: 0,
      totalAmount: '0.00',
      subtotalAmount: '0.00',
      currencyCode: 'INR',
      items: [],
    };
  }
  const stored = localStorage.getItem(`mock_cart_${cartId}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed) {
        parsed.currencyCode = 'INR';
        if (parsed.items) {
          parsed.items.forEach((item: any) => {
            item.currencyCode = 'INR';
            if (item.image && (item.image.url.includes('unsplash.com') || !item.image.url.startsWith('/'))) {
              item.image.url = '/images/patch-placeholder.svg';
            }
          });
        }
        return parsed;
      }
    } catch {
      return null;
    }
  }
  return null;
}

function saveMockCart(cart: Cart) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`mock_cart_${cart.id}`, JSON.stringify(cart));
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAllProducts(first = 24, query?: string): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    let prods = [...MOCK_PRODUCTS];
    if (query) {
      prods = prods.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    return prods.slice(0, first);
  }

  try {
    const data = await shopifyFetch<{
      products: { edges: Array<{ node: ShopifyProduct }> };
    }>({
      query: GET_ALL_PRODUCTS,
      variables: { first, query: query || '' },
      cache: 'no-store',
    });
    return data.products?.edges ? data.products.edges.map((e) => normalizeProduct(e.node)) : [];
  } catch (err) {
    console.error('Failed to fetch products, falling back to mock data:', err);
    return MOCK_PRODUCTS.slice(0, first);
  }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
  }

  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
      cache: 'no-store',
    });
    return data.product ? normalizeProduct(data.product) : null;
  } catch (err) {
    console.error('Failed to fetch product, falling back to mock data:', err);
    return MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const data = await shopifyFetch<{
      products: { edges: Array<{ node: ShopifyProduct }> };
    }>({
      query: SEARCH_PRODUCTS,
      variables: { query, first: 20 },
      cache: 'no-store',
    });
    return data.products?.edges ? data.products.edges.map((e) => normalizeProduct(e.node)) : [];
  } catch (err) {
    console.error('Failed to search products, falling back to mock data:', err);
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function getAllCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) {
    return MOCK_COLLECTIONS;
  }

  try {
    const data = await shopifyFetch<{
      collections: { edges: Array<{ node: ShopifyCollection }> };
    }>({
      query: GET_ALL_COLLECTIONS,
      variables: { first: 20 },
      cache: 'no-store',
    });
    return data.collections?.edges
      ? data.collections.edges.map(({ node }) => ({
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          image: node.image,
          products: [],
        }))
      : [];
  } catch (err) {
    console.error('Failed to fetch collections, falling back to mock:', err);
    return MOCK_COLLECTIONS;
  }
}

export async function getCollectionByHandle(handle: string): Promise<Collection | null> {
  if (!isShopifyConfigured()) {
    const col = MOCK_COLLECTIONS.find((c) => c.handle === handle);
    if (!col) return MOCK_COLLECTIONS.find((c) => c.handle === 'all') || null;
    return col;
  }

  try {
    const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
      query: GET_COLLECTION_BY_HANDLE,
      variables: { handle, first: 24 },
      cache: 'no-store',
    });
    if (!data.collection) return null;
    const col = data.collection;
    return {
      id: col.id,
      handle: col.handle,
      title: col.title,
      description: col.description,
      image: col.image,
      products: col.products?.edges ? col.products.edges.map((e) => normalizeProduct(e.node)) : [],
    };
  } catch (err) {
    console.error('Failed to fetch collection, falling back to mock:', err);
    const col = MOCK_COLLECTIONS.find((c) => c.handle === handle);
    if (!col) return MOCK_COLLECTIONS.find((c) => c.handle === 'all') || null;
    return col;
  }
}

// ─── Mock Cart Helpers ────────────────────────────────────────────────
function createMockCart(lines: Array<{ merchandiseId: string; quantity: number }>): Cart {
  const cartId = `mock_cart_${generateId()}`;
  const items: CartItem[] = [];

  for (const line of lines) {
    let product = MOCK_PRODUCTS.find((p) =>
      p.variants.some((v) => v.id === line.merchandiseId)
    );
    let variant = product?.variants.find((v) => v.id === line.merchandiseId);
    
    if (!product || !variant) {
      product = MOCK_PRODUCTS[0];
      variant = product.variants[0];
    }

    items.push({
      id: `line_${generateId()}`,
      quantity: line.quantity,
      variantId: line.merchandiseId,
      productTitle: product.title,
      variantTitle: variant.title,
      productHandle: product.handle,
      image: product.featuredImage,
      price: variant.price.amount,
      totalPrice: (parseFloat(variant.price.amount) * line.quantity).toFixed(2),
      currencyCode: variant.price.currencyCode,
      selectedOptions: variant.selectedOptions,
    });
  }

  const subtotal = items
    .reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  const newCart: Cart = {
    id: cartId,
    checkoutUrl: 'https://shopify.com/checkout/mock-checkout-url',
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: subtotal,
    subtotalAmount: subtotal,
    currencyCode: 'INR',
    items,
  };

  saveMockCart(newCart);
  return newCart;
}

function addMockCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Cart | null {
  const cart = getMockCart(cartId);
  if (!cart) return null;

  for (const line of lines) {
    const existingItem = cart.items.find((item) => item.variantId === line.merchandiseId);

    if (existingItem) {
      existingItem.quantity += line.quantity;
      existingItem.totalPrice = (
        parseFloat(existingItem.price) * existingItem.quantity
      ).toFixed(2);
    } else {
      let product = MOCK_PRODUCTS.find((p) =>
        p.variants.some((v) => v.id === line.merchandiseId)
      );
      let variant = product?.variants.find((v) => v.id === line.merchandiseId);
      
      if (!product || !variant) {
        product = MOCK_PRODUCTS[0];
        variant = product.variants[0];
      }

      cart.items.push({
        id: `line_${generateId()}`,
        quantity: line.quantity,
        variantId: line.merchandiseId,
        productTitle: product.title,
        variantTitle: variant.title,
        productHandle: product.handle,
        image: product.featuredImage,
        price: variant.price.amount,
        totalPrice: (parseFloat(variant.price.amount) * line.quantity).toFixed(2),
        currencyCode: variant.price.currencyCode,
        selectedOptions: variant.selectedOptions,
      });
    }
  }

  const subtotal = cart.items
    .reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.subtotalAmount = subtotal;
  cart.totalAmount = subtotal;

  saveMockCart(cart);
  return cart;
}

function updateMockCart(cartId: string, lineId: string, quantity: number): Cart | null {
  const cart = getMockCart(cartId);
  if (!cart) return null;

  const item = cart.items.find((i) => i.id === lineId);
  if (item) {
    item.quantity = quantity;
    item.totalPrice = (parseFloat(item.price) * quantity).toFixed(2);
  }

  const subtotal = cart.items
    .reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.subtotalAmount = subtotal;
  cart.totalAmount = subtotal;

  saveMockCart(cart);
  return cart;
}

function removeMockCart(cartId: string, lineIds: string[]): Cart | null {
  const cart = getMockCart(cartId);
  if (!cart) return null;

  cart.items = cart.items.filter((item) => !lineIds.includes(item.id));

  const subtotal = cart.items
    .reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.subtotalAmount = subtotal;
  cart.totalAmount = subtotal;

  saveMockCart(cart);
  return cart;
}

// ─── Cart mutations ───────────────────────────────────────────────────────────

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart | null> {
  if (!isShopifyConfigured()) {
    return createMockCart(lines);
  }

  try {
    const data = await shopifyFetch<{
      cartCreate: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
    }>({
      query: CREATE_CART,
      variables: { lines },
      cache: 'no-store',
    });
    if (data.cartCreate.userErrors.length) {
      console.error('Cart create errors:', data.cartCreate.userErrors);
      return createMockCart(lines);
    }
    return normalizeCart(data.cartCreate.cart);
  } catch (err) {
    console.error('Failed to create cart, falling back to mock:', err);
    return createMockCart(lines);
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith('mock_cart_')) {
    return getMockCart(cartId);
  }

  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
      query: GET_CART,
      variables: { cartId },
      cache: 'no-store',
    });
    return data.cart ? normalizeCart(data.cart) : null;
  } catch (err) {
    console.error('Failed to get cart, falling back to mock:', err);
    return getMockCart(cartId);
  }
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith('mock_cart_')) {
    return addMockCart(cartId, lines);
  }

  try {
    const data = await shopifyFetch<{
      cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
    }>({
      query: ADD_TO_CART,
      variables: { cartId, lines },
      cache: 'no-store',
    });
    if (data.cartLinesAdd.userErrors.length) {
      console.error('Add to cart errors:', data.cartLinesAdd.userErrors);
      return addMockCart(cartId, lines);
    }
    return normalizeCart(data.cartLinesAdd.cart);
  } catch (err) {
    console.error('Failed to add to cart, falling back to mock:', err);
    return addMockCart(cartId, lines);
  }
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith('mock_cart_')) {
    return updateMockCart(cartId, lineId, quantity);
  }

  try {
    const data = await shopifyFetch<{
      cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
    }>({
      query: UPDATE_CART,
      variables: { cartId, lines: [{ id: lineId, quantity }] },
      cache: 'no-store',
    });
    if (data.cartLinesUpdate.userErrors.length) {
      console.error('Update cart errors:', data.cartLinesUpdate.userErrors);
      return updateMockCart(cartId, lineId, quantity);
    }
    return normalizeCart(data.cartLinesUpdate.cart);
  } catch (err) {
    console.error('Failed to update cart, falling back to mock:', err);
    return updateMockCart(cartId, lineId, quantity);
  }
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith('mock_cart_')) {
    return removeMockCart(cartId, lineIds);
  }

  try {
    const data = await shopifyFetch<{
      cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
    }>({
      query: REMOVE_FROM_CART,
      variables: { cartId, lineIds },
      cache: 'no-store',
    });
    if (data.cartLinesRemove.userErrors.length) {
      console.error('Remove from cart errors:', data.cartLinesRemove.userErrors);
      return null;
    }
    return normalizeCart(data.cartLinesRemove.cart);
  } catch (err) {
    console.error('Failed to remove from cart, falling back to mock:', err);
    return null;
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currencyCode: string = 'INR'): string {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
  }).format(parsed);
}
