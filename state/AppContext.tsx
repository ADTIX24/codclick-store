import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabaseClient } from '../supabase/client.ts';
import type { AppState, PageKey, CartItem, Product, User, SignUpData, Order, OrderItem, Category, HeroSlide, SiteSettings, PageContent, UserRole, HomepageSection, PaymentMethod } from '../types.ts';
import { HERO_SLIDES } from '../constants.ts';
import type { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define the shape of the context value
interface AppContextType {
  state: AppState;
  navigateTo: (page: PageKey, id?: string | null, authMode?: 'login' | 'signup') => void;
  findProductById: (productId: string) => Product | null;
  // Auth
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signup: (data: SignUpData) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<Pick<User, 'fullName' | 'whatsapp'>>) => Promise<{ error: any }>;
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
  addOrder: (orderData: Omit<Order, 'id' | 'user_id' | 'date' | 'status'>) => Promise<{ error: any | null }>;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialAppState: AppState = {
  currentPage: 'home',
  currentCategoryId: null,
  selectedProductId: null,
  authMode: 'login',
  adminPage: 'dashboard',
  categories: [],
  orders: [],
  users: [],
  siteSettings: {
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
  heroSlides: HERO_SLIDES,
  homepageSections: [],
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
  currentUser: null,
  cart: [],
  isCartOpen: false,
  isCheckoutOpen: false,
  loading: true,
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

  const fetchData = useCallback(async (user: SupabaseUser | null) => {
    setLoading(true);
    try {
      // Fetch categories with products
      const { data: categoriesData, error: categoriesError } = await supabaseClient
        .from('categories')
        .select(`
          id,
          name,
          image_url,
          products (
            id,
            name,
            price,
            image_urls,
            description,
            rating,
            delivery_type,
            delivery_content
          )
        `).order('created_at', { ascending: true });
      if (categoriesError) throw categoriesError;

      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabaseClient
        .from('site_settings')
        .select('*')
        .single();
       if (settingsError) console.warn("Could not fetch site settings, using defaults.", settingsError);

      // Fetch hero slides
      const { data: slidesData, error: slidesError } = await supabaseClient
        .from('hero_slides')
        .select('*')
        .order('created_at', { ascending: true });
      if (slidesError) console.warn("Could not fetch hero slides, using defaults.", slidesError);
      
      // Fetch pages
      const { data: pagesData, error: pagesError } = await supabaseClient
        .from('pages')
        .select('*');
      if (pagesError) console.warn("Could not fetch pages content.", pagesError);

      // Fetch homepage sections
      const { data: sectionsData, error: sectionsError } = await supabaseClient
        .from('homepage_sections')
        .select('*')
        .order('index', { ascending: true });
      if (sectionsError) console.warn("Could not fetch homepage sections.", sectionsError);

      const pages: { [key in PageKey]?: PageContent } = { ...initialAppState.pages };
      if(pagesData) {
        pagesData.forEach(p => {
            if (pages[p.id as PageKey]) {
                pages[p.id as PageKey]!.content = p.content;
            }
        });
      }


// FIX: Type Supabase results as `any[]` to handle snake_case and declare `allUsers` in the correct scope.
      let userOrders: any[] = [];
      let allOrders: any[] = [];
      let allUsers: User[] = [];

      if (user) {
        const userRole = (user.user_metadata?.role || 'customer') as UserRole;
        if (userRole === 'owner' || userRole === 'moderator') {
          // Fetch all users for admin
          const { data: usersData, error: usersError } = await supabaseClient.from('users').select('*');
          if (usersError) throw usersError;
          allUsers = usersData.map(u => ({
            id: u.id,
            email: u.email,
            fullName: u.full_name,
            whatsapp: u.whatsapp,
            role: u.role as UserRole,
          }));

          // Fetch all orders for admin
          const { data: ordersData, error: ordersError } = await supabaseClient.from('orders').select('*');
          if (ordersError) throw ordersError;
          allOrders = ordersData;

        } else {
          // Fetch only current user's orders
          const { data: ordersData, error: ordersError } = await supabaseClient.from('orders').select('*').eq('user_id', user.id);
          if (ordersError) throw ordersError;
          userOrders = ordersData;
        }
      }

      const allFetchedOrders = allOrders.length > 0 ? allOrders : userOrders;

      // FIX: Explicitly type the map callback to return `Order | null`. This resolves the type predicate error in the subsequent `.filter()` call.
      const populatedOrders: Order[] = allFetchedOrders.map((order): Order | null => {
        if (!order) return null;

        const populatedOrderItems: OrderItem[] = (order.order_items && Array.isArray(order.order_items)) ? order.order_items.map((item: any) => {
          const product = findProductById(item.id, categoriesData);
          return {
            ...item,
            product: product || { 
                id: item.id, 
                name: 'Unknown Product', 
                price: '0.00', 
                image_urls: [], 
                description: 'This product could not be found.', 
                rating: 0, 
                delivery_type: 'code', 
                delivery_content: ''
            }
          };
        }) : [];
        
        return {
          id: order.id,
          user_id: order.user_id,
          date: order.date,
          order_items: populatedOrderItems,
          total: order.total,
          status: order.status,
// FIX: Map from snake_case `customer_name` to camelCase `customerName`.
          customerName: order.customer_name,
// FIX: Map from snake_case `customer_email` to camelCase `customerEmail`.
          customerEmail: order.customer_email,
// FIX: Map from snake_case `customer_whatsapp` to camelCase `customerWhatsapp`.
          customerWhatsapp: order.customer_whatsapp,
          payment_method: order.payment_method,
// FIX: Coalesce null values to undefined for optional properties. Using `||` correctly handles `null` from the database, whereas `??` does not.
          payment_proof_url: order.payment_proof_url || undefined,
          manual_delivery_data: order.manual_delivery_data || undefined,
        };
      })
      .filter((order): order is Order => order !== null)
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Merge fetched settings with defaults for payment_methods
      const finalSettings = { ...initialAppState.siteSettings, ...settingsData };
      if (!settingsData?.payment_methods || settingsData.payment_methods.length === 0) {
        finalSettings.payment_methods = initialAppState.siteSettings.payment_methods;
      }

      setState(prev => ({
        ...prev,
        categories: categoriesData || [],
        siteSettings: finalSettings,
        heroSlides: slidesData?.length ? slidesData : prev.heroSlides,
        homepageSections: sectionsData || [],
        pages,
        orders: populatedOrders,
// FIX: `allUsers` is now correctly scoped and assigned.
        users: allUsers,
      }));

    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const findProductById = useCallback((productId: string, categoriesToSearch?: Category[]): Product | null => {
    const cats = categoriesToSearch || state.categories;
    for (const category of cats) {
      const product = category.products.find(p => p.id === productId);
      if (product) return product;
    }
    return null;
  }, [state.categories]);
  
  const handleNavigation = useCallback((page: PageKey, id: string | null, authMode: 'login' | 'signup') => {
      const validPages: PageKey[] = [
          'home', 'products', 'category', 'product_detail', 'auth', 'my_account', 
          'admin', 'terms', 'privacy', 'refund', 'faq', 'about', 'contact', 'blog', 
          'business', 'track_order'
      ];
      
      const safePage = validPages.includes(page) ? page : 'home';

      setState(prev => ({
          ...prev,
          currentPage: safePage,
          currentCategoryId: safePage === 'category' ? id : null,
          selectedProductId: safePage === 'product_detail' ? id : null,
          authMode: safePage === 'auth' ? authMode : prev.authMode,
      }));
      window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
      const handlePopState = (event: PopStateEvent) => {
          if (event.state && event.state.page) {
              const { page, id, authMode } = event.state;
              handleNavigation(page, id, authMode || 'login');
          } else {
              try {
                  const path = window.location.pathname;
                  const parts = path.split('/').filter(Boolean);
                  const page = (parts[0] || 'home') as PageKey;
                  const id = parts[1] || null;
                  handleNavigation(page, id, 'login');
              } catch(e) {
                  console.warn('Could not handle popstate path parsing:', e);
                  handleNavigation('home', null, 'login');
              }
          }
      };
      
      try {
        window.addEventListener('popstate', handlePopState);
      } catch (e) {
        console.warn('Could not add popstate listener:', e);
      }

      // Initial load
      try {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        const page = (parts[0] || 'home') as PageKey;
        const id = parts[1] || null;
        
        handleNavigation(page, id, 'login');
        window.history.replaceState({ page, id, authMode: 'login' }, '', path);
      } catch (e) {
        console.warn('Could not access history API for initial load:', e);
        handleNavigation('home', null, 'login');
      }
      
      return () => {
        try {
          window.removeEventListener('popstate', handlePopState);
        } catch (e) {
          console.warn('Could not remove popstate listener:', e);
        }
      };
  }, [handleNavigation]);

  const navigateTo = useCallback((page: PageKey, id: string | null = null, authMode: 'login' | 'signup' = 'login') => {
      let path = `/${page}`;
      if ((page === 'category' || page === 'product_detail') && id) {
          path = `/${page}/${id}`;
      } else if (page === 'home') {
          path = '/';
      }

      try {
        if (window.location.pathname !== path) {
            window.history.pushState({ page, id, authMode }, '', path);
        }
      } catch (e) {
        console.warn('Could not access history API for navigation:', e);
      }
      
      handleNavigation(page, id, authMode);
  }, [handleNavigation]);

  useEffect(() => {
    // Handle auth state changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        const supabaseUser = session?.user || null;
        let appUser: User | null = null;
        if (supabaseUser) {
          appUser = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            fullName: supabaseUser.user_metadata?.full_name || '',
            whatsapp: supabaseUser.user_metadata?.whatsapp || '',
            role: (supabaseUser.user_metadata?.role || 'customer') as UserRole,
          };
        }
        setState(prev => ({ ...prev, currentUser: appUser }));
        fetchData(supabaseUser);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchData]);
  
  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } catch (e) {
      console.warn('Could not access localStorage to set cart:', e);
    }
  }, [state.cart]);

  // --- Actions ---
  
  const setAdminPage = (page: string) => {
    setState(prev => ({...prev, adminPage: page }));
  }

  // Auth actions
  const login = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signup = async (data: SignUpData) => {
    const { error } = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          whatsapp: data.whatsapp,
          role: 'customer', // Default role
        },
      },
    });
    return { error };
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    setState(prev => ({ ...prev, currentUser: null, orders: [], users: [] }));
    navigateTo('home');
  };
  
  const updateUser = async (data: Partial<Pick<User, 'fullName' | 'whatsapp'>>) => {
    const { data: { user } , error } = await supabaseClient.auth.updateUser({
      data: { full_name: data.fullName, whatsapp: data.whatsapp }
    });
    if(!error && user) {
        setState(prev => ({...prev, currentUser: { ...prev.currentUser!, fullName: user.user_metadata.full_name, whatsapp: user.user_metadata.whatsapp } }));
    }
    return { error };
  }
  
  const changePassword = async (password: string) => {
      const { error } = await supabaseClient.auth.updateUser({ password });
      return { error };
  }

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setState(prev => {
      const existingItem = prev.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        return {
          ...prev,
          cart: prev.cart.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return { ...prev, cart: [...prev.cart, { product, quantity }] };
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const removeFromCart = (productId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.product.id !== productId),
    }));
  };

  const clearCart = () => setState(prev => ({ ...prev, cart: [] }));
  const setCartOpen = (isOpen: boolean) => setState(prev => ({ ...prev, isCartOpen: isOpen }));
  const setCheckoutOpen = (isOpen: boolean) => setState(prev => ({ ...prev, isCheckoutOpen: isOpen }));

  const triggerFlyToCartAnimation = (element: HTMLElement | null) => {
    if (!element) return;
    
    const cartIcon = document.getElementById('cart-icon-target') || document.getElementById('cart-icon-target-mobile');
    if (!cartIcon) return;
  
    const flyingItem = document.getElementById('flying-cart-item');
    if(!flyingItem) return;

    const rect = element.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    flyingItem.style.left = `${rect.left}px`;
    flyingItem.style.top = `${rect.top}px`;
    flyingItem.style.width = `${rect.width}px`;
    flyingItem.style.height = `${rect.height}px`;
    flyingItem.style.backgroundImage = `url(${(element as HTMLImageElement).src})`;
    flyingItem.style.backgroundSize = 'contain';
    flyingItem.style.backgroundRepeat = 'no-repeat';
    flyingItem.style.backgroundPosition = 'center';

    requestAnimationFrame(() => {
        flyingItem.style.transition = 'left 0.5s ease-in-out, top 0.5s ease-in-out, width 0.5s ease-in-out, height 0.5s ease-in-out, opacity 0.5s ease-in-out';
        flyingItem.style.opacity = '1';
        flyingItem.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingItem.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingItem.style.width = '20px';
        flyingItem.style.height = '20px';
        flyingItem.style.opacity = '0';
    });
  };
  
  // Order actions
  const addOrder = async (orderData: Omit<Order, 'id' | 'user_id' | 'date' | 'status'>) => {
      const orderItems = orderData.order_items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image_url: item.product.image_urls[0]
      }));

      const { error } = await supabaseClient.from('orders').insert({
          user_id: state.currentUser?.id,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_whatsapp: orderData.customerWhatsapp,
          order_items: orderItems,
          total: orderData.total,
          status: 'Payment Pending',
          payment_method: orderData.payment_method,
          payment_proof_url: orderData.payment_proof_url,
      });
      if (!error) {
        fetchData(state.currentUser);
      }
      return { error };
  }

  // Admin actions
  const addCategory = async (categoryData: Omit<Category, 'id' | 'products'>) => {
      const { error } = await supabaseClient.from('categories').insert(categoryData);
      if(!error) fetchData(state.currentUser);
      return { error };
  }

  const updateCategory = async (categoryData: Omit<Category, 'products'>) => {
      const { error } = await supabaseClient.from('categories').update({ name: categoryData.name, image_url: categoryData.image_url }).eq('id', categoryData.id);
      if(!error) fetchData(state.currentUser);
      return { error };
  }

  const deleteCategory = async (categoryId: string) => {
      const { error } = await supabaseClient.from('categories').delete().eq('id', categoryId);
      if(!error) fetchData(state.currentUser);
      return { error };
  }
  
  const addProduct = async (categoryId: string, productData: Omit<Product, 'id'>) => {
      const { error } = await supabaseClient.from('products').insert({ ...productData, category_id: categoryId });
      if(!error) fetchData(state.currentUser);
      return { error };
  }

  const updateProduct = async (productId: string, productData: Omit<Product, 'id'>, newCategoryId: string) => {
      const { error } = await supabaseClient.from('products').update({ ...productData, category_id: newCategoryId }).eq('id', productId);
      if(!error) fetchData(state.currentUser);
      return { error };
  }

  const deleteProduct = async (productId: string) => {
      const { error } = await supabaseClient.from('products').delete().eq('id', productId);
      if(!error) fetchData(state.currentUser);
      return { error };
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
      const { error } = await supabaseClient.from('orders').update({ status }).eq('id', orderId);
      if(!error) fetchData(state.currentUser);
      return { error };
  }
  
  const updateOrderDelivery = async (orderId: string, deliveryData: { [itemId: string]: string | string[] }) => {
    const { error } = await supabaseClient.from('orders').update({ manual_delivery_data: deliveryData }).eq('id', orderId);
    if (!error) fetchData(state.currentUser);
    return { error };
  };

  const updateUserRole = async (userId: string, role: UserRole, fullName: string) => {
    const { error } = await supabaseClient.rpc('update_user_role_and_meta', {
        user_id: userId,
        new_role: role,
        new_full_name: fullName
    });
    if (!error) fetchData(state.currentUser);
    return { error };
  };
  
  const updateSiteSettings = async (settings: SiteSettings) => {
    const { error } = await supabaseClient.from('site_settings').update(settings).eq('id', 1); // Assuming single row with id=1
    if (!error) fetchData(state.currentUser);
    return { error };
  }

  const addHeroSlide = async (slideData: Omit<HeroSlide, 'id'>) => {
    const { error } = await supabaseClient.from('hero_slides').insert(slideData);
    if (!error) fetchData(state.currentUser);
    return { error };
  }

  const updateHeroSlide = async (slideData: HeroSlide) => {
    const { error } = await supabaseClient.from('hero_slides').update(slideData).eq('id', slideData.id);
    if (!error) fetchData(state.currentUser);
    return { error };
  }

  const deleteHeroSlide = async (slideId: string) => {
    const { error } = await supabaseClient.from('hero_slides').delete().eq('id', slideId);
    if (!error) fetchData(state.currentUser);
    return { error };
  }
  
  const updatePage = async (pageKey: PageKey, content: any) => {
    const { error } = await supabaseClient.from('pages').update({ content }).eq('id', pageKey);
    if(!error) fetchData(state.currentUser);
    return { error };
  }

  const upsertHomepageSections = async (sections: HomepageSection[]) => {
    const { data: existingSections, error: fetchError } = await supabaseClient.from('homepage_sections').select('id');
    if (fetchError) return { error: fetchError };

    const existingIds = existingSections.map(s => s.id);
    const newIds = sections.map(s => s.id);
    const idsToDelete = existingIds.filter(id => !newIds.includes(id));

    if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabaseClient.from('homepage_sections').delete().in('id', idsToDelete);
        if (deleteError) return { error: deleteError };
    }

    const sectionsToUpsert = sections.map((section, index) => ({
        id: section.id,
        index,
        type: section.type,
        title: section.title,
        subtitle: section.subtitle,
        category_id: section.category_id,
        visible: section.visible,
    }));

    if (sectionsToUpsert.length > 0) {
        const { error } = await supabaseClient.from('homepage_sections').upsert(sectionsToUpsert, { onConflict: 'id' });
        if (error) return { error };
    }

    fetchData(state.currentUser);
    return { error: null };
  };

  const value = useMemo(() => ({
    state,
    navigateTo,
    findProductById,
    login, signup, logout, updateUser, changePassword,
    addToCart, updateCartQuantity, removeFromCart, clearCart, setCartOpen, setCheckoutOpen, triggerFlyToCartAnimation,
    addOrder,
    setAdminPage,
    addCategory, updateCategory, deleteCategory,
    addProduct, updateProduct, deleteProduct,
    updateOrderStatus, updateOrderDelivery,
    updateUserRole,
    updateSiteSettings, addHeroSlide, updateHeroSlide, deleteHeroSlide,
    updatePage,
    upsertHomepageSections,
  }), [state, findProductById, fetchData, navigateTo]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
