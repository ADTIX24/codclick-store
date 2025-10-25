import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { useAppContext } from '../../state/AppContext.tsx';

// Icons
const DashboardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ProductsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const OrdersIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const UsersIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3M15 21a2 2 0 002-2v-1a2 2 0 00-2-2h-3a2 2 0 00-2 2v1a2 2 0 002 2h3z" /></svg>;
const SectionsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const PaymentIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const SettingsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PagesIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const GuideIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ReturnIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h12" /></svg>;


interface AdminSidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, onNavigate }) => {
    const { t } = useLanguage();
    const { navigateTo } = useAppContext();
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [copyStatus, setCopyStatus] = useState(false);


    const navItems = [
        { id: 'dashboard', label: t('admin.dashboard.title'), icon: <DashboardIcon /> },
        { id: 'products', label: t('admin.products.title'), icon: <ProductsIcon /> },
        { id: 'orders', label: t('admin.orders.title'), icon: <OrdersIcon /> },
        { id: 'users', label: t('admin.users.title'), icon: <UsersIcon /> },
        { id: 'sections', label: t('admin.sections.title'), icon: <SectionsIcon /> },
        { id: 'payment', label: t('admin.payment.title'), icon: <PaymentIcon /> },
        { id: 'pages', label: t('admin.pages.title'), icon: <PagesIcon /> },
        { id: 'settings', label: t('admin.settings.title'), icon: <SettingsIcon /> },
    ];
    
    const supabaseSetupSQL = `-- 1. Create helper function to check admin role (MUST be created before policies that use it)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', 'customer') IN ('owner', 'moderator');
$$;

-- 2. Create RPC function to update user role and metadata (for Admin Users page)
CREATE OR REPLACE FUNCTION public.update_user_role_and_meta(user_id uuid, new_role text, new_full_name text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE auth.users
  SET
    raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', new_role, 'full_name', new_full_name)
  WHERE id = user_id;
$$;


-- 3. Create a table for site settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    logo_url TEXT,
    slide_interval INT,
    social_links JSONB,
    app_download_link TEXT,
    copyright_text TEXT,
    payment_methods JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create tables for products and categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    image_urls TEXT[],
    description TEXT,
    rating NUMERIC(2,1),
    delivery_type TEXT,
    delivery_content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create table for hero slides
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subtitle TEXT,
    type TEXT,
    image_url TEXT,
    video_url TEXT,
    youtube_url TEXT,
    duration INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create table for static pages
CREATE TABLE IF NOT EXISTS public.pages (
    id TEXT PRIMARY KEY,
    title_key TEXT,
    content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create table for homepage sections
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    index INT,
    type TEXT,
    title TEXT,
    subtitle TEXT,
    category_id UUID,
    visible BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create table for orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    date TIMESTAMPTZ DEFAULT NOW(),
    order_items JSONB,
    total NUMERIC,
    status TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_whatsapp TEXT,
    payment_method TEXT,
    payment_proof_url TEXT,
    manual_delivery_data JSONB
);

-- 9. Add columns if they don't exist using a more direct method
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS app_download_link TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS payment_methods JSONB;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_content JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_items JSONB;


-- 10. Enable Row Level Security (RLS) for all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 11. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read-only access" ON public.site_settings;
DROP POLICY IF EXISTS "Allow admins full access" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.categories;
DROP POLICY IF EXISTS "Allow admins full access" ON public.categories;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.products;
DROP POLICY IF EXISTS "Allow admins full access" ON public.products;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow admins full access" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.pages;
DROP POLICY IF EXISTS "Allow admins full access" ON public.pages;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.homepage_sections;
DROP POLICY IF EXISTS "Allow admins full access" ON public.homepage_sections;
DROP POLICY IF EXISTS "Allow read access to own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to access all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins full access on orders" ON public.orders;

-- 12. Create RLS Policies for Public Read Access
CREATE POLICY "Allow public read-only access" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.homepage_sections FOR SELECT USING (true);

-- 13. Create RLS Policies for Orders (Users and Admins)
CREATE POLICY "Allow read access to own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow admins to access all orders" ON public.orders FOR SELECT USING (public.is_admin());

-- 14. Create RLS policies for Admin Full Access (ALL operations)
CREATE POLICY "Allow admins full access" ON public.site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admins full access" ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admins full access" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admins full access" ON public.hero_slides FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admins full access" ON public.pages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admins full access" ON public.homepage_sections FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admins full access on orders" ON public.orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 15. Drop and Create Storage Policies
DROP POLICY IF EXISTS "Allow public read access on product_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin write access on product_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on product_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin write access on product_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to read proofs" ON storage.objects;

-- Policies for product_images
CREATE POLICY "Allow public read access on product_images" ON storage.objects FOR SELECT USING ( bucket_id = 'product_images' );
CREATE POLICY "Allow admin write access on product_images" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product_images' AND public.is_admin() );

-- Policies for product_files
CREATE POLICY "Allow public read access on product_files" ON storage.objects FOR SELECT USING ( bucket_id = 'product_files' );
CREATE POLICY "Allow admin write access on product_files" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product_files' AND public.is_admin() );

-- Policies for order_proofs
CREATE POLICY "Allow authenticated users to upload proofs" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'order_proofs' AND auth.role() = 'authenticated' );
CREATE POLICY "Allow admin to read proofs" ON storage.objects FOR SELECT USING ( bucket_id = 'order_proofs' AND public.is_admin() );

-- 16. Insert default row into settings if it doesn't exist
INSERT INTO public.site_settings (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id = 1);
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(supabaseSetupSQL);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
    };

    const renderGuideModal = () => {
        if (!isGuideOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setIsGuideOpen(false)}>
                <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-2xl font-bold">دليل إعداد قاعدة البيانات Supabase</h2>
                        <p className="text-gray-400 mt-2">لتشغيل لوحة التحكم بشكل كامل، يجب عليك إعداد قاعدة البيانات والتخزين. اتبع الخطوات التالية بالترتيب.</p>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="mb-8">
                             <h3 className="text-xl font-bold text-amber-400 mb-3">الخطوة الأولى (يدوية): إنشاء مجلدات التخزين (Storage Buckets)</h3>
                             <p className="text-gray-400 mb-4">يجب إنشاء المجلدات التالية يدوياً من لوحة تحكم Supabase. اذهب إلى قسم "Storage" في مشروعك.</p>
                             <ul className="list-disc list-inside space-y-3 text-gray-300">
                                <li>
                                    <strong>المجلد الأول:</strong> أنشئ مجلداً باسم <code className="bg-slate-700 text-amber-300 px-1 rounded">product_images</code> وتأكد من تفعيل خيار <strong className="text-green-400">"Public bucket"</strong> (مهم لعرض الصور).
                                </li>
                                 <li>
                                    <strong>المجلد الثاني:</strong> أنشئ مجلداً باسم <code className="bg-slate-700 text-amber-300 px-1 rounded">product_files</code> وتأكد من تفعيل خيار <strong className="text-green-400">"Public bucket"</strong> (مهم لتسليم الملفات).
                                </li>
                                 <li>
                                    <strong>المجلد الثالث:</strong> أنشئ مجلداً باسم <code className="bg-slate-700 text-amber-300 px-1 rounded">order_proofs</code> وتأكد من <strong className="text-red-400">عدم تفعيل</strong> خيار "Public bucket" (للحفاظ على خصوصية إثباتات الدفع).
                                </li>
                             </ul>
                        </div>
                        <div>
                             <h3 className="text-xl font-bold text-amber-400 mb-3">الخطوة الثانية: تشغيل كود SQL</h3>
                             <p className="text-gray-400 mb-4">اذهب إلى "SQL Editor" في مشروعك، الصق الكود التالي بالكامل، ثم اضغط "Run". يمكنك تشغيل هذا الكود بأمان حتى لو قمت بتشغيله من قبل.</p>
                             <div className="relative bg-slate-900 rounded-lg">
                                <pre className="text-sm text-left whitespace-pre-wrap text-green-300 font-mono p-4 max-h-64 overflow-y-auto"><code>{supabaseSetupSQL}</code></pre>
                                <button onClick={handleCopy} className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded-full text-xs">
                                   {copyStatus ? 'تم النسخ!' : 'نسخ الكود'}
                                </button>
                            </div>
                        </div>
                    </div>
                     <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-start">
                        <button onClick={() => setIsGuideOpen(false)} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full text-sm">إغلاق</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {renderGuideModal()}
            <aside className="md:w-64 flex-shrink-0 bg-slate-800 p-4 rounded-lg border border-slate-700 self-start">
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-3 w-full text-right p-3 rounded-lg transition-colors ${
                                activePage === item.id 
                                ? 'bg-amber-500/10 text-amber-400' 
                                : 'hover:bg-slate-700/50 text-gray-300'
                            }`}
                        >
                            {item.icon}
                            <span className="font-semibold">{item.label}</span>
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-700 space-y-2">
                         <button
                            onClick={() => setIsGuideOpen(true)}
                            className="flex items-center gap-3 w-full text-right p-3 rounded-lg transition-colors hover:bg-slate-700/50 text-gray-300"
                        >
                            <GuideIcon />
                            <span className="font-semibold">دليل الإعداد</span>
                        </button>
                        <button
                            onClick={() => navigateTo('home')}
                            className="flex items-center gap-3 w-full text-right p-3 rounded-lg transition-colors hover:bg-slate-700/50 text-gray-300"
                        >
                           <ReturnIcon />
                            <span className="font-semibold">العودة للموقع</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;