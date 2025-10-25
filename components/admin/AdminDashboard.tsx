import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { useAppContext } from '../../state/AppContext.tsx';


const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();
    const { state } = useAppContext();
    const { orders, users, categories } = state;

    const totalRevenue = orders
        .filter(o => o.status === 'Completed')
        .reduce((sum, order) => sum + order.total, 0);

    const pendingOrders = orders.filter(o => o.status === 'Payment Pending' || o.status === 'Processing').length;
    const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);

    return (
        <div className="text-right">
            <h1 className="text-3xl font-bold mb-8">{t('admin.dashboard.title')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-gray-400">إجمالي الإيرادات</h3>
                    <p className="text-3xl font-bold text-amber-400 mt-2">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-gray-400">الطلبات المعلقة</h3>
                    <p className="text-3xl font-bold mt-2">{pendingOrders}</p>
                </div>
                 <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-gray-400">إجمالي المستخدمين</h3>
                    <p className="text-3xl font-bold mt-2">{users.length}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-gray-400">إجمالي المنتجات</h3>
                    <p className="text-3xl font-bold mt-2">{totalProducts}</p>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;