import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabaseClient } from '../supabase/client.ts';
import type { AppState, PageKey, CartItem, Product, User, SignUpData, Order, OrderItem, Category, HeroSlide, SiteSettings, PageContent, UserRole, HomepageSection, PaymentMethod } from '../types.ts';
import { HERO_SLIDES } from '../constants.ts';
import type { AuthError, Session, User as SupabaseUser, UserResponse } from '@supabase/supabase-js';

// Define the shape of the context value
interface AppContextType {
  state: AppState;
  navigateTo: (page: PageKey, id?: string | null, authMode?: 'login' | 'signup') => void;
  findProductById: (productId: string) => Product | null;
  // Auth
  login: (email: string, password: string) => Promise<UserResponse>;
  signup: (data: SignUpData) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<Pick<User, 'full_name' | 'whatsapp'>>) => Promise<{ error: any }>;
  changePassword: (password: string) => Promise<{ error: AuthError | null }>;
  // Cart
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  setCheckoutOpen: (isOpen: boolean) => void;
  triggerFlyToCartAnimation: (element: HTMLElement | null) => void;
  // Orders
  addOrder: (orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'status'>) => Promise<{ error: any | null }>;
  // Admin
  setAdminPage: (page: string) => void;
  addCategory: (categoryData: Omit<Category, 'id' | 'products'>) => Promise<{ error: any | null }>;
  updateCategory: (categoryData: Omit<Category, 'products'>) => Promise<{ error: any | null }>;
  deleteCategory: (categoryId: string) => Promise<{ error: any | null }>;
  addProduct: (categoryId: string, productData: Omit<Product, 'id'>) => Promise<{ error: any | null }>;
  updateProduct: (productId: string, productData: Omit<Product, 'id'>, newCategoryId: string) => Promise<{ error: any | null }>;
  deleteProduct: (productId: string) => Promise<{ error: any | null }>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<{ error: any | null }>;
  updateOrderDelivery: (orderId: string, deliveryData: { [itemId: string]: string | string[] }) => Promise<{ error: any | null }>;
  updateUserRole: (userId: string, role: UserRole, fullName: string) => Promise<{ error: any | null }>;
  updateSiteSettings: (settings: SiteSettings) => Promise<{ error: any | null }>;
  addHeroSlide: (slideData: Omit<HeroSlide, 'id'>) => Promise<{ error: any | null }>;
  updateHeroSlide: (slideData: HeroSlide) => Promise<{ error: any | null }>;
  deleteHeroSlide: (slideId: string) => Promise<{ error: any | null }>;
  updatePage: (pageKey: PageKey, content: any) => Promise<{ error: any | null }>;
  upsertHomepageSections: (sections: HomepageSection[]) => Promise<{ error: any | null }>;
  setSearchTerm: (term: string) => void;
  fetchAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialAppState: AppState = {
  current_page: 'home',
  current_category_id: null,
  selected_product_id: null,
  auth_mode: 'login',
  admin_page: 'dashboard',
  categories: [],
  orders: [],
  users: [],
  site_settings: {
    logo_url: '',
    slide_interval: 7,
    social_links: {
      facebook: { url: '#' },
      twitter: { url: '#' },
      instagram: { url: '#' },
      youtube: { url: '#' },
      telegram: { url: '#' },
      whatsapp: { url: '#' },
      snapchat: { url: '#' },
      tiktok: { url: '#' },
    },
    app_download_link: '#',
    copyright_text: '© 2024 CODCLICK. All rights reserved.',
    payment_methods: [
        {
            id: 'whatsapp',
            name: 'التواصل عبر واتساب',
            icon: 'whatsapp',
            instructions: 'تواصل معنا عبر واتساب لإتمام عملية الدفع.',
            fields: [],
            enabled: true,
        },
        {
            id: 'usdt',
            name: 'USDT (TRC20)',
            icon: 'usdt',
            instructions: 'أرسل المبلغ إلى عنوان المحفظة التالي ثم ارفع إثبات الدفع.',
            fields: [
              { id: crypto.randomUUID(), label: 'عنوان المحفظة', value: 'TLpK74oBJbFvtsUzCGHVLfCMqFDQmyEHFw', is_copyable: true }
            ],
            enabled: true,
        },
         {
            id: 'sham_cash',
            name: 'شام كاش',
            icon: 'wallet',
            instructions: 'أرسل المبلغ إلى عنوان شام كاش التالي ثم ارفع إثبات الدفع.',
            fields: [
              { id: crypto.randomUUID(), label: 'عنوان شام كاش', value: '7009c1ef056cdc946c8284b951b86c49', is_copyable: true }
            ],
            enabled: true,
        },
        {
            id: 'orange_money',
            name: 'أورانج موني الأردن',
            icon: 'wallet',
            instructions: 'أرسل المبلغ إلى الرقم التالي ثم ارفع إثبات الدفع.',
            fields: [
              { id: crypto.randomUUID(), label: 'رقم الهاتف', value: '0779769501', is_copyable: true },
              { id: crypto.randomUUID(), label: 'أو عبر كليك', value: 'CODCLICK', is_copyable: true }
            ],
            enabled: true,
        },
        {
            id: 'credit_card',
            name: 'بطاقة ائتمانية',
            icon: 'credit-card',
            instructions: '',
            fields: [],
            enabled: false,
        }
    ],
  },
  hero_slides: HERO_SLIDES,
  homepage_sections: [],
  pages: {
    terms: { titleKey: 'pages.terms.title', content: 'Terms content goes here...' },
    privacy: { titleKey: 'pages.privacy.title', content: 'Privacy content goes here...' },
    refund: { titleKey: 'pages.refund.title', content: 'Refund content goes here...' },
    faq: { titleKey: 'pages.faq.title', content: [{q: 'Question 1?', a: 'Answer 1.'}] },
    about: { titleKey: 'pages.about.title', content: 'About us content goes here...' },
    contact: { titleKey: 'pages.contact.title', content: 'Contact us content goes here...' },
    blog: { titleKey: 'pages.blog.title', content: 'Blog content goes here...' },
    business: { titleKey: 'pages.business.title', content: 'For business content goes here...' },
  },
  current_user: null,
  cart: [],
  is_cart_open: false,
  is_checkout_open: false,
  loading: true,
  search_term: '',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    let savedCart = null;
    try {
      savedCart = localStorage.getItem('cart');
    } catch (e) {
      console.warn('Could not access localStorage to get cart:', e);
    }
    return {
      ...initialAppState,
      cart: savedCart ? JSON.parse(savedCart) : [],
    };
  });

  const setLoading = (loading: boolean) => setState(prev => ({ ...prev, loading }));
  
  const findProductById = useCallback((productId: string, categoriesToSearch?: Category[]): Product | null => {
    const cats = categoriesToSearch || state.categories;
    for (const category of cats) {
      const product = category.products.find(p => p.id === productId);
      if (product) return product;
    }
    return null;
  }, [state.categories]);

  const fetchAllData = useCallback(async () => {
    try {
        // --- STAGE 1: Fetch shell data for fast initial paint ---
        setLoading(true);
        
        const [settingsRes, slidesRes, pagesRes, sectionsRes, categoriesRes] = await Promise.all([
            supabaseClient.from('site_settings').select('*').single(),
            supabaseClient.from('hero_slides').select('*').order('created_at', { ascending: true }),
            supabaseClient.from('pages').select('*'),
            supabaseClient.from('homepage_sections').select('*').order('index', { ascending: true }),
            supabaseClient.from('categories').select('id, name, image_url').order('created_at', { ascending: true }),
        ]);

        const settingsData = settingsRes.data;
        const slidesData = slidesRes.data;
        const pagesData = pagesRes.data;
        const sectionsData = sectionsRes.data || [];
        const categoriesOnlyData = (categoriesRes.data || []).map(cat => ({...cat, products: [] as Product[]}));

        const pages: { [key in PageKey]?: PageContent } = { ...initialAppState.pages };
        if(pagesData) {
            pagesData.forEach((p: any) => {
                if (pages[p.id as PageKey]) pages[p.id as PageKey]!.content = p.content;
            });
        }

        // Set state to unblock UI
        setState(prev => ({
            ...prev,
            categories: categoriesOnlyData,
            site_settings: settingsData ? { ...prev.site_settings, ...settingsData } : prev.site_settings,
            hero_slides: slidesData && slidesData.length > 0 ? slidesData : HERO_SLIDES,
            pages,
            homepage_sections: sectionsData,
            loading: false, // <-- UI UNBLOCKED
        }));
        
        // --- STAGE 2: Fetch ALL products in the background ---
        const { data: allProductsData, error: productsError } = await supabaseClient
            .from('products')
            .select('id, category_id, name, price, image_urls, description, rating, delivery_type, delivery_content, created_at');
        
        if (productsError) {
            console.warn("Error fetching products in background:", productsError);
            return;
        }

        // Update state with all products
        setState(prev => {
            const finalCategories = prev.categories.map(cat => ({
                ...cat,
                products: (allProductsData || []).filter(p => p.category_id === cat.id) as Product[]
            }));
            return { ...prev, categories: finalCategories };
        });

    } catch (error) {
        console.error("Error during data load:", error);
        setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeSessionAndData = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!isMounted) return;

      const user = session?.user || null;
      let currentUser: User | null = null;
      if (user) {
        currentUser = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'User',
          whatsapp: user.user_metadata?.whatsapp,
          role: user.user_metadata?.role || 'customer',
        };
      }
      
      setState(prev => ({ ...prev, current_user: currentUser }));
      await fetchAllData();
    };

    initializeSessionAndData();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      const user = session?.user || null;
      let currentUser: User | null = null;
      if (user) {
        currentUser = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'User',
          whatsapp: user.user_metadata?.whatsapp,
          role: user.user_metadata?.role || 'customer',
        };
      }
      
      if (event === 'SIGNED_OUT') {
          setState(prev => ({ ...prev, current_user: null, orders: [], users: [] }));
      } else {
          setState(prev => ({ ...prev, current_user: currentUser }));
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchAllData]);
  
  // Persist cart to localStorage
  useEffect(() => {
    try {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    } catch (e) {
        console.warn('Could not access localStorage to save cart:', e);
    }
  }, [state.cart]);

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, search_term: term }));
  };

  const navigateTo = (page: PageKey, id: string | null = null, authMode: 'login' | 'signup' = 'login') => {
    const isSearchPage = page === 'products' || page === 'category';
    setState(prev => ({
      ...prev,
      current_page: page,
      current_category_id: page === 'category' ? id : null,
      selected_product_id: page === 'product_detail' ? id : null,
      auth_mode: page === 'auth' ? authMode : prev.auth_mode,
      search_term: isSearchPage ? prev.search_term : '',
    }));
    window.scrollTo(0, 0);
  };

  // --- Auth Actions ---
  const login = (email: string, password: string) => supabaseClient.auth.signInWithPassword({ email, password });
  const signup = async (data: SignUpData) => {
      const { full_name: fullName, email, password, whatsapp } = data;
      const { error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
              data: {
                  full_name: fullName,
                  whatsapp,
                  role: 'customer', // Default role on sign up
              }
          }
      });
      return { error };
  };
  const logout = async () => {
    await supabaseClient.auth.signOut();
  };
  const updateUser = async (data: Partial<Pick<User, 'full_name' | 'whatsapp'>>) => {
      const { error } = await supabaseClient.auth.updateUser({
          data: {
              full_name: data.full_name,
              whatsapp: data.whatsapp
          }
      });
      if (!error) {
        setState(prev => ({...prev, current_user: {...prev.current_user!, ...data}}))
      }
      return { error };
  };
  const changePassword = (password: string) => supabaseClient.auth.updateUser({ password });

  // --- Cart Actions ---
  const addToCart = (product: Product, quantity: number = 1) => {
      setState(prev => {
          const existingItem = prev.cart.find(item => item.product.id === product.id);
          if (existingItem) {
              return {
                  ...prev,
                  cart: prev.cart.map(item =>
                      item.product.id === product.id
                          ? { ...item, quantity: item.quantity + quantity }
                          : item
                  ),
              };
          }
          return { ...prev, cart: [...prev.cart, { product, quantity }] };
      });
  };
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setState(prev => ({
        ...prev,
        cart: prev.cart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      }));
    }
  };
  const removeFromCart = (productId: string) => {
      setState(prev => ({
          ...prev,
          cart: prev.cart.filter(item => item.product.id !== productId),
      }));
  };
  const clearCart = () => setState(prev => ({ ...prev, cart: [] }));
  const setCartOpen = (isOpen: boolean) => setState(prev => ({ ...prev, is_cart_open: isOpen }));
  const setCheckoutOpen = (isOpen: boolean) => setState(prev => ({ ...prev, is_checkout_open: isOpen }));
  
  const triggerFlyToCartAnimation = (element: HTMLElement | null) => {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const flyingItem = document.getElementById('flying-cart-item');
        const cartIcon = document.getElementById('cart-icon-target') || document.getElementById('cart-icon-target-mobile');
        if (!flyingItem || !cartIcon) return;
        
        const cartRect = cartIcon.getBoundingClientRect();

        Object.assign(flyingItem.style, {
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            backgroundImage: `url(${(element as HTMLImageElement).src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: '1',
            transition: 'none',
        });
        
        requestAnimationFrame(() => {
            Object.assign(flyingItem.style, {
                transition: 'all 0.6s cubic-bezier(0.5, -0.5, 0.5, 1.5)',
                left: `${cartRect.left + cartRect.width / 2}px`,
                top: `${cartRect.top + cartRect.height / 2}px`,
                width: '1rem',
                height: '1rem',
                opacity: '0',
            });
        });
  };

  // --- Order Actions ---
  const addOrder = async (orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'status'>) => {
    if (!state.current_user) return { error: new Error('User not logged in') };
    
    try {
      const productIds = orderData.order_items.map(item => item.product.id);
      const { data: fullProductsData, error: productsError } = await supabaseClient
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productsError) throw productsError;

      const fullProductsMap = new Map(fullProductsData.map(p => [p.id, p]));
      const fullOrderItems = orderData.order_items.map(item => ({...item, product: fullProductsMap.get(item.product.id) || item.product}));

      const { error } = await supabaseClient.from('orders').insert([{
        user_id: state.current_user.id,
        status: 'Payment Pending',
        ...orderData,
        order_items: fullOrderItems,
      }]).select().single();

      if (error) throw error;
      
      return { error: null };
    } catch (e: any) {
      console.error('Unexpected error in addOrder:', e);
      return { error: e };
    }
  };
  
  const refreshAdminData = async () => {
    // A simplified refresh function for admin actions
    await fetchAllData();
  }

  // --- Admin Actions ---
  const setAdminPage = (page: string) => setState(prev => ({ ...prev, admin_page: page }));
  const addCategory = async (categoryData: Omit<Category, 'id' | 'products'>) => {
    const { error } = await supabaseClient.from('categories').insert([categoryData]);
    if (!error) await refreshAdminData();
    return { error };
  };
  const updateCategory = async (categoryData: Omit<Category, 'products'>) => {
    const { error } = await supabaseClient.from('categories').update(categoryData).eq('id', categoryData.id);
    if (!error) await refreshAdminData();
    return { error };
  };
  const deleteCategory = async (categoryId: string) => {
    const { error } = await supabaseClient.from('categories').delete().eq('id', categoryId);
    if (!error) await refreshAdminData();
    return { error };
  };
  const addProduct = async (categoryId: string, productData: Omit<Product, 'id'>) => {
    const payload = { ...productData, category_id: categoryId };
    const { error } = await supabaseClient.from('products').insert([payload]);
    if (!error) await refreshAdminData();
    return { error };
  };
  const updateProduct = async (productId: string, productData: Omit<Product, 'id'>, newCategoryId: string) => {
      const payload = { ...productData, category_id: newCategoryId };
      const { error } = await supabaseClient.from('products').update(payload).eq('id', productId);
      if (!error) await refreshAdminData();
      return { error };
  };
  const deleteProduct = async (productId: string) => {
      const { error } = await supabaseClient.from('products').delete().eq('id', productId);
      if (!error) await refreshAdminData();
      return { error };
  };
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabaseClient.from('orders').update({ status }).eq('id', orderId);
    return { error };
  };
   const updateOrderDelivery = async (orderId: string, deliveryData: { [itemId: string]: string | string[] }) => {
    const { error } = await supabaseClient.from('orders').update({ manual_delivery_data: deliveryData }).eq('id', orderId);
    return { error };
  };
  const updateUserRole = async (userId: string, role: UserRole, fullName: string) => {
      const { error } = await supabaseClient.rpc('update_user_role_and_meta', {
          user_id: userId,
          new_role: role,
          new_full_name: fullName
      });
      return { error };
  };
  const updateSiteSettings = async (settings: SiteSettings) => {
    const { error } = await supabaseClient.from('site_settings').update(settings).eq('id', 1);
    if (!error) setState(prev => ({ ...prev, site_settings: settings }));
    return { error };
  };
  const addHeroSlide = async (slideData: Omit<HeroSlide, 'id'>) => {
      const { error } = await supabaseClient.from('hero_slides').insert([slideData]);
      if (!error) await refreshAdminData();
      return { error };
  };
  const updateHeroSlide = async (slideData: HeroSlide) => {
      const { error } = await supabaseClient.from('hero_slides').update(slideData).eq('id', slideData.id);
      if (!error) await refreshAdminData();
      return { error };
  };
  const deleteHeroSlide = async (slideId: string) => {
      const { error } = await supabaseClient.from('hero_slides').delete().eq('id', slideId);
      if (!error) await refreshAdminData();
      return { error };
  };
  const updatePage = async (pageKey: PageKey, content: any) => {
      const { error } = await supabaseClient.from('pages').upsert({ id: pageKey, content }, { onConflict: 'id' });
      if (!error) await refreshAdminData();
      return { error };
  };
  const upsertHomepageSections = async (sections: HomepageSection[]) => {
      const upsertData = sections.map((section, index) => ({
        id: section.id,
        type: section.type,
        title: section.title,
        subtitle: section.subtitle,
        category_id: section.category_id,
        visible: section.visible,
        index,
      }));
      const { error } = await supabaseClient.from('homepage_sections').upsert(upsertData, { onConflict: 'id' });
      
      const allSectionIds = sections.map(s => s.id);
      if (allSectionIds.length > 0) {
        const { error: deleteError } = await supabaseClient
          .from('homepage_sections')
          .delete()
          .not('id', 'in', `(${allSectionIds.join(',')})`);
         if (!error && !deleteError) await refreshAdminData();
         return { error: error || deleteError };
      } else {
        const { error: deleteAllError } = await supabaseClient.from('homepage_sections').delete().neq('id', crypto.randomUUID());
        if (!error && !deleteAllError) await refreshAdminData();
        return { error: error || deleteAllError };
      }
  };

  const contextValue = useMemo(() => ({
    state,
    navigateTo,
    findProductById,
    login,
    signup,
    logout,
    updateUser,
    changePassword,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setCartOpen,
    setCheckoutOpen,
    triggerFlyToCartAnimation,
    addOrder,
    setAdminPage,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateOrderDelivery,
    updateUserRole,
    updateSiteSettings,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    updatePage,
    upsertHomepageSections,
    setSearchTerm,
    fetchAllData,
  }), [state, findProductById, navigateTo, login, signup, logout, updateUser, changePassword, addToCart, updateCartQuantity, removeFromCart, clearCart, setCartOpen, setCheckoutOpen, triggerFlyToCartAnimation, addOrder, setAdminPage, addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct, updateOrderStatus, updateOrderDelivery, updateUserRole, updateSiteSettings, addHeroSlide, updateHeroSlide, deleteHeroSlide, updatePage, upsertHomepageSections, setSearchTerm, fetchAllData]);

  // @ts-ignore
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};