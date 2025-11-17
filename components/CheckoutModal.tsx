import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { useAppContext } from '../state/AppContext.tsx';
import { supabaseClient } from '../supabase/client.ts';
import type { PaymentMethod, OrderItem } from '../types.ts';

// Icons
const CloseIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const SuccessIcon: React.FC<{className?: string}> = ({className}) => ( <svg className={className || "h-16 w-16 text-green-400 mx-auto"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
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
    const icon = method.icon === 'custom' && method.custom_icon_url 
        ? <img src={method.custom_icon_url} alt={method.name} className="w-6 h-6 object-contain" />
        : paymentIcons[method.icon] || <WalletIcon />;

    return (
        <button
            onClick={() => onChange(method.id)}
            className={`w-full flex items-center p-4 rounded-lg border-2 transition-all ${selected ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600 bg-slate-700 hover:bg-slate-600/50'}`}
        >
            {icon}
            <span className="font-semibold text-white mx-3 flex-1 text-right">{method.name}</span>
            <div className={`w-5 h-5 rounded-full border-2 ${selected ? 'bg-amber-500 border-amber-500' : 'border-slate-500'}`}></div>
        </button>
    );
};


const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
    const { state, addOrder, clearCart } = useAppContext();
    const { t, dir } = useLanguage();
    const { cart, current_user, site_settings } = state;

    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerWhatsapp, setCustomerWhatsapp] = useState('');
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
    const [uploadingProof, setUploadingProof] = useState(false);
    const [proofUrl, setProofUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState('');
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    
    const validCart = cart.filter(item => item && item.product);

    useEffect(() => {
        if (current_user) {
            setCustomerName(current_user.full_name);
            setCustomerEmail(current_user.email);
            setCustomerWhatsapp(current_user.whatsapp || '');
        }
    }, [current_user]);
    
    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setOrderPlaced(false);
            setProcessing(false);
            setError('');
            setProofUrl(null);
            setPaymentProofFile(null);
            const defaultMethod = site_settings.payment_methods.find(m => m.enabled);
            setSelectedPaymentMethodId(defaultMethod?.id || null);
        }
    }, [isOpen, site_settings.payment_methods]);

    const handleClose = () => {
        if (!processing) {
            onClose();
        }
    };
    
    const subtotal = validCart.reduce((sum, item) => {
        const price = parseFloat(item.product.price.replace(/[^0-9.-]+/g, ''));
        return sum + price * item.quantity;
    }, 0);
    const currency = validCart.length > 0 ? validCart[0].product.price.replace(/[0-9.,\s]/g, '') : '$';

    const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPaymentProofFile(file);
        setUploadingProof(true);
        setError('');
        setProofUrl(null);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
            const filePath = `${current_user?.id || 'guest'}/${fileName}`;

            const { error: uploadError } = await supabaseClient.storage.from('order_proofs').upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabaseClient.storage.from('order_proofs').getPublicUrl(filePath);
            if (!data || !data.publicUrl) throw new Error("Could not get public URL for uploaded proof.");
            
            setProofUrl(data.publicUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploadingProof(false);
        }
    };

    const handlePlaceOrder = async () => {
        setProcessing(true);
        setError('');
    
        try {
            const selectedMethod = site_settings.payment_methods.find(m => m.id === selectedPaymentMethodId);
    
            if (!selectedMethod) {
                setError("Please select a payment method.");
                return;
            }
    
            const orderItems: OrderItem[] = validCart.map(item => ({
                id: item.product.id,
                product: item.product,
                quantity: item.quantity
            }));
    
            // Handle WhatsApp payment specifically
            if (selectedMethod.icon === 'whatsapp') {
                const numberValue = selectedMethod.fields?.[0]?.value;
                const adminWhatsappNumber = numberValue?.replace(/\D/g, '');
    
                if (!adminWhatsappNumber) {
                    setError("لم يتم تكوين رقم واتساب للمسؤول. يرجى الاتصال بالدعم.");
                    return;
                }
    
                const productLines = validCart.map(item => ` - ${item.quantity} x ${t(item.product.name)}`).join('\n');
    
                const message = `
مرحباً، أود إتمام هذا الطلب:

*المنتجات:*
${productLines}

*المجموع:* ${subtotal.toFixed(2)} ${currency}

*بياناتي:*
الاسم: ${customerName}
البريد الإلكتروني: ${customerEmail}
${t('checkout.whatsapp')}: ${customerWhatsapp}
                `.trim().replace(/^\s*\n/gm, '');
    
                const whatsappUrl = `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(message)}`;
    
                const { error: orderError } = await addOrder({
                    order_items: orderItems,
                    total: subtotal,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_whatsapp: customerWhatsapp,
                    payment_method: selectedMethod.name,
                });
    
                if (orderError) {
                    throw orderError;
                }
    
                clearCart();
                onClose();
                window.open(whatsappUrl, '_blank');
                return;
            }
    
            const needsProof = selectedMethod.icon !== 'credit-card' && selectedMethod.enabled;
            if (needsProof && !proofUrl) {
                setError(t('checkout.upload_proof'));
                return;
            }
    
            const { error: orderError } = await addOrder({
                order_items: orderItems,
                total: subtotal,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_whatsapp: customerWhatsapp,
                payment_method: selectedMethod.name,
                payment_proof_url: proofUrl || undefined,
            });
    
            if (orderError) {
                throw orderError;
            } else {
                setOrderPlaced(true);
                clearCart();
            }
        } catch (err: any) {
            console.error("Order placement error:", err);
            setError(err.message || "Failed to place order.");
        } finally {
            setProcessing(false);
        }
    };
    
    const handleCopy = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(fieldId);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const selectedMethodDetails = site_settings.payment_methods.find(m => m.id === selectedPaymentMethodId);
    const requiresProof = selectedMethodDetails?.icon !== 'whatsapp' && selectedMethodDetails?.icon !== 'credit-card' && selectedMethodDetails?.enabled;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div dir={dir} className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-700">
                <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">{t('checkout.title')}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon /></button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {orderPlaced ? (
                        <div className="p-10 text-center">
                            <SuccessIcon />
                            <h3 className="text-2xl font-bold mt-4 text-white">{requiresProof ? t('checkout.order_pending_verification_title') : t('checkout.payment_successful')}</h3>
                            <p className="text-gray-300 mt-2">{requiresProof ? t('checkout.order_pending_verification_message') : t('checkout.order_placed_message')}</p>
                            <button onClick={onClose} className="mt-8 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-full">{t('checkout.continue_shopping')}</button>
                        </div>
                    ) : (
                       <div className="p-8">
                            {/* Order Summary */}
                            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 mb-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-white">{t('checkout.order_summary')}</h3>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-white block">{t('checkout.total')}</span>
                                        <span className="text-2xl font-bold text-amber-400">{subtotal.toFixed(2)} {currency}</span>
                                    </div>
                                </div>
                                <div className="space-y-4 max-h-40 overflow-y-auto pr-2 mt-4 border-t border-slate-700 pt-4">
                                    {validCart.map(item => (
                                        <div key={item.product.id} className="flex gap-4 items-center">
                                            <div className="relative">
                                                <img src={item.product.image_urls[0]} alt={t(item.product.name)} className="w-16 h-20 object-cover rounded-md" />
                                                <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-white">{t(item.product.name)}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-white">{item.product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form & Payment Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left: User Info */}
                                <div className="space-y-4">
                                    <input type="text" placeholder={current_user?.full_name || "User"} value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-700 p-3 rounded-lg border border-slate-600 focus:ring-amber-500 focus:border-amber-500" required/>
                                    <input type="email" placeholder={t('checkout.email')} value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full bg-slate-700 p-3 rounded-lg border border-slate-600 focus:ring-amber-500 focus:border-amber-500" required/>
                                    <input type="text" placeholder={t('checkout.whatsapp')} value={customerWhatsapp} onChange={e => setCustomerWhatsapp(e.target.value)} className="w-full bg-slate-700 p-3 rounded-lg border border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                                </div>

                                {/* Right: Payment Method */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">{t('checkout.payment_method')}</h3>
                                    <div className="space-y-3">
                                        {site_settings.payment_methods.filter(m => m.enabled).map(method => (
                                            <PaymentOption key={method.id} method={method} selected={selectedPaymentMethodId === method.id} onChange={setSelectedPaymentMethodId} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Full Width section for instructions and actions */}
                             <div className="mt-6 space-y-4">
                                {selectedMethodDetails && selectedMethodDetails.instructions && (
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                        <p className="text-sm text-gray-300 mb-3">{selectedMethodDetails.instructions}</p>
                                        {selectedMethodDetails.fields.map(field => (
                                            <div key={field.id} className="flex items-center justify-between bg-slate-700 p-2 rounded-md mt-2">
                                                <span className="text-sm text-gray-400">{field.label}:</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-white text-sm">{field.value}</span>
                                                    {field.is_copyable && (
                                                        <button onClick={() => handleCopy(field.value, field.id)} className="text-xs bg-slate-600 hover:bg-slate-500 rounded-full px-2 py-1">{copyStatus === field.id ? t('checkout.copied') : t('checkout.copy')}</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {requiresProof && (
                                    <div className="pt-2">
                                        <label htmlFor="proof-upload" className={`w-full inline-flex justify-center items-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${proofUrl ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-600 hover:bg-slate-500 text-white'}`}>
                                            {uploadingProof ? <><div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin mr-2"></div>{t('checkout.uploading_proof')}</> : (proofUrl ? <><SuccessIcon className="w-5 h-5 mr-2" />{t('checkout.proof_uploaded')}</> : <><UploadIcon />{t('checkout.upload_proof')}</>)}
                                        </label>
                                        <input id="proof-upload" type="file" className="hidden" onChange={handleProofUpload} accept="image/*" />
                                    </div>
                                )}
                                {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
                                <button onClick={handlePlaceOrder} disabled={processing || validCart.length === 0} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-full text-lg transition-transform duration-300 hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed">
                                    {processing ? t('checkout.processing') : t('checkout.pay_now')}
                                </button>
                            </div>
                       </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;