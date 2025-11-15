import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useAppContext } from '../state/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import Card from './Card';

// Icons
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const FacebookIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg> );
const TwitterIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153zm-1.8 19.498h2.84L7.058 2.544H4.03l13.07 18.107z"/></svg> );
const WhatsAppIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.49 1.32 4.95L2 22l5.25-1.38c1.41.79 3.05 1.22 4.79 1.22h.01c5.46 0 9.9-4.44 9.91-9.9C21.95 6.45 17.5 2 12.04 2zM16.53 13.96c-.2-.09-1.17-.58-1.35-.64s-.32-.09-.45.09c-.13.18-.51.64-.62.77s-.23.15-.42.06c-.19-.09-1.25-.46-2.38-1.47s-1.74-2.22-1.93-2.58c-.19-.37-.02-.57.08-.69.09-.1.2-.26.3-.39.09-.13.13-.21.2-.35.06-.13 0-.26-.04-.35-.04-.09-.45-1.08-.62-1.47-.16-.38-.32-.33-.45-.33h-.27c-.13 0-.32.04-.48.18s-.62.6-.62 1.44c0 .84.65 1.68.75 1.81s1.24 2.18 3.01 2.96c1.77.78 2.23.83 2.64.79.41-.04 1.17-.48 1.34-.94s.16-.88.11-1.04c-.05-.13-.19-.21-.39-.3z"></path></svg> );

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-5 h-5 ${rating > i ? 'text-amber-400' : 'text-gray-600'}`} />
            ))}
        </div>
    );
};

const ProductDetailPage: React.FC = () => {
    const { state, navigateTo, findProductById, addToCart, triggerFlyToCartAnimation, setCartOpen, setCheckoutOpen } = useAppContext();
    const { t } = useLanguage();
    const imgRef = useRef<HTMLImageElement>(null);
    
    // FIX: Property 'selectedProductId' does not exist on type 'AppState'. Did you mean 'selected_product_id'?
    const product = state.selected_product_id ? findProductById(state.selected_product_id) : null;
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        // Reset to first image when product changes
        setActiveImageIndex(0);
    // FIX: Property 'selectedProductId' does not exist on type 'AppState'. Did you mean 'selected_product_id'?
    }, [state.selected_product_id]);

    const { relatedProducts } = useMemo(() => {
        if (!product) return { relatedProducts: [] };
        const category = state.categories.find(c => c.products.some(p => p.id === product.id));
        if (!category) return { relatedProducts: [] };
        const products = category.products.filter(p => p.id !== product.id).slice(0, 4);
        return { relatedProducts: products };
    }, [product, state.categories]);


    if (!product) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">{t('product_detail.product_not_found')}</h1>
                <button onClick={() => navigateTo('products')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full">
                    {t('product_detail.back_to_products')}
                </button>
            </div>
        );
    }
    
    const handleAddToCart = () => {
        triggerFlyToCartAnimation(imgRef.current);
        setTimeout(() => {
            addToCart(product);
            setCartOpen(true);
        }, 200);
    };
    
    const handleBuyNow = () => {
        triggerFlyToCartAnimation(imgRef.current);
        setTimeout(() => {
            addToCart(product);
            setCheckoutOpen(true);
        }, 200);
    };

    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(`Check out this product: ${t(product.name)}`);

    return (
        <div className="bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Product Image Gallery */}
                    <div className="w-full lg:col-span-2">
                        <div className="aspect-[3/4] w-full bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-amber-500/10 group mb-4">
                            <img ref={imgRef} src={product.image_urls[activeImageIndex]} alt={`${t(product.name)} - ${activeImageIndex + 1}`} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        {product.image_urls.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {product.image_urls.map((url, index) => (
                                    <button key={index} onClick={() => setActiveImageIndex(index)} className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImageIndex === index ? 'border-amber-500' : 'border-transparent hover:border-slate-500'}`}>
                                        <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-3 flex flex-col h-full">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                            {t(product.name)}
                        </h1>
                        <div className="flex items-center gap-4 mb-6">
                            <StarRating rating={product.rating} />
                            <span className="text-gray-400">{product.rating.toFixed(1)} ({Math.floor(product.rating * 23)} {t('product_detail.reviews')})</span>
                        </div>
                        <p className="text-4xl font-bold text-amber-400 mb-6">
                            {product.price}
                        </p>
                        
                        <div className="border-t border-b border-slate-700/50 py-6 mb-6">
                             <h2 className="text-lg font-semibold text-white mb-2">{t('product_detail.description')}</h2>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                               {t(product.description)}
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleAddToCart} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300">
                                {t('product_detail.add_to_cart')}
                            </button>
                             <button onClick={handleBuyNow} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-8 rounded-full text-lg transition-transform duration-300 hover:scale-105">
                                {t('product_detail.buy_now')}
                            </button>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                            <h3 className="text-base font-semibold text-gray-300 mb-3">{t('product_detail.share')}</h3>
                            <div className="flex gap-4">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400"><FacebookIcon/></a>
                                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400"><TwitterIcon/></a>
                                <a href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400"><WhatsAppIcon/></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                 <div className="py-16 sm:py-20 bg-transparent">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{t('product_detail.you_might_also_like')}</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
                           {relatedProducts.map((p) => (
                                <Card key={p.id} item={{...p, name: t(p.name)}} onClick={() => navigateTo('product_detail', p.id)} />
                            ))}
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
