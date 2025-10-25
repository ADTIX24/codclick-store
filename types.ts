import type React from 'react';

// Core Data Structures
export interface Product {
  id: string;
  name: string;
  price: string;
  image_urls: string[];
  description: string;
  rating: number;
  delivery_type: 'code' | 'image' | 'pdf' | 'excel' | 'word' | 'video' | 'audio';
  delivery_content: string | string[];
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
  products: Product[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  type: 'image' | 'video' | 'youtube';
  image_url?: string;
  video_url?: string;
  youtube_url?: string;
  duration?: number;
}

export interface SocialLinkData {
  url: string;
  icon?: string;
}

export interface PaymentField {
  id: string; // uuid
  label: string;
  value: string;
  is_copyable: boolean;
}

export interface PaymentMethod {
  id: string; // uuid
  name: string;
  icon: 'whatsapp' | 'usdt' | 'wallet' | 'credit-card' | 'custom';
  custom_icon_url?: string;
  instructions?: string;
  fields: PaymentField[];
  enabled: boolean;
}

export interface SiteSettings {
  logo_url: string;
  slide_interval: number;
  social_links: {
    [key: string]: SocialLinkData;
  };
  app_download_link: string;
  copyright_text: string;
  payment_methods: PaymentMethod[];
}

export type UserRole = 'owner' | 'moderator' | 'customer' | 'vip';

export interface User {
  id: string;
  email: string;
  fullName: string;
  whatsapp?: string;
  role: UserRole;
}

export interface OrderItem {
  id: string; // This is the product ID
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  date: string; // ISO string
  order_items: OrderItem[];
  total: number;
  status: 'Payment Pending' | 'Processing' | 'Completed' | 'Cancelled';
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  payment_method: string;
  payment_proof_url?: string;
  manual_delivery_data?: { [itemId: string]: string | string[] };
}

export interface HomepageSection {
  id: string; // uuid
  index: number; // for ordering
  type: 'category_grid' | 'new_products' | 'product_section';
  title: string;
  subtitle: string;
  category_id?: string | null; // for 'product_section' type
  visible: boolean;
}

// UI & State Types
export type PageKey = 
  | 'home'
  | 'products'
  | 'category'
  | 'product_detail'
  | 'auth'
  | 'my_account'
  | 'admin'
  | 'terms'
  | 'privacy'
  | 'refund'
  | 'faq'
  | 'about'
  | 'contact'
  | 'blog'
  | 'business'
  | 'track_order';

export interface PageContent {
  titleKey: string;
  content: string | { q: string, a: string }[];
}

export interface AppState {
  // Navigation
  currentPage: PageKey;
  currentCategoryId: string | null;
  selectedProductId: string | null;
  authMode: 'login' | 'signup';
  adminPage: string;

  // Data
  categories: Category[];
  orders: Order[];
  users: User[];
  siteSettings: SiteSettings;
  heroSlides: HeroSlide[];
  pages: { [key in PageKey]?: PageContent };
  homepageSections: HomepageSection[];

  // User & Cart
  currentUser: User | null;
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  loading: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Component Prop Types
export interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// i18n Types
export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface LanguageContextType {
  lang: Language;
  dir: Direction;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

// Supabase signup data
export interface SignUpData {
    fullName: string;
    email: string;
    password: string;
    whatsapp?: string;
}