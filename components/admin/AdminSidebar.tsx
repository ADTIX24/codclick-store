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
const PagesIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const LogoutIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

interface AdminSidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

const setupScript = `
-- CODCLICK SUPABASE SETUP SCRIPT (v22 - Final RLS & Function Fix)
-- This version fixes the circular dependency in RLS policies by reading the user role
-- directly from auth.users, ensuring reliable data fetching for admins.

BEGIN;

-- PART 0: PRE-FLIGHT CLEANUP (Drop policies, functions, triggers, etc.)
----------------------------------------------------------------
DO $$ DECLARE
    tbl_name TEXT;
    pol_name TEXT;
BEGIN
    -- Drop all RLS policies on public tables
    FOR tbl_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        FOR pol_name IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl_name LOOP
            EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol_name) || ' ON public.' || quote_ident(tbl_name) || ' CASCADE;';
        END LOOP;
        -- Disable RLS on the table to ensure we can work with it
        EXECUTE 'ALTER TABLE public.' || quote_ident(tbl_name) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
    -- Drop storage policies
    EXECUTE 'DROP POLICY IF EXISTS "Allow public read access on storage" ON storage.objects CASCADE;';
    EXECUTE 'DROP POLICY IF EXISTS "Allow admin full access to product storage" ON storage.objects CASCADE;';
    EXECUTE 'DROP POLICY IF EXISTS "Allow authenticated users to upload proofs" ON storage.objects CASCADE;';
    EXECUTE 'DROP POLICY IF EXISTS "Allow owners/admins to read proofs" ON storage.objects CASCADE;';
END $$;

-- Now that policies are gone, we can safely drop dependent objects
DROP VIEW IF EXISTS public.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_role_and_meta(uuid, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.get_my_role() CASCADE;
DROP FUNCTION IF EXISTS public.apply_public_read_admin_write_policy(text) CASCADE;

-- PART 1: DATA PRESERVATION & TABLE REBUILD
----------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
    RAISE NOTICE 'Backing up user_profiles...';
    CREATE TEMP TABLE user_profiles_temp AS TABLE public.user_profiles;
    RAISE NOTICE 'Dropping old user_profiles table...';
    DROP TABLE public.user_profiles CASCADE;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    RAISE NOTICE 'Backing up orders...';
    CREATE TEMP TABLE orders_temp AS TABLE public.orders;
    RAISE NOTICE 'Dropping old orders table...';
    DROP TABLE public.orders CASCADE;
  END IF;
END $$;

create table public.user_profiles ( id uuid primary key, full_name text, whatsapp text, role text default 'customer' not null, email text unique );
create table public.orders ( id uuid primary key default gen_random_uuid(), user_id uuid, created_at timestamp with time zone default now(), order_items jsonb, total real not null, status text not null, customer_name text, customer_email text, customer_whatsapp text, payment_method text, payment_proof_url text, manual_delivery_data jsonb );

-- PART 1.5: ROBUST DATA RESTORATION WITH SANITIZATION
----------------------------------------------------------------
DO $$
DECLARE
  full_name_col_select TEXT;
  uuid_regex TEXT := '^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$';
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'user_profiles_temp' AND relpersistence = 't') THEN
    RAISE NOTICE 'Restoring sanitized data to new user_profiles table...';

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles_temp' and column_name = 'full_name') THEN
      full_name_col_select := 'full_name';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles_temp' and column_name = 'fullName') THEN
      full_name_col_select := '"fullName"';
    ELSE
      full_name_col_select := 'NULL';
    END IF;

    EXECUTE 'INSERT INTO public.user_profiles (id, full_name, whatsapp, role, email) SELECT id::uuid, ' || full_name_col_select || ', whatsapp, role, email FROM user_profiles_temp WHERE id::text ~* ''' || uuid_regex || ''' ON CONFLICT (id) DO NOTHING';
    
    DROP TABLE user_profiles_temp;
  END IF;
END $$;

DO $$
DECLARE
  insert_sql TEXT;
  old_date_column_exists BOOLEAN;
  customer_name_col_select TEXT;
  customer_email_col_select TEXT;
  customer_whatsapp_col_select TEXT;
  uuid_regex TEXT := '^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$';
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'orders_temp' AND relpersistence = 't') THEN
    RAISE NOTICE 'Restoring sanitized data to new orders table...';

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders_temp' AND column_name='customer_name') THEN customer_name_col_select := 'customer_name'; ELSE customer_name_col_select := 'NULL'; END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders_temp' AND column_name='customer_email') THEN customer_email_col_select := 'customer_email'; ELSE customer_email_col_select := 'NULL'; END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders_temp' AND column_name='customer_whatsapp') THEN customer_whatsapp_col_select := 'customer_whatsapp'; ELSE customer_whatsapp_col_select := 'NULL'; END IF;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders_temp' and column_name='date') INTO old_date_column_exists;
    
    insert_sql := 'INSERT INTO public.orders (id, user_id, created_at, order_items, total, status, customer_name, customer_email, customer_whatsapp, payment_method, payment_proof_url, manual_delivery_data) SELECT ' ||
      'id::uuid, ' ||
      '(CASE WHEN user_id::text ~* ''' || uuid_regex || ''' THEN user_id::uuid ELSE NULL END), ' ||
      (CASE WHEN old_date_column_exists THEN 'COALESCE(created_at, date::timestamptz), ' ELSE 'created_at, ' END) ||
      'order_items, total, status, ' ||
      customer_name_col_select || ', ' ||
      customer_email_col_select || ', ' ||
      customer_whatsapp_col_select || ', ' ||
      'payment_method, payment_proof_url, manual_delivery_data FROM orders_temp ' ||
      'WHERE id::text ~* ''' || uuid_regex || ''' ON CONFLICT (id) DO NOTHING;';
    
    RAISE NOTICE 'Executing restore: %', insert_sql;
    EXECUTE insert_sql;
    DROP TABLE orders_temp;
  END IF;
END $$;


-- PART 2: REBUILD OTHER TABLES & CONSTRAINTS (with snake_case)
----------------------------------------------------------------
create table if not exists public.categories ( id uuid primary key default gen_random_uuid(), name text not null, image_url text, created_at timestamp with time zone default now() );
create table if not exists public.products ( id uuid primary key default gen_random_uuid(), category_id uuid, name text not null, price text not null, image_urls text[] default '{}', description text, rating real default 5.0, delivery_type text not null, delivery_content jsonb, created_at timestamp with time zone default now() );
create table if not exists public.site_settings ( id int primary key default 1, logo_url text, slide_interval int, social_links jsonb, app_download_link text, copyright_text text, payment_methods jsonb, constraint single_row check (id = 1) );
create table if not exists public.hero_slides ( id uuid primary key default gen_random_uuid(), title text, subtitle text, type text, image_url text, video_url text, youtube_url text, duration int, created_at timestamp with time zone default now() );
create table if not exists public.pages ( id text primary key, content jsonb, updated_at timestamp with time zone default now() );
create table if not exists public.homepage_sections ( id uuid primary key default gen_random_uuid(), index int not null, type text not null, title text, subtitle text, category_id uuid, visible boolean default true );

ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE public.homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_category_id_fkey;

ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;
ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;
ALTER TABLE public.homepage_sections ADD CONSTRAINT homepage_sections_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

-- PART 3: REBUILD FUNCTIONS, TRIGGERS, VIEWS
----------------------------------------------------------------
-- This function now reads the role directly from auth.users to avoid RLS circular dependencies.
create or replace function public.get_my_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return 'anon';
  end if;
  return (
    select raw_user_meta_data->>'role'
    from auth.users
    where id = auth.uid()
  );
end;
$$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$ begin insert into public.user_profiles (id, full_name, email, whatsapp, role) values ( new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'whatsapp', coalesce(new.raw_user_meta_data->>'role', 'customer') ) on conflict (id) do update set full_name = new.raw_user_meta_data->>'full_name', email = new.email, whatsapp = new.raw_user_meta_data->>'whatsapp', role = coalesce(new.raw_user_meta_data->>'role', 'customer'); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.update_user_role_and_meta(user_id uuid, new_role text, new_full_name text) 
returns void 
language plpgsql 
security definer as $$ 
begin 
  if not (public.get_my_role() IN ('owner', 'moderator')) then 
    raise exception 'Only admins can change user roles.'; 
  end if; 
  update auth.users 
  set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', new_role, 'full_name', new_full_name) 
  where id = user_id; 
  update public.user_profiles 
  set role = new_role, full_name = new_full_name 
  where id = user_id; 
end; $$;

create or replace view public.users as select id, full_name, email, whatsapp, role from public.user_profiles;

-- PART 4: RE-APPLY RLS
----------------------------------------------------------------
create or replace function apply_public_read_admin_write_policy(table_name_param text) returns void as $$ begin execute format(' ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "Allow public read access" ON public.%I; CREATE POLICY "Allow public read access" ON public.%I FOR SELECT USING (true); DROP POLICY IF EXISTS "Allow admin full access" ON public.%I; CREATE POLICY "Allow admin full access" ON public.%I FOR ALL USING (public.get_my_role() in (''owner'', ''moderator'')); ', table_name_param, table_name_param, table_name_param, table_name_param, table_name_param); end; $$ language plpgsql;

alter table public.user_profiles enable row level security;
drop policy if exists "Admins can manage all profiles" on public.user_profiles;
create policy "Admins can manage all profiles" on public.user_profiles for all using (public.get_my_role() in ('owner', 'moderator'));
drop policy if exists "Users can view their own profile" on public.user_profiles;
create policy "Users can view their own profile" on public.user_profiles for select using (auth.uid()::uuid = id);
drop policy if exists "Users can update their own profile" on public.user_profiles;
create policy "Users can update their own profile" on public.user_profiles for update using (auth.uid()::uuid = id) with check (auth.uid()::uuid = id);

alter table public.orders enable row level security;
drop policy if exists "Admins can manage all orders" on public.orders;
create policy "Admins can manage all orders" on public.orders for all using (public.get_my_role() in ('owner', 'moderator'));
drop policy if exists "Users can manage their own orders" on public.orders;
create policy "Users can manage their own orders" on public.orders for all using (auth.uid()::uuid = user_id);

select apply_public_read_admin_write_policy('categories');
select apply_public_read_admin_write_policy('products');
select apply_public_read_admin_write_policy('site_settings');
select apply_public_read_admin_write_policy('hero_slides');
select apply_public_read_admin_write_policy('pages');
select apply_public_read_admin_write_policy('homepage_sections');

-- PART 5: STORAGE POLICIES
------------------------------------------------
drop policy if exists "Allow public read access on storage" on storage.objects;
create policy "Allow public read access on storage" on storage.objects for select using ( bucket_id IN ('product_images', 'product_files', 'order_proofs') );
drop policy if exists "Allow admin full access to product storage" on storage.objects;
create policy "Allow admin full access to product storage" on storage.objects for all using ( bucket_id IN ('product_images', 'product_files') and public.get_my_role() in ('owner', 'moderator') );
drop policy if exists "Allow authenticated users to upload proofs" on storage.objects;
create policy "Allow authenticated users to upload proofs" on storage.objects for insert to authenticated with check (bucket_id = 'order_proofs');
drop policy if exists "Allow owners/admins to read proofs" on storage.objects;
-- FINAL FIX: Cast owner_id (text) to uuid to correctly compare with auth.uid() (uuid).
create policy "Allow owners/admins to read proofs" on storage.objects for select to authenticated using ( bucket_id = 'order_proofs' and (public.get_my_role() in ('owner', 'moderator') OR owner_id::uuid = auth.uid()::uuid) );

COMMIT;
`;


const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full text-right p-3 rounded-lg transition-colors ${isActive ? 'bg-amber-500/10 text-amber-400' : 'hover:bg-slate-700/50 text-gray-300'}`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);


const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, onNavigate }) => {
    const { t } = useLanguage();
    const { logout } = useAppContext();
    const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyScript = () => {
        navigator.clipboard.writeText(setupScript.trim());
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const navItems = [
        { key: 'dashboard', icon: <DashboardIcon />, label: t('admin.dashboard.title') },
        { key: 'products', icon: <ProductsIcon />, label: t('admin.products.title') },
        { key: 'orders', icon: <OrdersIcon />, label: t('admin.orders.title') },
        { key: 'users', icon: <UsersIcon />, label: t('admin.users.title') },
        { key: 'sections', icon: <SectionsIcon />, label: t('admin.sections.title') },
        { key: 'payment', icon: <PaymentIcon />, label: t('admin.payment.title') },
        { key: 'settings', icon: <SettingsIcon />, label: t('admin.settings.title') },
        { key: 'pages', icon: <PagesIcon />, label: t('admin.pages.title') },
    ];

    return (
        <>
            <aside className="md:w-64 flex-shrink-0">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex flex-col">
                    <div className="space-y-2 flex-1">
                        {navItems.map(item => (
                             <NavItem 
                                key={item.key}
                                icon={item.icon} 
                                label={item.label}
                                isActive={activePage === item.key}
                                onClick={() => onNavigate(item.key)} 
                             />
                        ))}
                    </div>
                    <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
                        <button 
                            onClick={() => setIsSetupGuideOpen(true)}
                            className="w-full text-center p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-gray-300 font-semibold"
                        >
                            دليل إعداد Supabase
                        </button>
                        <NavItem 
                            icon={<LogoutIcon />} 
                            label={t('header.logout')}
                            isActive={false}
                            onClick={logout} 
                        />
                    </div>
                </div>
            </aside>

             {isSetupGuideOpen && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setIsSetupGuideOpen(false)}>
                    <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl p-6 border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">دليل إعداد قاعدة بيانات Supabase</h2>
                        <p className="text-gray-400 mb-6">
                            لتشغيل الموقع بشكل صحيح، يرجى نسخ وتنفيذ هذا السكربت بالكامل في <code className="bg-slate-900 text-amber-400 px-1 rounded">SQL Editor</code> داخل مشروعك في Supabase. سيقوم السكربت بإعداد الجداول، الصلاحيات، والوظائف اللازمة.
                        </p>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={setupScript.trim()}
                                className="w-full h-80 bg-slate-900 text-gray-300 font-mono text-sm p-4 rounded-lg border border-slate-700 resize-none"
                                dir="ltr"
                            />
                             <button
                                onClick={handleCopyScript}
                                className="absolute top-2 left-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1 px-3 rounded text-xs"
                            >
                                {copySuccess ? 'تم النسخ!' : 'نسخ السكربت'}
                            </button>
                        </div>
                        <div className="mt-6 text-left">
                             <button onClick={() => setIsSetupGuideOpen(false)} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full text-sm">إغلاق</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminSidebar;