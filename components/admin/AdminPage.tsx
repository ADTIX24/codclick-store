import React from 'react';
import AdminSidebar from './AdminSidebar.tsx';
import AdminDashboard from './AdminDashboard.tsx';
import AdminProducts from './AdminProducts.tsx';
import AdminOrders from './AdminOrders.tsx';
import AdminUsers from './AdminUsers.tsx';
import AdminSettings from './AdminSettings.tsx';
import AdminPages from './AdminPages.tsx';
import AdminSections from './AdminSections.tsx';
import AdminPaymentMethods from './AdminPaymentMethods.tsx';
import { useAppContext } from '../../state/AppContext.tsx';

const AdminPage: React.FC = () => {
    const { state, setAdminPage } = useAppContext();
    const { adminPage } = state;

    const renderAdminContent = () => {
        switch (adminPage) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'products':
                return <AdminProducts />;
            case 'orders':
                return <AdminOrders />;
            case 'users':
                return <AdminUsers />;
            case 'sections':
                return <AdminSections />;
            case 'payment':
                return <AdminPaymentMethods />;
            case 'settings':
                return <AdminSettings />;
            case 'pages':
                return <AdminPages />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    <AdminSidebar activePage={adminPage} onNavigate={setAdminPage} />
                    <main className="flex-1">
                        {renderAdminContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;