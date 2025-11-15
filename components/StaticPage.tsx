import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .ts extension to module import.
import type { PageKey, User, Order } from '../types.ts';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';
import { supabaseClient } from '../supabase/client.ts';


// Icons for My Account Page
const UserIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const BoxIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const HeartIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;
const ChevronDownIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ClipboardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const DownloadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;


const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const { t } = useLanguage();
    const statusMap = {
        'Payment Pending': { text: t('admin.orders.status_pending'), color: 'bg-yellow-500/20 text-yellow-300' },
        'Processing': { text: t('admin.orders.status_processing'), color: 'bg-blue-500/20 text-blue-300' },
        'Completed': { text: t('admin.orders.status_completed'), color: 'bg-green-500/20 text-green-300' },
        'Cancelled': { text: t('admin.orders.status_cancelled'), color: 'bg-red-500/20 text-red-300' },
    };
    const { text, color } = statusMap[status] || { text: status, color: 'bg-gray-500/20 text-gray-300' };
    return <span className={`px-2 py-1 text-xs font-bold rounded-full ${color}`}>{text}</span>;
};


const StaticPage: React.FC<{ pageKey: PageKey }> = ({ pageKey }) => {
  const { t } = useLanguage();
  const { state, navigateTo, updateUser, changePassword } = useAppContext();
  const { current_user: currentUser } = state;
  
  // --- My Account Page Logic ---
  const [activeTab, setActiveTab] = useState('details');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', whatsapp: '' });
  const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);


  useEffect(() => {
    if (pageKey === 'my_account' && currentUser) {
      setFormData({
        full_name: currentUser.full_name,
        email: currentUser.email,
        whatsapp: currentUser.whatsapp || '',
      });
    }
  }, [currentUser, pageKey]);

  useEffect(() => {
      const fetchOrders = async () => {
          if (activeTab === 'orders' && currentUser && orders.length === 0) {
              setOrdersLoading(true);
              const { data, error } = await supabaseClient
                  .from('orders')
                  .select('*')
                  .eq('user_id', currentUser.id)
                  .order('created_at', { ascending: false });
              
              if (error) {
                  console.error("Error fetching user orders:", error);
              } else {
                  setOrders(data || []);
              }
              setOrdersLoading(false);
          }
      };
      fetchOrders();
  }, [activeTab, currentUser, orders.length]);
  
  const handleCopy = (text: string, codeId: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(codeId);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      if (!formData.full_name || !formData.email) {
        setMessage({type: 'error', text: t('my_account_page.fields_required')});
        return;
      }

      const { error } = await updateUser({
          full_name: formData.full_name,
          whatsapp: formData.whatsapp,
      });
      
      if (error) {
           setMessage({ type: 'error', text: error.message });
      } else {
          setMessage({ type: 'success', text: t('my_account_page.update_success') });
      }
      setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
       if (!passwordData.new || !passwordData.confirm) {
        setMessage({type: 'error', text: t('my_account_page.fields_required')});
        return;
      }
      if (passwordData.new !== passwordData.confirm) {
          setMessage({ type: 'error', text: t('my_account_page.passwords_do_not_match') });
          return;
      }
      
      const { error } = await changePassword(passwordData.new);

      if (error) {
          setMessage({ type: 'error', text: error.message || t('my_account_page.password_update_fail') });
      } else {
          setMessage({ type: 'success', text: t('my_account_page.password_update_success') });
          setPasswordData({ new: '', confirm: '' });
      }
      setTimeout(() => setMessage(null), 3000);
  };
  
  if (pageKey === 'my_account') {
    if (!currentUser) {
      return (
        <div className="bg-transparent min-h-[50vh] flex flex-col items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">{t('my_account_page.please_login')}</h1>
                <button onClick={() => navigateTo('auth')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full">
                    {t('header.login')}
                </button>
            </div>
        </div>
      );
    }
    
    const TabButton: React.FC<{tab: string, label: string, icon: React.ReactNode}> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-3 w-full text-right p-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-amber-500/10 text-amber-400' : 'hover:bg-slate-700/50 text-gray-300'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="bg-transparent py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <h1 className="text-4xl font-extrabold text-white text-center mb-12">{t('pages.my_account.title')}</h1>
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    <aside className="md:w-1/4 lg:w-1/5">
                        <div className="space-y-2 bg-slate-800 p-4 rounded-lg border border-slate-700">
                           <TabButton tab="details" label={t('my_account_page.personal_info')} icon={<UserIcon />} />
                           <TabButton tab="orders" label={t('my_account_page.my_orders')} icon={<BoxIcon />} />
                           <TabButton tab="favorites" label={t('my_account_page.my_favorites')} icon={<HeartIcon />} />
                        </div>
                    </aside>
                    <main className="flex-1">
                        {message && <div className={`p-3 rounded-lg mb-6 text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{message.text}</div>}
                        {activeTab === 'details' && (
                            <div className="space-y-8">
                                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                    <h2 className="text-2xl font-bold mb-6">{t('my_account_page.personal_info')}</h2>
                                    <form onSubmit={handleInfoSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">{t('my_account_page.full_name')}</label>
                                            <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">{t('my_account_page.email')}</label>
                                            <input type="email" value={formData.email} disabled className="w-full bg-slate-900/50 p-2 rounded border border-slate-600 text-gray-400 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">{t('my_account_page.whatsapp')}</label>
                                            <input type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                                        </div>
                                        <div className="pt-2">
                                            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full">{t('my_account_page.save_changes')}</button>
                                        </div>
                                    </form>
                                </div>
                                 <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                    <h2 className="text-2xl font-bold mb-6">{t('my_account_page.change_password_section_title')}</h2>
                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">{t('my_account_page.new_password')}</label>
                                            <input type="password" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">{t('my_account_page.confirm_new_password')}</label>
                                            <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                                        </div>
                                        <div className="pt-2">
                                            <button type="submit" className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full">{t('my_account_page.update_password_button')}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {activeTab === 'orders' && (
                             <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <h2 className="text-2xl font-bold mb-6">{t('my_account_page.orders_title')}</h2>
                                {ordersLoading ? (
                                    <div className="text-center py-10">Loading orders...</div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-slate-700/50 rounded-lg border border-slate-600 overflow-hidden">
                                                <div 
                                                    className="p-4 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-700/80" 
                                                    onClick={() => setExpandedOrderId(prev => prev === order.id ? null : order.id)}
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-bold text-white">{t('my_account_page.order_id')}: <span className="font-mono">#{order.id.slice(-8).toUpperCase()}</span></p>
                                                        <p className="text-sm text-gray-400">{t('my_account_page.date')}: {isNaN(new Date(order.created_at).getTime()) ? '-' : new Date(order.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex-1 text-right">
                                                        <p className="font-semibold text-amber-400">{t('my_account_page.total')}: {order.total.toFixed(2)}$</p>
                                                        <StatusBadge status={order.status} />
                                                    </div>
                                                    <ChevronDownIcon />
                                                </div>

                                                {expandedOrderId === order.id && (
                                                    <div className="p-4 border-t border-slate-600 bg-slate-800/50">
                                                        <h3 className="text-lg font-semibold mb-4">{t('my_account_page.products_in_order')}</h3>
                                                        <ul className="space-y-6">
                                                            {order.order_items.map(item => {
                                                                if (!item || !item.product) {
                                                                    return (
                                                                        <li key={item?.id || Math.random()} className="pb-6 border-b border-slate-700 last:border-b-0 last:pb-0">
                                                                            <div className="flex items-start gap-4">
                                                                                <div className="w-16 h-20 bg-slate-700 rounded-md flex items-center justify-center text-gray-500 text-3xl font-bold">?</div>
                                                                                <div className="flex-1 pt-2">
                                                                                    <p className="font-semibold text-gray-400">Product Not Found</p>
                                                                                    <p className="text-sm text-gray-500">This product is no longer available.</p>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                }
                                                                const product = item.product;

                                                                const manualContent = order.manual_delivery_data?.[item.id];
                                                                const isCompleted = order.status === 'Completed';
                                                                const isDelivered = manualContent || isCompleted;
                                                                
                                                                const deliveryContent = manualContent || product.delivery_content;
                                                                const deliveryType = product.delivery_type;

                                                                return (
                                                                    <li key={item.id} className="pb-6 border-b border-slate-700 last:border-b-0 last:pb-0">
                                                                        <div className="flex items-start gap-4">
                                                                            <img src={product.image_urls[0]} alt={t(product.name)} className="w-16 h-20 object-cover rounded-md" />
                                                                            <div className="flex-1">
                                                                                <p className="font-semibold text-white">{t(product.name)}</p>
                                                                                <p className="text-sm text-gray-400">{t('admin.orders.products')}: {item.quantity}</p>
                                                                            </div>
                                                                        </div>
                                                                        {isDelivered ? (
                                                                            <div className="mt-4 bg-slate-900/70 p-4 rounded-lg">
                                                                                <h4 className="text-md font-bold text-amber-400 mb-3">{t('my_account_page.delivery_info_title')}</h4>
                                                                                {deliveryType === 'code' && Array.isArray(deliveryContent) && deliveryContent.length > 0 ? (
                                                                                    <div className="space-y-2">
                                                                                        {deliveryContent.map((code, index) => (
                                                                                            <div key={index} className="flex items-center gap-2 bg-slate-700 p-2 rounded-md">
                                                                                                <input type="text" readOnly value={code} className="w-full bg-transparent text-gray-200 font-mono text-sm outline-none" />
                                                                                                <button onClick={() => handleCopy(code, `${order.id}-${item.id}-${index}`)} className="bg-slate-600 hover:bg-slate-500 text-white text-xs py-1 px-3 rounded-full flex items-center gap-1">
                                                                                                   <ClipboardIcon />
                                                                                                   <span>{copyStatus === `${order.id}-${item.id}-${index}` ? t('my_account_page.code_copied') : t('my_account_page.copy_code')}</span>
                                                                                                </button>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                ) : typeof deliveryContent === 'string' && deliveryContent ? (
                                                                                    deliveryType !== 'code' ? (
                                                                                        <a href={deliveryContent} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-full text-sm">
                                                                                            {deliveryType === 'image' ? <DownloadIcon /> : <DownloadIcon />}
                                                                                            <span>{deliveryType === 'image' ? t('my_account_page.view_product') : t('my_account_page.download_product')}</span>
                                                                                        </a>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-md">
                                                                                             <input type="text" readOnly value={deliveryContent} className="w-full bg-transparent text-gray-200 font-mono text-sm outline-none" />
                                                                                                <button onClick={() => handleCopy(deliveryContent, `${order.id}-${item.id}`)} className="bg-slate-600 hover:bg-slate-500 text-white text-xs py-1 px-3 rounded-full flex items-center gap-1">
                                                                                                   <ClipboardIcon />
                                                                                                   <span>{copyStatus === `${order.id}-${item.id}` ? t('my_account_page.code_copied') : t('my_account_page.copy_code')}</span>
                                                                                                </button>
                                                                                        </div>
                                                                                    )
                                                                                ) : <p className="text-gray-400 text-sm">No content available.</p>}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="mt-4 bg-slate-900/70 p-4 rounded-lg text-center">
                                                                                <p className="text-gray-400 text-sm">{t('my_account_page.delivery_info_pending')}</p>
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                     <p className="text-gray-400 text-center py-10">{t('my_account_page.orders_empty')}</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'favorites' && (
                             <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <h2 className="text-2xl font-bold mb-6">{t('my_account_page.favorites_title')}</h2>
                                <p className="text-gray-400 text-center py-10">{t('my_account_page.favorites_empty')}</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
  }

  // --- Original Logic for other static pages ---
  const pageData = state.pages[pageKey as keyof typeof state.pages];
  if (!pageData) {
    return (
        <div className="bg-transparent py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-extrabold text-white text-center">Page not found</h1>
            </div>
        </div>
    );
  }

  const { titleKey, content } = pageData;
  const title = t(titleKey);

  // Special handling for FAQ
  if (pageKey === 'faq' && Array.isArray(content)) {
    return (
      <div className="bg-transparent py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-extrabold text-white text-center mb-12">{title}</h1>
          <div className="space-y-8">
            {content.map((item: { q: string, a: string }, index: number) => (
              <div key={index} className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-amber-400 mb-2">{item.q}</h3>
                <p className="text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">{title}</h1>
        <div className="prose prose-invert prose-lg mx-auto text-gray-300 leading-relaxed text-center">
           {typeof content === 'string' && content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;