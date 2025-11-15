import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { supabaseClient } from '../../supabase/client.ts';

interface Stats {
    totalRevenue: number;
    pendingOrders: number;
    userCount: number;
    productCount: number;
}

const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        pendingOrders: 0,
        userCount: 0,
        productCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const ordersPromise = supabaseClient
                    .from('orders')
                    .select('total, status');

                const usersPromise = supabaseClient
                    .from('user_profiles')
                    .select('id', { count: 'exact', head: true });

                const productsPromise = supabaseClient
                    .from('products')
                    .select('id', { count: 'exact', head: true });

                const [ordersRes, usersRes, productsRes] = await Promise.all([
                    ordersPromise,
                    usersPromise,
                    productsPromise,
                ]);

                if (ordersRes.error) throw new Error(`Orders: ${ordersRes.error.message}`);
                if (usersRes.error) throw new Error(`Users: ${usersRes.error.message}`);
                if (productsRes.error) throw new Error(`Products: ${productsRes.error.message}`);

                const totalRevenue = (ordersRes.data || [])
                    .filter(o => o.status === 'Completed')
                    .reduce((sum, order) => sum + order.total, 0);

                const pendingOrders = (ordersRes.data || [])
                    .filter(o => o.status === 'Payment Pending' || o.status === 'Processing').length;
                
                setStats({
                    totalRevenue,
                    pendingOrders,
                    userCount: usersRes.count || 0,
                    productCount: productsRes.count || 0,
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                // Optionally show an error message in the UI
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
        <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400">{title}</h3>
            {isLoading ? (
                 <div className="h-9 w-24 bg-slate-700 rounded-md animate-pulse mt-2"></div>
            ) : (
                <p className="text-3xl font-bold mt-2">{value}</p>
            )}
        </div>
    );

    return (
        <div className="text-right">
            <h1 className="text-3xl font-bold mb-8">{t('admin.dashboard.title')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="إجمالي الإيرادات" value={`$${stats.totalRevenue.toFixed(2)}`} />
                <StatCard title="الطلبات المعلقة" value={stats.pendingOrders} />
                <StatCard title="إجمالي المستخدمين" value={stats.userCount} />
                <StatCard title="إجمالي المنتجات" value={stats.productCount} />
            </div>
        </div>
    );
};

export default AdminDashboard;