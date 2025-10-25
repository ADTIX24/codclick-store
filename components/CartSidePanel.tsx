import React from 'react';
import { useAppContext } from '../state/AppContext';
import { useLanguage } from '../i18n/LanguageContext';

interface CartSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

const CloseIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const TrashIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> );

const CartSidePanel: React.FC<CartSidePanelProps> = ({ isOpen, onClose, onCheckout }) => {
    const { state, updateCartQuantity, removeFromCart } = useAppContext();
    const { t, dir } = useLanguage();
    const { cart } = state;

    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.product.price.replace(/[^0-9.-]+/g, ''));
        return sum + price * item.quantity;
    }, 0);
    
    const currency = cart.length > 0 ? cart[0].product.price.replace(/[0-9.,\s]/g, '') : '$';

    return (
        <>
            {/* Backdrop */}
            <div className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>

            {/* Side Panel */}
            <div dir={dir} className={`fixed top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-slate-800 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : (dir === 'rtl' ? '-translate-x-full' : 'translate-x-full')}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700">
                        <h2 className="text-xl font-bold text-white">{t('cart.shopping_cart')}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon /></button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-400 pt-20">
                                <p className="text-lg font-semibold">{t('cart.empty_cart')}</p>
                                <p>{t('cart.empty_cart_message')}</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {cart.map(item => (
                                    <li key={item.product.id} className="flex gap-4">
                                        <img src={item.product.image_urls[0]} alt={t(item.product.name)} className="w-20 h-20 object-cover rounded-md" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white">{t(item.product.name)}</h3>
                                            <p className="text-amber-400">{item.product.price}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-slate-600 rounded-full">
                                                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1 text-lg">-</button>
                                                    <span className="px-3">{item.quantity}</span>
                                                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1 text-lg">+</button>
                                                </div>
                                                 <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                                    <TrashIcon />
                                                    <span className="sr-only">{t('cart.remove')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-6 border-t border-slate-700 bg-slate-800">
                            <div className="flex justify-between items-center mb-4 text-lg">
                                <span className="font-semibold text-gray-300">{t('cart.subtotal')}:</span>
                                <span className="font-bold text-amber-400">{subtotal.toFixed(2)} {currency}</span>
                            </div>
                            <button onClick={onCheckout} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-full text-lg transition-transform duration-300 hover:scale-105">
                                {t('cart.proceed_to_checkout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidePanel;