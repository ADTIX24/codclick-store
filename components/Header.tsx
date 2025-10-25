import React, { useState } from 'react';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';
// FIX: Added .ts extension to module import.
import type { PageKey } from '../types.ts';
import CartSidePanel from './CartSidePanel.tsx';
import CheckoutModal from './CheckoutModal.tsx';

// Icons
const SearchIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );
const MenuIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );
const CloseIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const CartIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> );
const ShieldIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> );


const Header: React.FC = () => {
    const { t } = useLanguage();
    const { state, navigateTo, logout, setCartOpen, setCheckoutOpen } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const { logo_url } = state.siteSettings;
    const { currentUser, cart, isCartOpen, isCheckoutOpen } = state;

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleNav = (page: PageKey) => {
        navigateTo(page);
        setIsMenuOpen(false);
    };
    
    const handleNavClick = (e: React.MouseEvent, page: PageKey) => {
        e.preventDefault();
        handleNav(page);
    };
    
    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const handleOpenCheckout = () => {
        setCartOpen(false);
        setCheckoutOpen(true);
    };

    return (
        <>
            <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-700/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="text-2xl font-bold text-amber-400">
                               {logo_url ? <img src={logo_url} alt="CODCLICK Logo" className="h-10 w-auto" /> : 'CODCLICK'}
                            </a>
                        </div>

                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-1 items-center justify-center px-8 lg:px-16">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="search"
                                    placeholder={t('header.search_placeholder')}
                                    className="bg-slate-700/50 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full transition-all"
                                />
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                            </div>
                        </div>

                        {/* Actions: Auth & Cart */}
                        <div className="hidden md:flex items-center justify-end space-x-4">
                            {currentUser ? (
                                <>
                                    {currentUser.role === 'owner' && (
                                        <button onClick={() => handleNav('admin')} className="p-2 rounded-full hover:bg-slate-700 transition-colors" title="Admin Dashboard" aria-label="Admin Dashboard">
                                            <ShieldIcon />
                                        </button>
                                    )}
                                    <button onClick={() => handleNav('my_account')} className="text-base font-medium text-gray-300 hover:text-amber-400 transition-colors whitespace-nowrap">{t('header.my_account')}</button>
                                    <div className="h-4 w-px bg-slate-600"></div>
                                    <button onClick={handleLogout} className="text-base font-medium text-gray-300 hover:text-amber-400 transition-colors whitespace-nowrap">{t('header.logout')}</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => navigateTo('auth', null, 'login')} className="text-base font-medium text-gray-300 hover:text-amber-400 transition-colors whitespace-nowrap ml-4">{t('header.login')}</button>
                                    <button onClick={() => navigateTo('auth', null, 'signup')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-full text-sm transition-colors whitespace-nowrap">{t('header.signup')}</button>
                                </>
                            )}
                            <div className="h-6 w-px bg-slate-600"></div>
                            <button id="cart-icon-target" onClick={() => setCartOpen(true)} className="relative text-gray-300 hover:text-amber-400 transition-colors p-2">
                                <CartIcon />
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                             <button id="cart-icon-target-mobile" onClick={() => setCartOpen(true)} className="relative text-gray-300 hover:text-amber-400 transition-colors p-2 mr-2">
                                <CartIcon />
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500">
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="pt-4 pb-3 border-t border-slate-700 space-y-4">
                         <div className="relative w-full px-5">
                            <input
                                type="search"
                                placeholder={t('header.search_placeholder')}
                                className="bg-slate-700/50 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                            />
                             <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                        </div>
                        <div className="flex items-center justify-center px-5 space-x-4">
                            {currentUser ? (
                                 <>
                                    {currentUser.role === 'owner' && (
                                        <button onClick={() => handleNav('admin')} className="p-2 rounded-full hover:bg-slate-700 transition-colors" title="Admin Dashboard" aria-label="Admin Dashboard">
                                            <ShieldIcon />
                                        </button>
                                    )}
                                    <button onClick={() => handleNav('my_account')} className="text-base font-medium text-gray-300 hover:text-amber-400 transition-colors">{t('header.my_account')}</button>
                                    <div className="h-4 w-px bg-slate-600"></div>
                                    <button onClick={handleLogout} className="text-base font-medium text-gray-300 hover:text-amber-400 transition-colors">{t('header.logout')}</button>
                                </>
                            ) : (
                                 <>
                                    <button onClick={() => { navigateTo('auth', null, 'login'); setIsMenuOpen(false); }} className="text-base font-medium text-gray-300 hover:text-amber-400 transition-colors ml-4">{t('header.login')}</button>
                                    <button onClick={() => { navigateTo('auth', null, 'signup'); setIsMenuOpen(false); }} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-full text-sm transition-colors">{t('header.signup')}</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <CartSidePanel isOpen={isCartOpen} onClose={() => setCartOpen(false)} onCheckout={handleOpenCheckout} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setCheckoutOpen(false)} />
        </>
    );
};

export default Header;