import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppContext } from '../../state/AppContext';
import type { Order, OrderItem } from '../../types';
import { supabaseClient } from '../../supabase/client.ts';

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

type DeliveryContentState = {
    [itemId: string]: string;
};

const ManualSendModal: React.FC<{
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (orderId: string, deliveryData: { [itemId: string]: string | string[] }) => Promise<void>;
}> = ({ order, isOpen, onClose, onSave }) => {
    const { t } = useLanguage();
    const [deliveryContent, setDeliveryContent] = useState<DeliveryContentState>({});

    React.useEffect(() => {
        if (order) {
            const initialContent: DeliveryContentState = {};
            order.order_items.forEach(item => {
                const existingContent = order.manual_delivery_data?.[item.id];
                if (Array.isArray(existingContent)) {
                    initialContent[item.id] = existingContent.join('\n');
                } else if (typeof existingContent === 'string') {
                    initialContent[item.id] = existingContent;
                } else {
                    initialContent[item.id] = '';
                }
            });
            setDeliveryContent(initialContent);
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const handleContentChange = (itemId: string, value: string) => {
        setDeliveryContent(prev => ({ ...prev, [itemId]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const deliveryData: { [itemId: string]: string | string[] } = {};
        for (const itemId in deliveryContent) {
            const content = deliveryContent[itemId];
            if (content.includes('\n')) {
                deliveryData[itemId] = content.split('\n').filter(c => c.trim() !== '');
            } else {
                deliveryData[itemId] = content;
            }
        }
        onSave(order.id, deliveryData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{t('admin.orders.edit_delivery_content_title')} - #{order.id.slice(-6)}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {order.order_items.map(item => (
                        <div key={item.id} className="bg-slate-700 p-4 rounded-lg">
                            <div className="flex items-center gap-4 mb-2">
                                <img src={item.product.image_urls[0]} alt={t(item.product.name)} className="w-12 h-12 object-cover rounded" />
                                <div>
                                    <p className="font-semibold text-white">{t(item.product.name)}</p>
                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <label htmlFor={`item-content-${item.id}`} className="block text-sm font-semibold text-gray-300 mb-1">{t('admin.orders.product_content_label')}</label>
                            <textarea
                                id={`item-content-${item.id}`}
                                value={deliveryContent[item.id] || ''}
                                onChange={(e) => handleContentChange(item.id, e.target.value)}
                                className="w-full bg-slate-800 p-2 rounded border border-slate-600 h-24"
                                placeholder="Enter code or URL. For multiple codes, use one per line."
                            />
                        </div>
                    ))}
                    <div className="flex justify-start gap-4 pt-4">
                        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.orders.save_and_send')}</button>
                        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.cancel')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminOrders: React.FC = () => {
    const { t } = useLanguage();
    const { state, updateOrderStatus, updateOrderDelivery } = useAppContext();
    const { orders } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isProofLoading, setIsProofLoading] = useState<string | null>(null);

    const openManualSendModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleSaveDelivery = async (orderId: string, deliveryData: { [itemId: string]: string | string[] }) => {
        const { error } = await updateOrderDelivery(orderId, deliveryData);
        if (error) {
            alert(`Failed to update delivery info: ${error.message}`);
        } else {
            setIsModalOpen(false);
            setSelectedOrder(null);
        }
    };

    const handleViewProof = async (orderId: string, proofUrl: string | undefined) => {
        if (!proofUrl) return;

        setIsProofLoading(orderId);
        try {
            const url = new URL(proofUrl);
            const path = url.pathname.split('/order_proofs/')[1];
            if (!path) {
                throw new Error('Could not extract file path from URL.');
            }

            // Create a signed URL that expires in 1 minute
            const { data, error } = await supabaseClient
                .storage
                .from('order_proofs')
                .createSignedUrl(path, 60);

            if (error) {
                throw error;
            }

            // Open the signed URL in a new tab
            window.open(data.signedUrl, '_blank');
        } catch (error: any) {
            console.error('Error creating signed URL:', error);
            alert(`Could not open payment proof: ${error.message}`);
        } finally {
            setIsProofLoading(null);
        }
    };


    return (
        <div className="bg-slate-800 p-6 rounded-lg text-right">
            <ManualSendModal 
                isOpen={isModalOpen}
                order={selectedOrder}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDelivery}
            />
            <h1 className="text-3xl font-bold mb-8">{t('admin.orders.title')}</h1>

            <div className="overflow-x-auto">
                {orders.length > 0 ? (
                    <table className="min-w-full bg-slate-700 rounded-lg">
                        <thead>
                            <tr className="border-b border-slate-600">
                                <th className="p-4">{t('admin.orders.actions')}</th>
                                <th className="p-4">{t('admin.orders.payment_proof')}</th>
                                <th className="p-4">{t('admin.orders.status')}</th>
                                <th className="p-4">{t('admin.orders.total')}</th>
                                <th className="p-4">{t('admin.orders.products')}</th>
                                <th className="p-4">{t('admin.orders.customer')}</th>
                                <th className="p-4">{t('admin.orders.date')}</th>
                                <th className="p-4">{t('admin.orders.order_id')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-600/50">
                                    <td className="p-4 space-y-2">
                                        <select 
                                            value={order.status} 
                                            onChange={async (e) => await updateOrderStatus(order.id, e.target.value as Order['status'])}
                                            className="bg-slate-600 border border-slate-500 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2"
                                        >
                                            <option value="Payment Pending">{t('admin.orders.status_pending')}</option>
                                            <option value="Processing">{t('admin.orders.status_processing')}</option>
                                            <option value="Completed">{t('admin.orders.status_completed')}</option>
                                            <option value="Cancelled">{t('admin.orders.status_cancelled')}</option>
                                        </select>
                                        <button 
                                            onClick={() => openManualSendModal(order)}
                                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs py-2 px-2 rounded-lg"
                                        >
                                            {t('admin.orders.manual_send')}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        {order.payment_proof_url ? (
                                            <button
                                                onClick={() => handleViewProof(order.id, order.payment_proof_url)}
                                                disabled={isProofLoading === order.id}
                                                className="text-sky-400 hover:text-sky-300 underline text-sm disabled:opacity-50 disabled:cursor-wait"
                                            >
                                                {isProofLoading === order.id ? 'جاري الفتح...' : t('admin.orders.view_proof')}
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center"><StatusBadge status={order.status} /></td>
                                    <td className="p-4 font-mono text-amber-400">{order.total.toFixed(2)}$</td>
                                    <td className="p-4 text-sm text-gray-300">
                                        {order.order_items.map(item => (
                                            <div key={item.id}>
                                                {item.quantity}x {t(item.product.name)}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-white">{order.customerName}</div>
                                        <div className="text-xs text-gray-400">{order.customerEmail}</div>
                                        <div className="text-xs text-gray-400">{order.customerWhatsapp}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-mono text-gray-400">#{order.id.slice(-6).toUpperCase()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('admin.orders.no_orders')}</p>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;