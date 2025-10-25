import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { useAppContext } from '../state/AppContext.tsx';
import { supabaseClient } from '../supabase/client.ts';
import type { PaymentMethod, OrderItem } from '../types.ts';

// Icons
const CloseIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const SuccessIcon: React.FC = () => ( <svg className="h-16 w-16 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const WhatsAppIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.49 1.32 4.95L2 22l5.25-1.38c1.41.79 3.05 1.22 4.79 1.22h.01c5.46 0 9.9-4.44 9.91-9.9C21.95 6.45 17.5 2 12.04 2zM16.53 13.96c-.2-.09-1.17-.58-1.35-.64s-.32-.09-.45.09c-.13.18-.51.64-.62.77s-.23.15-.42.06c-.19-.09-1.25-.46-2.38-1.47s-1.74-2.22-1.93-2.58c-.19-.37-.02-.57.08-.69.09-.1.2-.26.3-.39.09-.13.13-.21.2-.35.06-.13 0-.26-.04-.35-.04-.09-.45-1.08-.62-1.47-.16-.38-.32-.33-.45-.33h-.27c-.13 0-.32.04-.48.18s-.62.6-.62 1.44c0 .84.65 1.68.75 1.81s1.24 2.18 3.01 2.96c1.77.78 2.23.83 2.64.79.41-.04 1.17-.48 1.34-.94s.16-.88.11-1.04c-.05-.13-.19-.21-.39-.3z"></path></svg> );
const UsdtIcon: React.FC = () => ( <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4.2-12.2h-2.4V6h-3.6v1.8H8v3.4h2.2v5.8h3.6v-5.8h2.4z"/></svg> );
const WalletIcon: React.FC = () => ( <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> );
const UploadIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);

const paymentIcons: { [key: string]: React.ReactNode } = {
    whatsapp: <WhatsAppIcon />,
    usdt: <UsdtIcon />,
    wallet: <WalletIcon />,
    'credit-card': <WalletIcon />,
    custom: <WalletIcon />,
};

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}


const PaymentOption: React.FC<{
    method: PaymentMethod;
    selected: boolean;
    onChange: (id: string) => void;
}> = ({ method, selected, onChange }) => {
    const { t } = useLanguage();
    const icon = method.icon === 'custom' 
        ? <img src={method.custom_icon_url} alt={method.name} className="w-6 h-6" />
        : (paymentIcons[method.icon] || <WalletIcon />);

    return (
        <div className={`relative ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {!method.enabled && <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{t('checkout.coming_soon')}</span>}
            <label htmlFor={method.id} className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-colors cursor-pointer ${selected ? 'border-amber-500 bg-slate-700' : 'border-slate-600 bg-slate-800 hover:border-slate-500'}`}>
                <input type="radio" id={method.id} name="paymentMethod" value={method.id} checked={selected} onChange={() => onChange(method.id)} className="hidden" disabled={!method.enabled} />
                <div className={`text-2xl ${selected ? 'text-amber-400' : 'text-gray-400'}`}>{icon}</div>
                <span className="font-semibold">{method.name}</span>
            </label>
        </div>
    );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
    const { t, dir } = useLanguage();
    const { state, clearCart, addOrder } = useAppContext();
    const { cart, currentUser, siteSettings } = state;
    const availableMethods = siteSettings.payment_methods.filter(m => m.enabled);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPendingVerification, setIsPendingVerification] = useState(false);
    const [selectedMethodId, setSelectedMethodId] = useState(availableMethods[0]?.id || '');
    
    const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
    const [customerWhatsapp, setCustomerWhatsapp] = useState(currentUser?.whatsapp || '');
    
    const [copyStatus, setCopyStatus] = useState('');
    const [proofImageUrl, setProofImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.product.price.replace(/[^0-9.-]+/g, ''));
        return sum + price * item.quantity;
    }, 0);
    const currency = cart.length > 0 ? cart[0].product.price.replace(/[0-9.,\s]/g, '') : '$';

    const handleCopy = (textToCopy: string, id: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopyStatus(id);
        setTimeout(() => setCopyStatus(''), 2000);
    };

    const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadMessage(t('checkout.uploading_proof'));

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { error } = await supabaseClient.storage.from('order_proofs').upload(filePath, file);
        
        if (error) {
            console.error('Upload error:', error);
            setUploadMessage(`Upload failed: ${error.message}`);
        } else {
            const { data } = supabaseClient.storage.from('order_proofs').getPublicUrl(filePath);
            setProofImageUrl(data.publicUrl);
            setUploadMessage(t('checkout.proof_uploaded'));
        }
        setIsUploading(false);
    };
    
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedMethod = availableMethods.find(m => m.id === selectedMethodId);
        if (!selectedMethod) return;

        setIsProcessing(true);
        
        const orderItems: OrderItem[] = cart.map(item => ({ product: item.product, quantity: item.quantity, id: item.product.id }));

        const { error } = await addOrder({
            customerName: currentUser?.fullName || 'Guest',
            customerEmail,
            customerWhatsapp,
            order_items: orderItems,
            total: subtotal,
            payment_method: selectedMethod.name,
            payment_proof_url: proofImageUrl
        });

        if (error) {
            alert(`Error placing order: ${error.message}`);
            setIsProcessing(false);
        } else {
            setIsProcessing(false);

            // If WhatsApp method, open link after order creation
            if (selectedMethod.icon === 'whatsapp') {
                const productsList = cart.map(item => `- ${item.quantity} x ${t(item.product.name)}`).join('\n');
                const message = encodeURIComponent(`مرحباً، أود متابعة الطلب الخاص بي.\n\nالمنتجات:\n${productsList}\n\nالمجموع: ${subtotal.toFixed(2)}${currency}\n\nالبريد الإلكتروني: ${customerEmail}\nرقم الواتساب: ${customerWhatsapp}`);
                // Assumes the number is configured in the first field of the payment method
                const whatsappNumber = selectedMethod.fields[0]?.value || '';
                if(whatsappNumber) {
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
                    window.open(whatsappUrl, '_blank');
                }
            }

            // Any method that requires manual verification
            if (selectedMethod.icon !== 'credit-card') { 
                setIsPendingVerification(true);
            } else {
                setIsSuccess(true);
            }
            clearCart();
        }
    };
    
    const handleClose = () => {
        setIsSuccess(false);
        setIsPendingVerification(false);
        setProofImageUrl('');
        setUploadMessage('');
        setSelectedMethodId(availableMethods[0]?.id || '');
        onClose();
    };

    const renderExpansionPanel = (method: PaymentMethod) => (
        <div className="bg-slate-900/50 p-4 mt-2 rounded-b-lg space-y-4">
            {method.instructions && <p className="text-sm text-gray-300 mb-4">{method.instructions}</p>}
            {method.fields.map(field => (
                <div key={field.id}>
                    <p className="text-sm text-gray-300">{field.label}:</p>
                    <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-md mt-1">
                        <input type="text" readOnly value={field.value} className="w-full bg-transparent text-amber-300 font-mono text-sm outline-none" />
                        {field.is_copyable && (
                            <button type="button" onClick={() => handleCopy(field.value, field.id)} className="bg-slate-600 hover:bg-slate-500 text-white text-xs py-1 px-3 rounded-full">
                                {copyStatus === field.id ? t('checkout.copied') : t('checkout.copy')}
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {method.icon !== 'whatsapp' && (
                <div>
                    <label htmlFor="proofUpload" className="flex items-center justify-center w-full bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold py-2 px-4 rounded-full text-sm cursor-pointer">
                        <UploadIcon />
                        <span>{t('checkout.upload_proof')}</span>
                    </label>
                    <input id="proofUpload" type="file" accept="image/*" className="hidden" onChange={handleProofUpload} />
                    {uploadMessage && <p className={`text-xs mt-2 text-center ${proofImageUrl ? 'text-green-400' : 'text-red-400'}`}>{uploadMessage}</p>}
                </div>
            )}
        </div>
    );
    
    if (!isOpen) return null;
    
    const finalTitle = isSuccess ? t('checkout.payment_successful') : (isPendingVerification ? t('checkout.order_pending_verification_title') : t('checkout.title'));
    const selectedMethod = availableMethods.find(m => m.id === selectedMethodId);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div dir={dir} className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-700 max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold">{finalTitle}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon /></button>
                </div>

                {isSuccess || isPendingVerification ? (
                    <div className="text-center py-8">
                        <SuccessIcon />
                        <p className="mt-4 text-lg">
                            {isSuccess ? t('checkout.order_placed_message') : t('checkout.order_pending_verification_message')}
                        </p>
                         <button onClick={handleClose} className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-full text-lg">
                            {t('checkout.continue_shopping')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handlePayment} className="space-y-6">
                        {/* Order Summary */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">{t('checkout.order_summary')}</h3>
                            <div className="max-h-48 overflow-y-auto space-y-3 bg-slate-900/50 p-3 rounded-lg">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex items-center gap-4">
                                        <img src={item.product.image_urls[0]} alt={t(item.product.name)} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                        <div className="flex-1 text-right">
                                            <p className="font-semibold text-white">{t(item.product.name)}</p>
                                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-300">{item.product.price}</p>
                                    </div>
                                ))}
                            </div>
                             <div className="flex justify-between items-center border-t border-slate-700 pt-3 mt-3">
                                <span className="text-lg font-bold text-gray-200">{t('checkout.total')}:</span>
                                <span className="text-xl font-bold text-amber-400">{subtotal.toFixed(2)} {currency}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">{t('checkout.email')}</label>
                                <input type="email" placeholder={t('auth.emailPlaceholder')} value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">{t('checkout.whatsapp')}</label>
                                <input type="tel" placeholder={t('auth.whatsappPlaceholder')} value={customerWhatsapp} onChange={(e) => setCustomerWhatsapp(e.target.value)} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                            </div>
                        </div>

                        <div>
                           <h3 className="font-semibold mb-3">{t('checkout.payment_method')}</h3>
                           <div className="space-y-3">
                                {availableMethods.map(method => (
                                   <div key={method.id}>
                                       <PaymentOption method={method} selected={selectedMethodId === method.id} onChange={setSelectedMethodId} />
                                       {/* FIX: Hide expansion panel for WhatsApp as it's not needed */}
                                       <div className={`overflow-hidden transition-all duration-300 ease-in-out ${selectedMethodId === method.id && method.fields.length > 0 && method.icon !== 'whatsapp' ? 'max-h-96' : 'max-h-0'}`}>
                                            {selectedMethodId === method.id && method.fields.length > 0 && renderExpansionPanel(method)}
                                       </div>
                                   </div>
                                ))}
                           </div>
                        </div>

                         <div className="pt-4">
                            <button type="submit" disabled={isProcessing || isUploading} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-full text-lg disabled:bg-slate-600 disabled:cursor-not-allowed">
                                {isProcessing ? t('checkout.processing') : (selectedMethod?.icon === 'whatsapp' ? 'متابعة عبر واتساب' : t('checkout.pay_now'))}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;