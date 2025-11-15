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
    const { state, navigateTo, logout, setCartOpen, setCheckoutOpen, setSearchTerm } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const { logo_url } = state.site_settings;
    const { current_user, cart, is_cart_open, is_checkout_open, search_term, current_page } = state;

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleNav = (page: PageKey) => {
        navigateTo(page);
        setIsMenuOpen(false);
    };
    
    const handleNavClick = (e: React.MouseEvent, page: PageKey) => {
        e.preventDefault();
        handleNav(page);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search_term.trim()) {
            navigateTo('products');
        }
    };
    
    const NavLink: React.FC<{ page: PageKey; children: React.ReactNode }> = ({ page, children }) => (
        <a href="#" onClick={(e) => handleNavClick(e, page)} className={`px-3 py-2 rounded-md text-sm font-medium ${current_page === page ? 'text-amber-400' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            {children}
        </a>
    );

    return (
        <>
            <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-30 border-b border-slate-700/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700">
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                            <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="flex-shrink-0 ml-4 lg:ml-0">
                                {logo_url ? <img src={logo_url} alt="CODCLICK Logo" className="h-10 w-auto" /> : <span className="text-2xl font-bold text-amber-400">CODCLICK</span>}
                            </a>
                        </div>
                        
                        {/* Desktop Search Bar */}
                        <div className="hidden lg:flex flex-1 justify-center px-8">
                            <div className="w-full max-w-lg">
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <SearchIcon />
                                    </div>
                                    <input
                                        type="search"
                                        value={search_term}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-full border-0 bg-slate-700 py-2.5 pr-10 pl-4 text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm"
                                        placeholder={t('header.search_placeholder')}
                                    />
                                </form>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex items-center gap-2">
                                {current_user ? (
                                    <>
                                        <NavLink page={current_user.role === 'owner' || current_user.role === 'moderator' ? 'admin' : 'my_account'}>{t('header.my_account')}</NavLink>
                                        <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white">{t('header.logout')}</button>
                                    </>
                                ) : (
                                    <>
                                        <NavLink page="auth">{t('header.login')}</NavLink>
                                        <button onClick={() => navigateTo('auth', null, 'signup')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-full text-sm transition-colors">{t('header.signup')}</button>
                                    </>
                                )}
                            </div>

                            <button id="cart-icon-target" onClick={() => setCartOpen(true)} className="relative text-gray-300 hover:text-amber-400 p-2">
                                <CartIcon />
                                {cartItemCount > 0 && <span className="absolute top-0 right-0 block h-5 w-5 rounded-full text-center text-xs font-bold bg-amber-500 text-slate-900">{cartItemCount}</span>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <div className="p-2">
                                 <form onSubmit={handleSearch} className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <SearchIcon />
                                    </div>
                                    <input
                                        type="search"
                                        value={search_term}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-full border-0 bg-slate-700 py-2 pr-10 pl-4 text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm"
                                        placeholder={t('header.search_placeholder')}
                                    />
                                </form>
                            </div>

                            <NavLink page="home">الرئيسية</NavLink>
                            <NavLink page="products">{t('header.all_cards')}</NavLink>
                            
                            <div className="border-t border-slate-700 my-2"></div>
                            
                             {current_user ? (
                                <>
                                    <NavLink page={current_user.role === 'owner' || current_user.role === 'moderator' ? 'admin' : 'my_account'}>{t('header.my_account')}</NavLink>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-right px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white">{t('header.logout')}</button>
                                </>
                            ) : (
                                <>
                                    <NavLink page="auth">{t('header.login')}</NavLink>
                                    <button onClick={() => { navigateTo('auth', null, 'signup'); setIsMenuOpen(false); }} className="block w-full text-right px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white">{t('header.signup')}</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>
            <CartSidePanel 
                isOpen={is_cart_open}
                onClose={() => setCartOpen(false)}
                onCheckout={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                }}
            />
            <CheckoutModal 
                isOpen={is_checkout_open}
                onClose={() => setCheckoutOpen(false)}
            />
        </>
    );
};
// FIX: Added default export to resolve module import error.
export default Header;